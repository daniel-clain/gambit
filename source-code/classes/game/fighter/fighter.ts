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

export class Fighter {

  attributes: IFighterAttribute[] = defaultFighterAttributes
  modelState: FighterModelState = 'Idle'
  //status: IFighterStatus[] = defaultFighterStatus
  strategies: IFighterStrategy[] = [
    new RunAwayAndRecover(this)
  ]
  fight: Fight

  fightersInfront: Fighter[]
  fightersBehind: Fighter[]

  
  

  ////////////////////
  position: Position
	facingDirection: FacingDirection
  name: string
  
  movingDirection: Direction360

  //////////////////////////////

  fighterAttackingYou: Fighter
  fighterTargetedForAttack: Fighter
  retreatingFromFighter: Fighter

  //////////////////////////////  

  constructor(name: string){
    this.name = name
    this.position = {
      x: random(600),
      y: random(400)
    }
    this.facingDirection = !!random(1) ? 'left' : 'right'
  }
  

  joinFight(fight: Fight){
    this.fight = fight
  }

  getOtherFighters(): Fighter[]{
    return this.fight.getOtherFightersInFight(this)
  }

  getNearbyFighters(): Fighter[]{
    return this.fightersInfront.concat(this.fightersBehind)
  }

  getClosestFigther(): Fighter{
    return this.getNearbyFighters()
    .reduce((closestFighter: Fighter, loopFighter: Fighter) => {
      if(closestFighter == null)
        return loopFighter      
      if(this.distanceFromFighter(loopFighter) < this.distanceFromFighter(closestFighter))
        return loopFighter 
      return closestFighter
    }, null)
  }

  distanceFromFighter(fighter: Fighter){
    return getDistanceBetweenTwoPositions(this.position, fighter.position)
  }

  getDirectionOfFighter(fighter: Fighter){
    return getDirectionOfPosition2FromPosition1(this.position, fighter.position)
  }

  getFighterClosenessRating(fighter: Fighter): ClosenessRating{
    const close = 15
    const near = 150
    const distance: number = this.distanceFromFighter(fighter)
    if(distance < close){
      return 'Close'
    }
    if(distance < near){
      return 'Near'
    }
    return 'Far'
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