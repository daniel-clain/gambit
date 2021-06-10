import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Fighter from "../../fighter/fighter"
import { random } from "../../../helper-functions/helper-functions"
import SkillLevel from "../../../types/game/skill-level.type"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Employee } from "../../../interfaces/front-end-state-interface"


const trainFighter: Ability = {
  name: 'Train Fighter',
  cost: { money: 5, actionPoints: 1 },
  possibleSources: ['Manager', 'Trainer'],
  validTargetIf: ['fighter owned by manager', 'fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
  
}

export const trainFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter: Fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)

    let manager: Manager
    let trainer: Employee
    let sourceSkillLevel: SkillLevel

    if(abilityData.source.type == 'Manager'){
      manager = game.has.managers.find(manager => manager.has.name == abilityData.source.name)
      sourceSkillLevel = 1
    }
    else{
      manager = game.has.managers.find(manager => {
        trainer = manager.has.employees.find(employee => employee.name == abilityData.source.name)
        if(trainer)
          return true
      })
      sourceSkillLevel = trainer.skillLevel
    }



    fighter.state.trainingProgress += sourceSkillLevel

    let newsItemAdded
    const trainedFighterInFight: boolean = game.has.roundController.activeFight.fighters.some(fighterInFight => fighterInFight.name == fighter.name)

    while(fighter.state.trainingProgress >= 2){
      fighter.state.trainingProgress -= 2

      if(!newsItemAdded && trainedFighterInFight){        
        game.has.roundController.preFightNewsStage.newsItems.push({
          newsType: 'fighter has gone up in strength or fitness',
          headline: `${fighter.name} training hard`,
          message: `${fighter.name} has been training hard for the upcoming fight`
        }) 
        newsItemAdded = true
      }

      const randomNum = random(1)
      if(randomNum === 0){
        fighter.fighting.stats.baseStrength ++
        manager.functions.addToLog({message: `${fighter.name}'s strength has gone up by 1 as a result of being trained`, type:'employee outcome'})
      }
      else if(randomNum === 1){
        fighter.fighting.stats.baseFitness ++
        manager.functions.addToLog({message: `${fighter.name}'s fitness has gone up by 1 as a result of being trained`, type:'employee outcome'})
      }
    }

  },
  ...trainFighter
}

export const trainFighterClient: ClientAbility = {
  shortDescription: 'Increase a fighters stats',
  longDescription: 'Increase target fighters fitness and strength, with affect the fighters hit damage, stamina, speed and recovery rate',
  ...trainFighter
}

