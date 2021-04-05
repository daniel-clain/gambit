
import { random } from "../../helper-functions/helper-functions";
import { RoundController } from "./round-controller";
import Fighter from "../fighter/fighter";
import { Professional } from "../../interfaces/front-end-state-interface";

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

    fighters.forEach(fighter => delete fighter.state.goalContract)
    
    roundController.jobSeekers = []
  }

  
  function resetFighterAffects() {
    fighters.forEach(fighter => {
      fighter.state.guards = []
      fighter.state.injured = false
      fighter.state.doping = false
      fighter.state.sick = false
      fighter.state.hallucinating = false
    })
  }

  function reduceExtremeFighterStats(){
    
    fighters.forEach(fighter => {
      let {stats} = fighter.fighting

      if(stats.fitness > 8  && random(3, true) == 3)
        stats.baseFitness = reduceStat(stats.baseFitness)
        
      if(stats.strength > 8  && random(3, true) == 3)
        stats.baseStrength = reduceStat(stats.baseStrength)
        
      if(stats.baseAggression > 8  && random(3, true) == 3)
        stats.baseAggression = reduceStat(stats.baseAggression)
        

    })

    function reduceStat(stat: number){
      if(stat > 8 && stat <= 10)
        return Math.round(stat - ((stat - 8) * .2))
      if(stat > 10)
        return Math.round(stat - ((stat - 10) * .5))
      
      return stat
    }
  }
}

