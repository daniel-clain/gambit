import { Ability, ServerAbility, AbilityData } from "../ability"
import Fighter from "../../fighter/fighter"
import { random } from "../../../helper-functions/helper-functions"
import SkillLevel from "../../../types/game/skill-level.type"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { ifSourceIsEmployee, ifSourceIsManager } from "../../../client/front-end-service/ability-service-client"
import { getAbilitySourceManager } from "../ability-service-server"


export const trainFighter: Ability = {
  name: 'Train Fighter',
  cost: { money: 5, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
  
}

export const trainFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {target, source} = abilityData
    const fighter: Fighter = game.has.fighters.find(fighter => fighter.name == target.name)
    const {weekNumber} = game.has.weekController
    const sourceManager: Manager = getAbilitySourceManager(source, game)
    
    let manager: Manager
    let trainer: Employee
    let sourceSkillLevel: SkillLevel

    ifSourceIsManager(source, () => sourceSkillLevel = 1)
    ifSourceIsEmployee(source, employee => sourceSkillLevel = employee.skillLevel)



    fighter.state.trainingProgress += sourceSkillLevel

    let newsItemAdded
    const trainedFighterInFight: boolean = game.has.weekController.activeFight.fighters.some(fighterInFight => fighterInFight.name == fighter.name)

    while(fighter.state.trainingProgress >= 2){
      fighter.state.trainingProgress -= 2

      if(!newsItemAdded && trainedFighterInFight){        
        game.has.weekController.preFightNewsStage.newsItems.push({
          newsType: 'fighter has gone up in strength or fitness',
          headline: `${fighter.name} training hard`,
          message: `${fighter.name} has been training hard for the upcoming fight`
        }) 
        newsItemAdded = true
      }

      const randomNum = random(1)
      if(randomNum === 0){
        fighter.fighting.stats.baseStrength ++
        manager.functions.addToLog({
          weekNumber,
          message: `${fighter.name}'s strength has gone up by 1 as a result of being trained`, type:'employee outcome'})
      }
      else if(randomNum === 1){
        fighter.fighting.stats.baseFitness ++
        manager.functions.addToLog({
          weekNumber,
          message: `${fighter.name}'s fitness has gone up by 1 as a result of being trained`, type:'employee outcome'})
      }
    }

  },
  ...trainFighter
}
