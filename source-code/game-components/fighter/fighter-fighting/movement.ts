import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import Coords from '../../../interfaces/game/fighter/coords';
import Direction360 from "../../../types/figher/direction-360";
import Octagon from "../../fight/octagon";
import { Edge } from "../../../interfaces/game/fighter/edge";
import Dimensions from "../../../interfaces/game/fighter/dimensions";
import { random } from "../../../helper-functions/helper-functions";
import FacingDirection from "../../../types/figher/facing-direction";

export default class Movement {

  
  private _movingDirection: Direction360
  coords: Coords = {x: 0, y: 0}

  reverseMoving: boolean

  moveInterval
  moveDurationTimer

  nearEdge: Edge

  constructor(private fighting: FighterFighting){    
  }

  set movingDirection(val){
    if(isNaN(val) || val >= 360)
      debugger
    this._movingDirection = val
    this.setFacingDirectionByDegree(this.movingDirection)
  }
  get movingDirection(){
    return this._movingDirection
  }

  setFacingDirectionByDegree(movingDirection: Direction360){
    const {actions, facingDirection, activeTimers} = this.fighting
    const doingCautiusRetreat = activeTimers.some(timer => timer.name == 'doing cautious retreat')

    const currentFacingDirection = facingDirection

    let facingBasedOnMovingDirection: FacingDirection
    if(movingDirection < 180)
      facingBasedOnMovingDirection = 'right'
    else
      facingBasedOnMovingDirection = 'left'

      
    const walkingBackwardFacingDirection: FacingDirection = facingBasedOnMovingDirection == 'left' ? 'right' : 'left'

    const movingToAttack = activeTimers.some(timer => timer.name == 'moving to attack')

    if(!movingToAttack)
      this.reverseMoving = false


    if(doingCautiusRetreat || this.reverseMoving){
      if(currentFacingDirection == walkingBackwardFacingDirection)
        return
      else
        this.fighting.actions.startAction(actions.turnAround)
        .catch(reason => reason)
    }
    else {
      if(currentFacingDirection == facingBasedOnMovingDirection)
        return
      else
        this.fighting.actions.startAction(actions.turnAround)
        .catch(reason => reason)
    }
  }
  
  moveABit() {
    
    const isDoingCautiousRetreat = this.fighting.activeTimers.some(timer => timer.name == 'doing cautious retreat')
    this.fighting.modelState = isDoingCautiousRetreat ? 'Defending' : 'Walking'
    const newMoveCoords: Coords = this.getNewMoveCoords(this.movingDirection, this.coords)
    if(!this.isNearEdge(newMoveCoords))
      this.coords = newMoveCoords
  }

  moveSpeed(){

    const {speed} = this.fighting.stats  
    const doingCautiusRetreat = this.fighting.activeTimers.some(timer => timer.name == 'doing cautious retreat')


    const doingFastRetreat = this.fighting.activeTimers.some(timer => timer.name == 'doing fast retreat')
    const retreatingFromFlanked = this.fighting.activeTimers.some(timer => timer.name == 'retreating from flanked')
    const onARampage = this.fighting.activeTimers.some(timer => timer.name == 'on a rampage')
    let speedBoostActive: boolean = false
    if(doingFastRetreat || onARampage || retreatingFromFlanked){
      //console.log(`>> Speed Boost for ${this.fighting.fighter.name}`);
      speedBoostActive = true
    }

    let timeToMove2Pixels = (80 - (speed * 10))
    if(doingCautiusRetreat) 
      timeToMove2Pixels *=  1.1
    if(speedBoostActive)
      timeToMove2Pixels *= 0.2
    return timeToMove2Pixels

  }

  isNearEdge(newMoveCoords: Coords): boolean{
    const {proximity, modelState} = this.fighting
    const modelWidth = proximity.getModelDimensions(modelState).width

    const baseDimensions: Dimensions = {width: modelWidth, height: 10}
    const nearEdge = Octagon.checkIfFighterIsNearEdge(baseDimensions, newMoveCoords)
    const {name} =this.fighting.fighter

    if(this.nearEdge && nearEdge){
      if(this.nearEdge !== nearEdge){
        console.log(`${name} is near another edge ${nearEdge}`);
        this.hitEdge(nearEdge)
      }
      return true
    }
    if(!this.nearEdge && nearEdge){
      console.log(`${name} is near ${nearEdge}`);
        this.hitEdge(nearEdge)
        return true
    }    
    else if(this.nearEdge && !nearEdge) {
      console.log(`${name} is no longer near an edge`);
      this.nearEdge = null;
      return false
    }    
    else
      return false
  }
  hitEdge(edge: Edge){
    this.nearEdge = edge
    this.fighting.cancelTimers(
      ['wandering direction', 'doing cautious retreat', 'doing fast retreat', 'moving to attack' ],
      'hit edge ' + edge)

  }


  
  getDirectionAwayFromEdge(): Direction360{
    const randomNum = random(89)
    switch(this.nearEdge){
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

    addXAmmount = Math.round(addXAmmount)
    addYAmmount = Math.round(addYAmmount)

    if(isNaN(addXAmmount) || isNaN(addYAmmount)){
      debugger
    }

    return { x: coords.x + addXAmmount, y:coords.y +  addYAmmount }
  }

};
