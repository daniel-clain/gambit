import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import Coords from '../../../interfaces/game/fighter/coords';
import { Edge, edgeNames } from "../../../types/fighter/edge";
import { wait } from "../../../helper-functions/helper-functions";
import { MoveAction } from "../../../types/fighter/action-name";
import { octagon } from "../../fight/octagon";
import { getDistanceOfEnemyStrikingCenter, isFacingAwayFromEnemy, getDirectionOfPosition2FromPosition1, getFighterBasePointFromEdge } from "./proximity";
import { Angle } from "../../../types/game/angle";
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right";
import { DirectionBasedOn } from "../../../types/fighter/direction-based-on";
import { fighterRetreatImplementation } from "./fighter-retreat.i";
import { getRetreatDirection } from "./fighter-retreat";
import { toPercent } from "../../../types/game/percent";

export default class Movement{

  
  movingDirection: Angle
  coords: Coords = {x: 0, y: 0}
  reverseMoving: boolean
  stuckCounter = 0
  moveAction: MoveAction
  moveLoopReject: (reason: string) => void
  speedModifier: 'very fast' | 'fast' | 'normal' | 'slow'
  directionBasedOn: DirectionBasedOn
  fighterRetreatImplementation: ReturnType<typeof fighterRetreatImplementation>

  constructor(private fighting: FighterFighting){
    this.turnAround = this.turnAround.bind(this)
    this.fighterRetreatImplementation = fighterRetreatImplementation(fighting)
  }

  getExponentialMoveFactor(total: number):number{
    const {timers}= this.fighting
    const {timeElapsed, maxDuration} = timers.get('move action')

    const timerPercentage = toPercent(1 - timeElapsed/maxDuration)

    const exponentialTimerPercentage = toPercent(Math.pow(timerPercentage, 1.3))

    const returnProbability = total * exponentialTimerPercentage

    return returnProbability
  }
  

  startMoveLoop(moveAction: MoveAction){
    const {fighter, timers} = this.fighting
    console.log(`${fighter.name} move loop started`);
    this.moveAction = moveAction
    timers.start('move action')
    if(moveAction == 'move to attack'){    
      this.fighting.enemyTargetedForAttack = this.fighting.logistics.closestRememberedEnemy
    }

    this.setSpeedModifier()
    this.moveLoop()
  }

  stopMoveLoop(reason){
    this.moveLoopReject(reason)
  }

  private async moveLoop(){
    return new Promise<void>(async (resolve, reject) => {
      this.moveLoopReject = reject
      
      try{
        await this.moveABit()
      }catch(reason){
        if(typeof reason == 'string')
          this.moveLoopReject(reason)
      }
      
      await wait(this.moveSpeed)
      
      resolve()
    })
    .then(this.moveLoop.bind(this))
    .catch((reason) => {
      const {fighter} = this.fighting
      console.log(`${fighter.name} move loop finished. ${reason}`);
    })
  }

  
  
  private async moveABit(): Promise<void> { 
    const {proximity, fighter} = this.fighting

    this.movingDirection = (
      this.moveAction == 'move to attack' ?
        proximity.attackDirection :
        getRetreatDirection(this.fighting)
    )

    this.checkIfMoveStillValid()


    if(this.fighting.energy > 0){
      if(this.speedModifier == 'very fast')
        this.fighting.energy -= .2
      if(this.speedModifier == 'fast')
        this.fighting.energy -= .1
    }  

    const newMoveCoords: Coords = this.getNewMoveCoords(this.movingDirection, this.coords)

    if(this.isMoveOutsideOfBounds(newMoveCoords)){
      this.stuckCounter ++
      if(this.stuckCounter >= 3){
        console.warn(`stuck 3 times moving away from edge ${this.fighting.fighter.name}`)
        await this.moveAwayFromEdge()
      }
    }
    else{
      this.stuckCounter = 0
      const oldCoords = this.coords
      this.coords = newMoveCoords
      console.log(`${fighter.name} moving, ${this.moveAction}`);
      this.handlePassedEnemy(oldCoords)
    }
  }

  turnAround(){    
    const {facingDirection} = this.fighting
    this.fighting.facingDirection = facingDirection == 'left' ? 'right' : 'left'
    return Promise.resolve()
  }

  private checkIfMoveStillValid(){
    const {proximity, logistics, enemyTargetedForAttack} = this.fighting

    if(!this.movingDirection)
      throw 'no move direction'

    const moveToAttackEnemyArrived = (
      this.moveAction == 'move to attack' &&
      proximity.enemyWithinStrikingRange(enemyTargetedForAttack)
    )

    if(moveToAttackEnemyArrived) 
      throw 'move to attack enemy arrived'
    
  }


  private setSpeedModifier(){
    const {onARampage} = this.fighting.logistics
    this.speedModifier = (
      (
        (this.moveAction == 'desperate retreat' || onARampage)
        && 'very fast' 
      ) || (
        this.moveAction == 'strategic retreat'
        && 'fast' 
      ) || (
        this.moveAction == 'cautious retreat'
        && 'slow'
      ) ||
      'normal'
    )
  }


  get moveSpeed(): number{
    
    const {stats} = this.fighting
    const {speed} = stats  


    let timeToMove2Pixels = (100 - (speed * 4))

    if(this.fighting.energy > 0){
      if(this.speedModifier == 'very fast')
        timeToMove2Pixels *= 0.3
      if(this.speedModifier == 'fast')
        timeToMove2Pixels *= .6
    }

    if(this.speedModifier == 'slow') 
      timeToMove2Pixels *=  1.15

    if(timeToMove2Pixels < 10) timeToMove2Pixels = 10

    return Math.round(timeToMove2Pixels)
  }
  
  get shouldTurnAround(): boolean{
    const {facingDirection, fighter, logistics} = this.fighting
    const movingLeftOrRight: LeftOrRight = this.movingDirection < 180 ? 'right' : 'left'

    if(this.moveAction == 'cautious retreat'){
      if(movingLeftOrRight == facingDirection){
        return true
      }
    }
    else if(this.moveAction == 'move to attack'){
      if(isFacingAwayFromEnemy(logistics.closestRememberedEnemy, fighter)){
        return true
      }
    }
    else {
      if(movingLeftOrRight != facingDirection){
        return true
      }
    }
  }
  

  private handlePassedEnemy(oldCoords: Coords){
    const {logistics, fighter, facingDirection} = this.fighting
    const movingLeftOrRight: LeftOrRight = this.movingDirection <= 180 ? 'right' : 'left'

    let passedEnemy: Fighter

    if(movingLeftOrRight == 'left'){
      passedEnemy = logistics.otherFightersStillFighting.find(f => {
        const {x} = f.fighting.movement.coords
        if(x < oldCoords.x && x > this.coords.x)
          return true
      })   
    }

    if(movingLeftOrRight == 'right'){
      passedEnemy = logistics.otherFightersStillFighting.find(f => {
        const {x} = f.fighting.movement.coords
        if(x > oldCoords.x && x < this.coords.x)
          return true
      })
    }   
    if(passedEnemy){

        console.log(`${fighter.name} has passed ${passedEnemy.name}. facing ${facingDirection}, moving ${movingLeftOrRight}, remembered enemy behind ${logistics.rememberedEnemyBehind?.name}`);

      /* if(logistics.persistAlongEdgePastFlanker?.name == passedEnemy.name){
        console.log(`${fighter.name} has passed flanker ${passedEnemy.name}`);
        logistics.persistAlongEdgePastFlanker = undefined
      } */

      // this fighter update memory
      if(facingDirection == movingLeftOrRight){
        if(logistics.rememberedEnemyBehind){
          const rememberedDistance = getDistanceOfEnemyStrikingCenter(logistics.rememberedEnemyBehind, fighter)
          const passedDistance = getDistanceOfEnemyStrikingCenter(passedEnemy, fighter)
          if(passedDistance < rememberedDistance){
            this.fighting.rememberEnemyBehind(passedEnemy)
          }
        }
        else{
          this.fighting.rememberEnemyBehind(passedEnemy)
        }
      }
      else if(logistics.rememberedEnemyBehind?.name == passedEnemy.name){
        this.fighting.rememberEnemyBehind(undefined)
      }

      // enemy fighter update memory

      const passedRememberedEnemyBehind = passedEnemy.fighting.logistics.rememberedEnemyBehind

      if(passedEnemy.fighting.facingDirection == movingLeftOrRight){
        console.log(`${passedEnemy.name} was passed by ${fighter.name}from behind`);
        if(passedRememberedEnemyBehind?.name == fighter.name){
          
          console.log(`${passedEnemy.name}'s memory or behind was ${fighter.name}, so he now has no memory of whose behind`);
          passedEnemy.fighting.rememberEnemyBehind(undefined)
        }
        
      }
      else if(!!passedRememberedEnemyBehind){
        const rememberedDistance = getDistanceOfEnemyStrikingCenter(passedRememberedEnemyBehind, passedEnemy)
        const thisDistance = getDistanceOfEnemyStrikingCenter(fighter, passedEnemy)

        console.log(`${passedEnemy.name} was passed by ${fighter.name} from in front and is now behind`);
        if(thisDistance < rememberedDistance){            
          passedEnemy.fighting.rememberEnemyBehind(fighter)
          console.log(`${fighter.name} is closer than remembered enemy behind (${passedRememberedEnemyBehind.name}), so new enemy behind is now ${fighter.name}`);
        }
      }
      else {
        passedEnemy.fighting.rememberEnemyBehind(fighter)
      }
    }
  }


  private isMoveOutsideOfBounds(newMoveCoords: Coords): boolean{
    const newMoveDiff = {
      x: newMoveCoords.x - this.coords.x,
      y: newMoveCoords.y - this.coords.y,
    }
    return edgeNames.some(edge => {
      const fighterBasePoint =  getFighterBasePointFromEdge(edge, this.fighting)
      const newBasePoint = {
        x: fighterBasePoint.x + newMoveDiff.x,
        y: fighterBasePoint.y + newMoveDiff.y,
      }
      const pointOutsideOfEdge: boolean = octagon.isPointOutsideOfEdge(edge, newBasePoint)
      if (pointOutsideOfEdge) {
        return true
      }
    })
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
    const {edge} = this.fighting.proximity.getClosestEdge()

    const coordsOnEdge: Coords = octagon.getClosestCoordsOnAnEdgeFromAPoint(edge, this.coords)

    this.movingDirection = getDirectionOfPosition2FromPosition1(coordsOnEdge, this.coords)
  }

};
