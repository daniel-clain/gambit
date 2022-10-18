import { Ability, ServerAbility, AbilityData, SourceTypes } from "../ability"
import SkillLevel from "../../../types/game/skill-level.type"
import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { FighterInfo, KnownFighterStat, Employee } from "../../../interfaces/front-end-state-interface"
import { getAbilitySourceManager, getSourceType } from "../ability-service-server"
import { ifSourceIsEmployee, ifSourceIsManager, ifTargetIsFighter } from "../../../client/front-end-service/ability-service-client"


export const researchFighter: Ability = {
  name: 'Research Fighter',
  cost: { money: 5, actionPoints: 1 },
  executes: 'Instantly',
}


export const researchFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {source, target} = abilityData

    ifTargetIsFighter(target, knownFighter => {
      let numberOfStats
      const manager: Manager = getAbilitySourceManager(source, game)
      const existingFighter: FighterInfo = manager.has.knownFighters.find(fighter => fighter.name == abilityData.target.name)
      const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name).getInfo()
      const sourceType = getSourceType(source)

      ifSourceIsManager(source, () => {
        numberOfStats = 4
      })

      ifSourceIsEmployee(source, employee => {
        if(employee.profession == 'Talent Scout'){
          numberOfStats = 2 + employee.skillLevel
        }
        if(employee.profession == 'Private Agent'){
          numberOfStats = 4 + employee.skillLevel
        }
      })

      const researchedStats = getRandomStatsFromFighter()
  
      for(let key in researchedStats){
        if(invalidKey(key)) continue
        console.log(key)
        existingFighter[key] = researchedStats[key]
      }
  
      console.log(`${sourceType} ${source.name} used research fighter and found out the following stats about ${target.name}`, researchedStats);

      /* functions */
      type StatsObj = {
        [Property in keyof FighterInfo]?: KnownFighterStat
      }

      function getRandomStatsFromFighter(): StatsObj {
        const returnStatsObj = {}
        const knownStatsKeys = Object.keys(fighter)
        console.log('knownStatsKeys :>> ', knownStatsKeys);
      
        for(let loops = 0; continueCondition(loops) ;loops ++){
          const randomKey = knownStatsKeys[random(knownStatsKeys.length - 1)]
          console.log('randomKey :>> ', randomKey);
          if(invalidKey(randomKey)) continue
      
          const alreadyHasThatStat = !!returnStatsObj[randomKey]
          const alreadyDiscoveredThatStatThisTurn = existingFighter[randomKey]?.weeksSinceUpdated === 0
          console.log('alreadyHasThatStat :>> ', alreadyHasThatStat);
          console.log('alreadyDiscoveredThatStatThisTurn :>> ', alreadyDiscoveredThatStatThisTurn);
          if(
            !alreadyHasThatStat && !alreadyDiscoveredThatStatThisTurn
          ){
            const stat = fighter[randomKey].lastKnownValue
            console.log('adding stat', randomKey, stat);

            returnStatsObj[randomKey] = {
              lastKnownValue: stat, 
              weeksSinceUpdated: 0
            }
          }
          
        }
        return returnStatsObj
        function continueCondition(loops){
          console.log('loops :>> ', loops);
          const currentStatsCount = Object.keys(returnStatsObj).length
          console.log('currentStatsCount :>> ', currentStatsCount);
          console.log('numberOfStats :>> ', numberOfStats);
          console.log('knownStatsKeys.length :>> ', knownStatsKeys.length);
          const continueLoop = (
            currentStatsCount < numberOfStats && 
            currentStatsCount < knownStatsKeys.length &&
            loops < 20
          )
          console.log('continueLoop :>> ', continueLoop);
          return continueLoop
        }

      }

      function invalidKey(key){
        return !['strength', 'fitness', 'intelligence', 'aggression', 'numberOfFights', 'numberOfWins', 'manager'].includes(key)
      }
    })

    
  },
  ...researchFighter
}

