import Game from "../game";
import { Professional } from "../../interfaces/game-ui-state.interface";
import { random } from "../../helper-functions/helper-functions";
import { RoundController } from "./round-controller";
import Fighter from "../fighter/fighter";

export function doEndOfRoundReset(roundController: RoundController, fighters: Fighter[], professionals: Professional[]) {
  returnProfessionalJobSeekersToProfessionalsPool()
  resetFighterAffects()
  reduceExtremeFighterStats()

  function returnProfessionalJobSeekersToProfessionalsPool(){
    professionals.push(...roundController.jobSeekers
    .filter(jobSeeker => jobSeeker.type == 'Professional')
    .map((jobSeeker): Professional => {
      const {name, profession, skillLevel, abilities} = jobSeeker
      return {name, profession, skillLevel, abilities}
    }))

    fighters.forEach(fighter => fighter.state.goalContract = null)
    
    roundController.jobSeekers = []
  }

  
  function resetFighterAffects() {
    fighters.forEach(fighter => {
      fighter.state.guards = []
      fighter.state.injured = false
      fighter.state.doping = false
      fighter.state.poisoned = false
    })
  }

  function reduceExtremeFighterStats(){
    
    fighters.forEach(fighter => {
      let {stats} = fighter.fighting

      if(stats.fitness > 8  && random(3, true) == 3)
        stats.fitness = reduceStat(stats.fitness)
        
      if(stats.strength > 8  && random(3, true) == 3)
        stats.strength = reduceStat(stats.strength)
        
      if(stats.aggression > 8  && random(3, true) == 3)
        stats.aggression = reduceStat(stats.aggression)
        

    })

    function reduceStat(stat){
      if(stat > 8 && stat <= 10)
        return Math.round(stat - ((stat - 8) * .2))
      if(stat > 10)
        return Math.round(stat - ((stat - 10) * .5))
      
      return stat
    }
  }
}

