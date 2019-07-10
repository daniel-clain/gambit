import defaultFighterAttributes, { IFighterAttribute } from "./fighter-attributes";
import IFighterStrategy, { RunAwayAndRecover } from "./fighter-strategies";
import Direction360 from "../../../types/figher/direction-360";
import { getDistanceBetweenTwoPositions, getDirectionOfPosition2FromPosition1, random } from "../../../helper-functions/helper-functions";
import ClosenessRating from "../../../types/figher/closeness-rating";
import Position from '../../../interfaces/game/fighter/position'
import FighterSkeleton from "../../../interfaces/game/fighter/fighter-skeleton";
import FacingDirection from "../../../types/figher/facing-direction";
import FighterModelState from "../../../types/figher/fighter-model-states";
import Fight from "../round/fight/fight";
import fighterImplementationCode, { FighterImplementationCode } from './fighter-implementation-code'

export default class Fighter {

  attributes: IFighterAttribute[] = defaultFighterAttributes
  modelState: FighterModelState = 'Idle'
  //status: IFighterStatus[] = defaultFighterStatus
  strategies: IFighterStrategy[] = [
    new RunAwayAndRecover(this)
  ]
  fight: Fight


  

  ////////////////////
  position: Position
	facingDirection: FacingDirection
  name: string
  
  movingDirection: Direction360

  //////////////////////////////


  //////////////////////////////  

  constructor(name: string){
    this.name = name
    this.facingDirection = !!random(2) ? 'left' : 'right'
  }
  

  moveTowardFighter(fighter: Fighter){
    this.movingDirection = this.getDirectionOfFighter(fighter)
  }

  tryToHitFighter(fighter: Fighter) {
    console.log(`${this.name} is trying to hit ${fighter.name}`);
  }

  leaveFight(){
    this.fight = null
  }

  getFighterSkeleton(): FighterSkeleton{
    return {
      name: this.name,
      facingDirection: this.facingDirection,
      modelState: this.modelState,
      position: this.position
    }
  }

}