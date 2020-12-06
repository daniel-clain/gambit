import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"


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
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)
    fighter.state.doping = true
    fighter.fighting.stats.baseAggression ++
    
    game.roundController.preFightNewsStage.newsItems.push({
      newsType: 'fighter is doped up',
      headline: `${fighter.name} Suspected of Doping!`,
      message: `${fighter.name} appears to be gained massive size is such a short time period`
    }) 
  },
  ...dopeFighter
}

export const dopeFighterClient: ClientAbility = {
  shortDescription: 'Temporary performance enhancer',
  longDescription: 'Gives the fighter more strength, speed and recovery',
  ...dopeFighter
}

