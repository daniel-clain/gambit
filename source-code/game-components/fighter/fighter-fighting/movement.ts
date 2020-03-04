import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import Coords from '../../../interfaces/game/fighter/coords';
import Direction360 from "../../../types/figher/direction-360";
import Octagon from "../../fight/octagon";
import { Edge } from "../../../interfaces/game/fighter/edge";
import { random, wait } from "../../../helper-functions/helper-functions";
import FacingDirection from "../../../types/figher/facing-direction";
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance";
import { MoveAction } from "../../../types/figher/action-name";

export default class Movement {

  
  private movingDirection: Direction360
  coords: Coords = {x: 0, y: 0}

  reverseMoving: boolean


  moveInterval
  moveDurationTimer

  nearEdge: Edge

  constructor(public fighting: FighterFighting){}


  async doMoveAction(enemy: Fighter, moveAction: MoveAction): Promise<void>{    
    const {proximity, flanking, logistics} = this.fighting
    
    logistics.moveActionInProgress = moveAction

    this.fighting.enemyTargetedForAttack = 
    moveAction == 'move to attack' ? enemy : null
    
    if(moveAction == 'retreat from flanked')
      this.movingDirection = flanking.getRetreatFromFlankedDirection()
    else
      this.movingDirection = proximity.getDirectionOfEnemyStrikingCenter(enemy, moveAction != 'move to attack')

    const moveActionFacesAway = ['fast retreat', 'retreat'].some(a => a == moveAction)   

    const moveActionFacesToward = ['move to attack', 'cautious retreat'].some(a => a == moveAction)

    let interupted: boolean
    if(moveActionFacesAway && !proximity.isFacingAwayFromEnemy(enemy) ||
      moveActionFacesToward && proximity.isFacingAwayFromEnemy(enemy))
      await this.turnAround().catch(() => interupted = true)

    if(!interupted)
      await this.moveABit()

    return
  }

  async turnAround(){
    const {timers, animation, flanking} = this.fighting
    return animation.start({
      name: 'turning around',
      duration: animation.speedModifier(100)
    })
    .then(() => {      
      this.fighting.facingDirection = this.fighting.facingDirection == 'left' ? 'right' : 'left'
      timers.start('just turned around')
      flanking.determineIfFlanked()
      return animation.cooldown(80)
    })

  }

  
  async moveABit(): Promise<void> {    
    const {logistics} = this.fighting
    this.fighting.modelState = logistics.moveActionInProgress == 'cautious retreat' ? 'Defending' : 'Walking'
    const newMoveCoords: Coords = this.getNewMoveCoords(this.movingDirection, this.coords)
    if(this.isMoveOutsideOfBounds(newMoveCoords))
      return
    else{
      this.coords = newMoveCoords
      return wait(this.moveSpeed())
    }

    
  }

  moveSpeed(){
    const {logistics, stats, timers} = this.fighting
    const {activeTimers} = timers
    const {speed} = stats  

    const onARampage = activeTimers.some(timer => timer.name == 'on a rampage')

    let speedBoostActive: boolean = false
    if(logistics.moveActionInProgress == 'fast retreat' || onARampage || logistics.moveActionInProgress == 'retreat from flanked')
      speedBoostActive = true

    let timeToMove2Pixels = (100 - (speed * 10))
    if(logistics.moveActionInProgress == 'cautious retreat') 
      timeToMove2Pixels *=  1.15
    if(speedBoostActive)
      timeToMove2Pixels *= 0.15
    return timeToMove2Pixels
  }
  

  isMoveOutsideOfBounds(newMoveCoords: Coords): boolean{
      const {proximity, fighter, logistics, timers} = this.fighting
      const modelWidth = proximity.getFighterModelDimensions(fighter, 'Idle').width  
      if(Octagon.checkIfFighterIsWithinOctagon(modelWidth, newMoveCoords)){
        return false
      }
      else {
        timers.cancelTimers(['move action in progress'], 'tried to move outside of bounds')
        return true
      }
  }

  hitEdge(edge: Edge){
    this.nearEdge = edge
    if(this.fighting.logistics.moveActionInProgress != 'retreat from flanked')
      this.fighting.timers.cancelTimers( ['move action in progress'], 'hit edge ' + edge)
  }

  
  getDirectionAwayFromEdge(): Direction360{
    
    const {proximity, fighter} = this.fighting
    const modelWidth = proximity.getFighterModelDimensions(fighter, 'Idle').width
    const edgeCoordDistance: EdgeCoordDistance = proximity.sortEdgesByClosest(Octagon.getAllEdgeDistanceAndCoordOnClosestEdge(this.coords, modelWidth))[0]
    const randomNum = random(89)
    switch(edgeCoordDistance.edgeName){
      case 'left': return (45 + randomNum) as Direction360
      case 'topLeft': return (90 + randomNum) as Direction360
      case 'top': return (135 + randomNum) as Direction360
      case 'topRight': return (180 + randomNum) as Direction360
      case 'right': return (225 + randomNum) as Direction360
      case 'bottomRight': return (270 + randomNum) as Direction360      
      case 'bottom': return (randomNum >= 45 ? randomNum - 45 : randomNum + 270) as Direction360
      case 'bottomLeft': return randomNum as Direction360
    }
  }


  private getNewMoveCoords(direction: Direction360, coords: Coords): Coords {

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


    return {x, y}
  }

};
