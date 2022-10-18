import { Ability, ServerAbility, AbilityData } from "../ability"
import SkillLevel from "../../../types/game/skill-level.type"
import { randomFloor, toWrittenList } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { KnownManager, KnownManagerStat, Manager } from "../../manager"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { getAbilitySourceManager, getSourceType } from "../ability-service-server"
import { ifSourceIsEmployee } from "../../../client/front-end-service/ability-service-client"


export const investigateManager: Ability = {
  name: 'Investigate Manager',
  cost: { money: 50, actionPoints: 1 },
  executes: 'Instantly',
  canOnlyTargetSameTargetOnce: false
}


type KnownStatsItem = {
  key: string,
  value: KnownManagerStat
}


export const investigateManagerServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    
    const {target, source} = abilityData

    const sourceManager: Manager = getAbilitySourceManager(source, game)
    let privateAgent: Employee
    ifSourceIsEmployee(source, employee => privateAgent = employee)

    const {weekNumber} = game.has.weekController
    
    const targetManager: Manager = game.has.managers.find(m => m.has.name == target.name)

    const knownManager: KnownManager = sourceManager.has.otherManagers.find(m => m.name == target.name)

    const sourceType = getSourceType(source)


    const discoveredStats: KnownStatsItem[] = getRandomStatsFromManager()
    
    discoveredStats.forEach(stat => {
      knownManager[stat.key] = {
        lastKnownValue: stat.value,
        weeksSinceUpdated: 0
      } as KnownManagerStat
    })

    sourceManager.functions.addToLog({
      weekNumber,
      message: `${sourceType} ${source.name} used ${abilityData.name} and found out the following stats about ${target.name}: \n ${toWrittenList(discoveredStats.map(s => s.key))}`});


    //implementation
    
    
    function getRandomStatsFromManager(): any{
      const invalidKeys = ['name', 'image', 'characterType'] as (keyof KnownManager)[]
      let numberOfStats =  privateAgent.skillLevel

      return getUpdatedStats()

      function getUpdatedStats(){
        const updatedStats: KnownStatsItem[] = []
        let possibleOptions = 5
        let knownStats = getKnownStats()
        possibleOptions = possibleOptions - knownStats.length
        let randomNumber

        for(; 
          updatedStats.length < numberOfStats && 
          updatedStats.length < possibleOptions
        ;){
          randomNumber = randomFloor(possibleOptions - updatedStats.length)
          const stat = getStat()
          if(!stat){
            console.error('Error: stat not found', updatedStats, knownStats)
          }
          updatedStats.push(stat)
        }
        return updatedStats

        //implementation

        function getStat(): KnownStatsItem{
          let count = 0
          return (Object.keys(knownManager) as (keyof KnownManager)[])
          .filter(key => !invalidKeys.includes(key))
          .filter(key => !knownStats.includes(key))
          .filter(key => !updatedStats.some(stat => stat.key == key))
          .reduce(
            (chosenStat: KnownStatsItem, stat): KnownStatsItem => {
              if(chosenStat) return chosenStat
              if(count < randomNumber) return count++ && null
              return {
                key: stat,
                value: targetManager.has[stat]
              }
            }, null
          )
        }


        function getKnownStats(): string[]{
          return (Object.keys(knownManager) as (keyof Omit<KnownManager, 'name' | 'image' | 'characterType'>)[])
          .filter(key => !invalidKeys.includes(key))
          .filter(key => knownManager[key]?.weeksSinceUpdated == 0)
        }
      }


    }
    
  },
  ...investigateManager
}
