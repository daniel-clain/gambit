import { Ability, ClientAbility, ServerAbility, AbilityData, AbilitySourceInfo } from "../ability"
import SkillLevel from "../../../types/game/skill-level.type"
import { AbilitySourceType } from "../../../types/game/ability-source-type"
import { random, randomFloor } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { KnownManagerStat, Manager } from "../../manager"
import { FighterInfo, KnownFighterStat, Employee } from "../../../interfaces/front-end-state-interface"


const investigateManager: Ability = {
  name: 'Investigate Manager',
  cost: { money: 50, actionPoints: 1 },
  possibleSources: ['Private Agent'],
  validTargetIf: ['opponent manager'],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: false
}


type KnownStatsItem = {
  key: string,
  value: KnownManagerStat
}


export const investigateManagerServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){

    const sourceManager: Manager = determineSourceManager()
    const privateAgent: Employee = determinePrivateAgent()
    const skillLevel: SkillLevel = privateAgent.skillLevel
    
    const targetManager: Manager = game.has.managers.find(m => m.has.name == abilityData.target.name)

    const knownManager = sourceManager.has.otherManagers.find(m => m.name == targetManager.has.name)

    const targetManagerInfo = targetManager.functions.getInfo()

    const discoveredStats: KnownStatsItem[] = getRandomStatsFromManager()

    discoveredStats.forEach(stat => {
      knownManager[stat.key] = {
        lastKnownValue: stat.value,
        roundsSinceUpdated: 0
      } as KnownManagerStat
    })

    sourceManager.functions.addToLog({message: `${abilityData.source.type} ${abilityData.source.name} used ${abilityData.name} and found out the following stats about ${abilityData.target.name} \n ${discoveredStats.map(s => s.key)}`});


    //implementation
    
    function determineSourceManager(): Manager {
      return game.has.managers.find(manager => manager.has.employees.some(employee => employee.name == abilityData.source.name))
    }
    function determinePrivateAgent(): Employee{
      return sourceManager.has.employees.find(e => e.name == abilityData.source.name)
    }
    
    function getRandomStatsFromManager(): any{
      const invalidKeys = ['name', 'image']
      let numberOfStats =  skillLevel

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
          return Object.keys(knownManager)
          .filter(key => !invalidKeys.includes(key))
          .filter(key => !knownStats.includes(key))
          .filter(key => !updatedStats.some(stat => stat.key == key))
          .reduce(
            (chosenStat: KnownStatsItem, stat): KnownStatsItem => {
              if(chosenStat) return chosenStat
              if(count < randomNumber) return count++ && null
              return {
                key: stat,
                value: targetManagerInfo[stat]
              }
            }, null
          )
        }


        function getKnownStats(): string[]{
          return Object.keys(knownManager)
          .filter(key => !invalidKeys.includes(key))
          .filter(key => knownManager[key]?.roundsSinceUpdated == 0)
        }
      }


    }
    
  },
  ...investigateManager
}

export const investigateManagerClient: ClientAbility = {
  shortDescription: 'Investigate Manager',
  longDescription: `Find out stats about opponent manager, including: money, loan debt, employees, fighters, evidence on other managers. This ability resolves at the end of the round`,
  ...investigateManager
}

/* 
  - other managers has unknown stats
  - when you investigate you gain known stats
  - each unknow item is inclusive of array items
  - array items should be stored as
  knownManager = {
    name: 'bob'
    evidence: [
      {
        lastKnownValue: {},
        roundsSinceLearnt: x
      }
    ]
  }


  - how do i know if array item already added
  - how do i clear out array items that have gone
  - how do i update array items taht exist


*/
