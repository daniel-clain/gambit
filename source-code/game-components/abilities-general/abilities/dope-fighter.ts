import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { getAbilitySourceManager, getSourceType } from "../ability-service-server"
import { handleUnderSurveillance } from "./do-surveillance"


export const dopeFighter: Ability = {
  name: 'Dope Fighter',
  cost: { money: 40, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const dopeFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {source} = abilityData
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)
    const sourceManager = getAbilitySourceManager(source, game)


    if(sourceManager.state.underSurveillance){
      handleUnderSurveillance({surveilledManager: sourceManager, abilityData, game})
    }

    if(fighter.state.underSurveillance){
      handleUnderSurveillance({surveilledFighter: fighter, abilityData, game})
    }

    
    if(fighter.state.doping){
      if(random(100) < 10) fighterDead()
    } else {
      if(random(100) < 2) fighterDead()
    }

    if(!fighter.state.dead){
      fighterTakesSteroids()
      
    }

    function fighterTakesSteroids() {
      fighter.state.doping = true
      fighter.fighting.stats.baseAggression ++
      
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: 'fighter is doped up',
        headline: `${fighter.name} Suspected of Doping!`,
        message: `${fighter.name} appears to be gained massive size is such a short time period`
      }) 
    }

    function  fighterDead() {
      game.functions.removeFighterFromTheGame(fighter.name, game)
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: 'fighter died of overdose',
        headline: `${fighter.name} Died of drug overdose!`,
        message: `${fighter.name} was found dead, the coroner's report says the cause was steroid abuse`
      }) 
    }
  },
  ...dopeFighter
}


