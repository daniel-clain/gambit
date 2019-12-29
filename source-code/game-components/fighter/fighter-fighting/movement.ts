import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import Coords from '../../../interfaces/game/fighter/coords';
import Direction360 from "../../../types/figher/direction-360";
import Octagon from "../../fight/octagon";
import { Edge } from "../../../interfaces/game/fighter/edge";
import Dimensions from "../../../interfaces/game/fighter/dimensions";
import { random, timer } from "../../../helper-functions/helper-functions";
import { fighterModelImages } from "../../../client/images/fighter/fighter-model-images";
import FacingDirection from "../../../types/figher/facing-direction";

export default class Movement {

  
  private _movingDirection: Direction360
  coords: Coords = {x: 0, y: 0}
	facingDirection: FacingDirection
  moveInterval
  moveDurationTimer

  nearEdge: Edge

  constructor(private fighterFighting: FighterFighting){    
    this.facingDirection = !!random(2) ? 'left' : 'right'
  }

  set movingDirection(val){
    this._movingDirection = val
    this.setFacingDirectionByDegree(this.movingDirection)
  }
  get movingDirection(){
    return this._movingDirection
  }

  setFacingDirectionByDegree(movingDirection: Direction360){
    if(movingDirection < 180){
      if(this.facingDirection != 'right')
        this.facingDirection = 'right'
      
    } else {
      if(this.facingDirection != 'left')
      this.facingDirection = 'left'
    }
  }
  
  moveABit() {
    this.fighterFighting.modelState = 'Walking'
    const newMoveCoords: Coords = this.getNewMoveCoords(this.movingDirection, this.coords)
    this.checkNearEdge(newMoveCoords)
    this.coords = newMoveCoords
  }

  moveSpeed(){
    const {speed} = this.fighterFighting.fighter.state
    return 140 - (speed * 30) + (this.fighterFighting.speedBoost ? - 20 : 0)
  }

  checkNearEdge(newMoveCoords: Coords){
    const modelWidth = fighterModelImages.find(fighterModel => fighterModel.modelState == this.fighterFighting.modelState).dimensions.width
    const baseDimensions: Dimensions = {width: modelWidth, height: 10}
    const nearEdge = Octagon.checkIfFighterIsNearEdge(baseDimensions, newMoveCoords)
    const {name} =this.fighterFighting.fighter

    if(this.nearEdge && nearEdge){
      if(this.nearEdge !== nearEdge){
        //console.log(`${name} is near another edge ${nearEdge}`);
        this.nearEdge = nearEdge
        this.fighterFighting.cancelAction('hit edge')
      }
    }
    if(!this.nearEdge && nearEdge){
      //console.log(`${name} is near ${nearEdge}`);
      this.nearEdge = nearEdge
      this.fighterFighting.cancelAction('hit edge')
    }    
    else if(this.nearEdge && !nearEdge) {
      //console.log(`${name} is no longer near an edge`);
      this.nearEdge = null;
    }
    
  }

  isDirectionTowardEdge(direction: Direction360): boolean{
    switch(this.nearEdge){
      case 'top': {
        if((direction > 0 && direction < 90) || (direction > 270 && direction < 360) )
          return true
      }; break;
      case 'bottom': {
        if(direction > 90 && direction < 270)
          return true
      }; break;
      case 'right': {
        if(direction > 0 && direction < 180)
          return true
      }; break;
      case 'left': {
        if(direction > 180 && direction < 360)
          return true
      }; break;
      case 'bottomLeft': {
        if(direction > 135 && direction < 315)
          return true
      }; break;
      case 'topLeft': {
        if((direction > 225 && direction < 360) || (direction > 0 && direction < 45))
          return true
      }; break;
      case 'bottomRight': {
        if(direction > 45 && direction < 225)
          return true
      }; break;
      case 'topRight': {
        if((direction > 315 && direction < 360) || (direction > 0 && direction < 135))
          return true
      }; break;
      default: return false
    }
  }

  
  getDirectionAwayFromEdge(): Direction360{
    const randomNum = random(90)
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

    const moveAmount = 4
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
    if(isNaN(addXAmmount || isNaN(addYAmmount))){
      debugger
    }

    return { x: coords.x + addXAmmount, y:coords.y +  addYAmmount }
  }

};
