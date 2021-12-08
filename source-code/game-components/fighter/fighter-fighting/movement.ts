import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import Coords from '../../../interfaces/game/fighter/coords';
import { Edge } from "../../../interfaces/game/fighter/edge";
import { wait, getDirectionOfPosition2FromPosition1 } from "../../../helper-functions/helper-functions";
import { MoveAction } from "../../../types/fighter/action-name";
import { octagon } from "../../abilities-general/fight/new-octagon";
import { getFighterModelDimensions, getDirectionOfEnemyStrikingCenter, isFacingAwayFromEnemy } from "./proximity";
import { getRepositionMoveDirection } from "./repositioning";
import { Angle } from "../../../types/game/angle";

export default class Movement {

  
  movingDirection: Angle
  coords: Coords = {x: 0, y: 0}

  reverseMoving: boolean

  moveActionInProgress: MoveAction

  stuckCounter = 0
  

  constructor(public fighting: FighterFighting){
  }


  async doMoveAction(enemy: Fighter, moveAction: MoveAction): Promise<void>{    
    const {flanking, timers, proximity} = this.fighting

    
    this.moveActionInProgress = moveAction

    timers.start('move action in progress')


    this.fighting.enemyTargetedForAttack = 
    moveAction == 'move to attack' ? enemy : null

    
    if(proximity.againstEdge && moveAction != 'move to attack' || moveAction == 'retreat around edge')
      this.movingDirection = proximity.getRetreatAroundEdgeDirection(enemy)
    else{
      if(moveAction == 'retreat from flanked')
        this.movingDirection = flanking.getRetreatFromFlankedDirection()
      else if(moveAction == 'reposition')
        this.movingDirection = getRepositionMoveDirection(enemy, this.fighting.fighter)
      else
        this.movingDirection = getDirectionOfEnemyStrikingCenter(enemy, this.fighting.fighter, moveAction != 'move to attack')
    }
    
    const faceAwayMoveActions: MoveAction[] = ['fast retreat', 'retreat', 'retreat from flanked']
    const moveActionFacesAway = faceAwayMoveActions.some(a => a == moveAction)   

    const moveActionFacesToward = ['move to attack', 'cautious retreat'].some(a => a == moveAction)

    let interrupted: boolean
    if(
      (moveActionFacesAway && !isFacingAwayFromEnemy(enemy, this.fighting.fighter))
      ||
      (moveActionFacesToward && isFacingAwayFromEnemy(enemy, this.fighting.fighter)) 
      ||
      (
        (
          moveAction == 'retreat around edge' ||
          moveAction == 'reposition'
        ) 
        && 
        (
          (this.fighting.facingDirection == 'left' && this.movingDirection < 180) 
          ||
          (this.fighting.facingDirection == 'right' && this.movingDirection >= 180)
        )
      )
    )
      await this.turnAround().catch(() => interrupted = true)

    if(!interrupted)
      await this.moveABit()

    return
  }

  async turnAround(){
    const {timers, animation, flanking} = this.fighting
    return animation.start({
      name: 'turning around',
      duration: animation.speedModifier(150)
    })
    .then(() => {      
      this.fighting.facingDirection = this.fighting.facingDirection == 'left' ? 'right' : 'left'
      timers.start('just turned around')
      return animation.cooldown(100)
    })

  }

  
  async moveABit(): Promise<void> {    
    const {logistics} = this.fighting
    this.fighting.modelState = this.moveActionInProgress == 'cautious retreat' ? 'Defending' : 'Walking'
    const newMoveCoords: Coords = this.getNewMoveCoords(this.movingDirection, this.coords)

    if(this.isMoveOutsideOfBounds(newMoveCoords)){
      this.stuckCounter ++
      if(this.stuckCounter >= 3){
        this.moveAawayFromEdge()
      }
      return
    }
    else{
      this.stuckCounter = 0
      this.coords = newMoveCoords
      this.checkIfInCorner()
      await wait(this.moveSpeed())
      return
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
    const {logistics, stats, timers} = this.fighting
    const {activeTimers} = timers
    const {speed} = stats  

    const onARampage = activeTimers.some(timer => timer.name == 'on a rampage')

    let speedBoostActive: boolean = false
    if(this.moveActionInProgress == 'fast retreat' || onARampage || this.moveActionInProgress == 'retreat from flanked' || this.moveActionInProgress == 'retreat around edge' || this.moveActionInProgress == 'reposition')
      speedBoostActive = true

    let timeToMove2Pixels = (100 - (speed * 10))
    if(this.moveActionInProgress == 'cautious retreat') 
      timeToMove2Pixels *=  1.15
    if(speedBoostActive)
      timeToMove2Pixels *= 0.25
    return timeToMove2Pixels
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
        proximity.againstEdge = edgeKey
        return true
      }

    }
    proximity.againstEdge = undefined
    return false
  }


  private getNewMoveCoords(direction: Angle, coords: Coords): Coords {

    if(isNaN(direction))
      debugger

    const moveAmount = 2
    let addXAmmount
    let addYAmmount

    if (direction >= 0 && direction < 90) {
      addXAmmount = Math.sin(direction * Math.PI / 180) * moveAmount
      addYAmmount = Math.cos(direction * Math.PI / 180) * moveAmount
    }
    else if (direction >= 90 && direction < 180) {
      addXAmmount = Math.cos((direction - 90) * Math.PI / 180) * moveAmount
      addYAmmount = Math.sin((direction - 90) * Math.PI / 180) * moveAmount
      addYAmmount *= -1
    }
    else if (direction >= 180 && direction < 270) {
      addXAmmount = Math.sin((direction - 180) * Math.PI / 180) * moveAmount
      addYAmmount = Math.cos((direction - 180) * Math.PI / 180) * moveAmount
      addYAmmount *= -1
      addXAmmount *= -1
    }
    else if (direction >= 270 && direction < 360) {
      addXAmmount = Math.cos((direction - 270) * Math.PI / 180) * moveAmount
      addYAmmount = Math.sin((direction - 270) * Math.PI / 180) * moveAmount
      addXAmmount *= -1
    }

    const x = Math.round((coords.x + addXAmmount) * 100) / 100
    const y = Math.round((coords.y + addYAmmount) * 100) / 100

    if(isNaN(x) || isNaN(y))
      debugger


    return {x, y}
  }

  moveAawayFromEdge(){
    const {proximity} = this.fighting
    const edge: Edge = proximity.getNearestEdge().edgeName
    const coordsOnEdge: Coords = octagon.getClosestCoordsOnAnEdgeFromAPoint(edge, this.coords)
    this.movingDirection = getDirectionOfPosition2FromPosition1(coordsOnEdge, this.coords)
    this.moveABit()
  }

};
