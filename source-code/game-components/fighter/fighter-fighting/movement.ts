import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import Coords from '../../../interfaces/game/fighter/coords';
import { Edge } from "../../../interfaces/game/fighter/edge";
import { wait, getDirectionOfPosition2FromPosition1 } from "../../../helper-functions/helper-functions";
import { MoveAction } from "../../../types/fighter/action-name";
import { octagon } from "../../fight/octagon";
import { getFighterModelDimensions, getDirectionOfEnemyStrikingCenter, isFacingAwayFromEnemy, getDistanceOfEnemyStrikingCenter } from "./proximity";
import { getRepositionMoveDirection } from "./reposition";
import { Angle } from "../../../types/game/angle";
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right";
import { getRetreatAroundEdgeDirection } from "./retreat-around-edge";

export default class Movement {

  
  movingDirection: Angle
  coords: Coords = {x: 0, y: 0}

  reverseMoving: boolean

  moveActionInProgress: MoveAction

  stuckCounter = 0

  

  constructor(public fighting: FighterFighting){
  }


  doMoveAction(enemy: Fighter, moveAction: MoveAction){    
    const {flanking, timers, proximity, facingDirection, fighter, actions} = this.fighting

    
    this.moveActionInProgress = moveAction

    timers.start('move action in progress')


    this.fighting.enemyTargetedForAttack = 
    moveAction == 'move to attack' ? enemy : null

    const shouldRetreatAroundEdge = (
      proximity.againstEdge && 
      moveAction != 'move to attack' ||
      moveAction == 'retreat around edge'
    )

    if(shouldRetreatAroundEdge){
      this.moveActionInProgress = 'retreat around edge'
      this.movingDirection = getRetreatAroundEdgeDirection(enemy, this.fighting)
    }
    else{
      if(moveAction == 'retreat from flanked')
        this.movingDirection = flanking.getRetreatFromFlankedDirection()
      else if(moveAction == 'reposition'){
        const repositionDirection = getRepositionMoveDirection(this.fighting.fighter)
        if(repositionDirection){
          this.movingDirection = repositionDirection
        }
      }

      else if(moveAction == 'move to attack'){
        this.movingDirection = getDirectionOfEnemyStrikingCenter(enemy, this.fighting.fighter)
        if(proximity.isEnemyTooCloseForStrikingCenter(enemy)){
          //console.log(`${this.fighting.fighter.name} too close to ${enemy.name}`);
          //this.movingDirection = proximity.getDirectionOfEnemyCenterPoint(enemy, moveAction != 'move to attack')
        }
      }
      else{
        this.movingDirection = proximity.getDirectionOfEnemyCenterPoint(enemy, true)
        
      }
    }

    let willTurnAround
    const movingLeftOrRight: LeftOrRight = this.movingDirection < 180 ? 'right' : 'left'

    if(moveAction == 'cautious retreat'){
      if(movingLeftOrRight == facingDirection){
        willTurnAround = true
      }
    }
    else if(moveAction == 'move to attack'){
      if(isFacingAwayFromEnemy(enemy, fighter)){
        willTurnAround = true
      }
    }
    else {
      if(movingLeftOrRight != facingDirection){
        willTurnAround = true
      }
    } 

    
    return actions.actionPromise({
      isMain: true,
      promise: (
        willTurnAround ?
          actions.actionPromise({promise: this.turnAround()}) : 
          Promise.resolve()
        .then(() => 
          actions.actionPromise({name: 'move', promise: this.moveABit()})
        )
      )
    })
  }


  turnAround(){
    const {timers, animation, fighter, actions} = this.fighting

    return (
      actions.actionPromise({
        name: 'turn around',
        promise: animation.start({
          name: 'turning around',
          duration: animation.speedModifier(150)
        })
      })
      .then(() => {      
        this.fighting.facingDirection = this.fighting.facingDirection == 'left' ? 'right' : 'left'
        timers.start('just turned around')
        return actions.actionPromise({promise: animation.cooldown(100)})
      })
    )
  }

  
  async moveABit(): Promise<void> {   
    const {proximity} = this.fighting
    this.fighting.modelState = this.moveActionInProgress == 'cautious retreat' ? 'Defending' : 'Walking'
    const newMoveCoords: Coords = this.getNewMoveCoords(this.movingDirection, this.coords)

    if(this.isMoveOutsideOfBounds(newMoveCoords)){
      this.stuckCounter ++
      if(this.stuckCounter >= 3){
        await this.moveAwayFromEdge()
      }
    }
    else{
      this.stuckCounter = 0
      const oldCoords = this.coords
      await wait(this.moveSpeed())
      this.coords = newMoveCoords
      proximity.againstEdge = proximity.getNearestEdge()?.edgeName
      this.handlePassedEnemy(oldCoords)
      this.checkIfInCorner()
      return
    }
  }


  handlePassedEnemy(oldCoords: Coords){
    const {logistics, fighter, facingDirection, proximity, rememberedEnemyBehind} = this.fighting
    const movingLeftOrRight: LeftOrRight = this.movingDirection <= 180 ? 'right' : 'left'

    let passedEnemy: Fighter

    if(movingLeftOrRight == 'left'){
      passedEnemy = logistics.otherFightersStillFighting().find(f => {
        const {x} = f.fighting.movement.coords
        if(x < oldCoords.x && x > this.coords.x)
          return true
      })   
    }

    if(movingLeftOrRight == 'right'){
      passedEnemy = logistics.otherFightersStillFighting().find(f => {
        const {x} = f.fighting.movement.coords
        if(x > oldCoords.x && x < this.coords.x)
          return true
      })
    }   
    if(passedEnemy){
      // this fighter update memory
      if(facingDirection == movingLeftOrRight){
        if(rememberedEnemyBehind){
          const rememberedDistance = getDistanceOfEnemyStrikingCenter(rememberedEnemyBehind, fighter)
          const passedDistance = getDistanceOfEnemyStrikingCenter(passedEnemy, fighter)
          if(passedDistance < rememberedDistance){            
            proximity.rememberEnemyBehind(passedEnemy)
          }
        }
        else{
          proximity.rememberEnemyBehind(passedEnemy)
        }
      }
      else if(rememberedEnemyBehind?.name == passedEnemy.name){
        proximity.rememberEnemyBehind(undefined)
      }

      // enemy fighter update memory

      if(passedEnemy.fighting.facingDirection == movingLeftOrRight){
        if(passedEnemy.fighting.rememberedEnemyBehind?.name == fighter.name){
          passedEnemy.fighting.proximity.rememberEnemyBehind(undefined)
        }
        
      }
      else if(passedEnemy.fighting.rememberedEnemyBehind){
        const rememberedDistance = getDistanceOfEnemyStrikingCenter(passedEnemy.fighting.rememberedEnemyBehind, passedEnemy)
        const thisDistance = getDistanceOfEnemyStrikingCenter(fighter, passedEnemy)
        if(thisDistance < rememberedDistance){            
          passedEnemy.fighting.proximity.rememberEnemyBehind(fighter)
        }
      }
      else{         
        passedEnemy.fighting.proximity.rememberEnemyBehind(fighter)
      }


    }



  }

  checkIfInCorner(){
    const {proximity} = this.fighting
    const nearEdges: Edge[] = proximity.getNearEdges()    
    if(nearEdges.length == 2)
      proximity.inCornerOfEdges = nearEdges
    else
      proximity.inCornerOfEdges = undefined
  }

  moveSpeed(){
    const {logistics, stats, timers, fighter} = this.fighting
    const {activeTimers} = timers
    const {speed} = stats  

    const onARampage = activeTimers.some(timer => timer.name == 'on a rampage')

    let speedBoostActive: boolean = false
    if(this.moveActionInProgress == 'fast retreat' || onARampage || this.moveActionInProgress == 'retreat from flanked' || this.moveActionInProgress == 'retreat around edge' || this.moveActionInProgress == 'reposition')
      speedBoostActive = true

    let timeToMove2Pixels = (100 - (speed * 5))
    if(this.moveActionInProgress == 'cautious retreat') 
      timeToMove2Pixels *=  1.15
    if(speedBoostActive)
      timeToMove2Pixels *= 0.6

    if(timeToMove2Pixels < 10) timeToMove2Pixels = 10
    return Math.round(timeToMove2Pixels)
  }
  

  isMoveOutsideOfBounds(newMoveCoords: Coords): boolean{
    const {fighter, timers, proximity} = this.fighting
    const modelWidth = getFighterModelDimensions(fighter, 'Idle').width 
    
    for (let edgeKey of octagon.edgeKeys) {
      const point: Coords = {...newMoveCoords}
      switch (edgeKey) {    
        case 'bottomLeft': point.x -= modelWidth*.4; break;
        case 'left': point.x -= modelWidth*.5; break;
        case 'topLeft': point.y += 10; point.x -= modelWidth*.4; break;
        case 'top': point.y += 20; break;
        case 'topRight': point.y += 10; point.x += modelWidth*.4; break;
        case 'right': point.x += modelWidth*.5; break;
        case 'bottomRight': point.x += modelWidth*.4
        break;    
      }

      const pointOutsideOfEdge: boolean = octagon.isPointOutsideOfEdge(edgeKey, point)
      if (pointOutsideOfEdge) {
        return true
      }

    }
    return false
  }


  private getNewMoveCoords(direction: Angle, coords: Coords): Coords {

    if(isNaN(direction))
      debugger

    const moveAmount = 2
    let addXAmount
    let addYAmount

    if (direction >= 0 && direction < 90) {
      addXAmount = Math.sin(direction * Math.PI / 180) * moveAmount
      addYAmount = Math.cos(direction * Math.PI / 180) * moveAmount
    }
    else if (direction >= 90 && direction < 180) {
      addXAmount = Math.cos((direction - 90) * Math.PI / 180) * moveAmount
      addYAmount = Math.sin((direction - 90) * Math.PI / 180) * moveAmount
      addYAmount *= -1
    }
    else if (direction >= 180 && direction < 270) {
      addXAmount = Math.sin((direction - 180) * Math.PI / 180) * moveAmount
      addYAmount = Math.cos((direction - 180) * Math.PI / 180) * moveAmount
      addYAmount *= -1
      addXAmount *= -1
    }
    else if (direction >= 270 && direction < 360) {
      addXAmount = Math.cos((direction - 270) * Math.PI / 180) * moveAmount
      addYAmount = Math.sin((direction - 270) * Math.PI / 180) * moveAmount
      addXAmount *= -1
    }

    const x = Math.round((coords.x + addXAmount) * 100) / 100
    const y = Math.round((coords.y + addYAmount) * 100) / 100

    if(isNaN(x) || isNaN(y))
      debugger


    return {x, y}
  }

  moveAwayFromEdge(){
    const {proximity} = this.fighting
    const edge: Edge = proximity.getNearestEdge().edgeName
    const coordsOnEdge: Coords = octagon.getClosestCoordsOnAnEdgeFromAPoint(edge, this.coords)
    this.movingDirection = getDirectionOfPosition2FromPosition1(coordsOnEdge, this.coords)
    return this.moveABit()
  }

};
