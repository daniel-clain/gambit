import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { handleUnderSurveillance } from "./do-surveillance"


const dopeFighter: Ability = {
  name: 'Dope Fighter',
  cost: { money: 40, actionPoints: 1 },
  possibleSources:  ['Manager', 'Drug Dealer'],
  validTargetIf: ['fighter owned by manager', 'fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const dopeFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {source} = abilityData
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)

    const manager = source.type == 'Manager' ? game.has.managers.find(m => m.has.name == source.name) : game.has.managers.find(m => m.has.employees.find(e => e.name == source.name))
    
    if(fighter.state.doping){
      if(random(100) < 10) fighterDead()
    } else {
      if(random(100) < 2) fighterDead()
    }

    if(!fighter.state.dead){
      if(manager.state.underSurveillance){
        handleUnderSurveillance(manager, abilityData, game)
      }
      fighterTakesSteroids()
      
    }

    function fighterTakesSteroids() {
      fighter.state.doping = true
      fighter.fighting.stats.baseAggression ++
      
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter is doped up',
        headline: `${fighter.name} Suspected of Doping!`,
        message: `${fighter.name} appears to be gained massive size is such a short time period`
      }) 
    }

    function  fighterDead() {
      game.functions.removeFighterFromTheGame(fighter.name, game)
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter died of overdose',
        headline: `${fighter.name} Died of drug overdose!`,
        message: `${fighter.name} was found dead, the coroner's report says the cause was steroid abuse`
      }) 
    }
  },
  ...dopeFighter
}

export const dopeFighterClient: ClientAbility = {
  shortDescription: 'Temporary performance enhancer',
  longDescription: 'Gives the fighter more strength, speed and recovery',
  ...dopeFighter
}

