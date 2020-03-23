import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import Fighter from "../../fighter/fighter"
import { random } from "../../../helper-functions/helper-functions"
import Manager from "../../manager"
import SkillLevel from "../../../types/game/skill-level.type"
import { Employee } from "../../../interfaces/game-ui-state.interface"


const trainFighter: Ability = {
  name: 'Train Fighter',
  cost: { money: 5, actionPoints: 1 },
  possibleTargets: ['fighter owned by manager', 'fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
  
}

export const trainFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter: Fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)

    let manager: Manager
    let trainer: Employee
    let sourceSkillLevel: SkillLevel

    if(abilityData.source.type == 'Manager'){
      manager = game.managers.find(manager => manager.name == abilityData.source.name)
      sourceSkillLevel = 1
    }
    else{
      manager = game.managers.find(manager => {
        trainer = manager.employees.find(employee => employee.name == abilityData.source.name)
        if(trainer)
          return true
      })
      sourceSkillLevel = trainer.skillLevel
    }



    fighter.state.trainingProgress += sourceSkillLevel

    let newsItemAdded
    const trainedFighterInFight: boolean = game.roundController.activeFight.fighters.some(fighterInFight => fighterInFight.name == fighter.name)

    while(fighter.state.trainingProgress >= 2){
      fighter.state.trainingProgress -= 2

      if(!newsItemAdded && trainedFighterInFight){        
        game.roundController.preFightNewsStage.newsItems.push({
          newsType: 'fighter has gone up in strength or fitness',
          headline: `${fighter.name} training hard`,
          message: `${fighter.name} has been training hard for the upcoming fight`
        }) 
        newsItemAdded = true
      }

      const randomNum = random(1)
      if(randomNum === 0){
        fighter.fighting.stats.baseStrength ++
        manager.addToLog({message: `${fighter.name}'s strength has gone up by 1 as a result of being trained`})
      }
      else if(randomNum === 1){
        fighter.fighting.stats.fitness ++
        manager.addToLog({message: `${fighter.name}'s fitness has gone up by 1 as a result of being trained`})
      }
    }

  },
  ...trainFighter
}

export const trainFighterClient: ClientAbility = {
  shortDescription: 'Increase a fighters stats',
  longDescription: 'Increse target fighters fitness and strength, with affect the fighters hit damage, stamina, speed and recovery rate',
  ...trainFighter
}

