import Fight from "../round/fight/fight";

import Fighter from "./fighter";

import { getDistanceBetweenTwoPositions, getDirectionOfPosition2FromPosition1 } from "../../../helper-functions/helper-functions";

import ClosenessRating from "../../../types/figher/closeness-rating";


interface FighterAndFighterImplementationCodeRelationship{
  
}


const createFighterImplementationCode = (fighter: Fighter) => {










  const fighterImplementationCode: FighterImplementationCode = {

  }
}

 const fighterImplementationCode: FighterImplementationCode = {

  constructor(private fighter: Fighter){}
  

  joinFight(fight: Fight){
    this.fighter.fight = fight
  }

  getOtherFighters(): Fighter[]{
    return this.fighter.fight.getOtherFightersInFight(this.fighter)
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
    return getDistanceBetweenTwoPositions(this.fighter.position, fighter.position)
  }

  getDirectionOfFighter(fighter: Fighter){
    return getDirectionOfPosition2FromPosition1(this.fighter.position, fighter.position)
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

  export default fighterImplementationCode
}