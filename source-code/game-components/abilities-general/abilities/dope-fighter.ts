import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData, removeFighterFromTheGame } from "../ability"


const dopeFighter: Ability = {
  name: 'Dope Fighter',
  cost: { money: 40, actionPoints: 1 },
  possibleSources:  ['Manager', 'Drug Dealer'],
  possibleTargets: ['fighter owned by manager', 'fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const dopeFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)
    
    if(fighter.state.doping){
      if(random(100) < 10) fighterDead()
      else fighterTakesSteroids
    } else {
      if(random(100) < 2) fighterDead()
      else fighterTakesSteroids
    }

    if(!fighter.state.dead){
      fighterTakesSteroids
      
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
      removeFighterFromTheGame(fighter.name, game)
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter died of overdose',
        headline: `${fighter.name} Died of drug overdose!`,
        message: `${fighter.name} was found dead, the coroner's report says the cause was stroid abuse`
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

