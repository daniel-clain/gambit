import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"


const dopeFighter: Ability = {
  name: 'Dope Fighter',
  cost: { money: 40, actionPoints: 1 },
  possibleTargets: ['fighter owned by manager', 'fighter not owned by manager'],
  executes: 'Instantly',
  canOnlyTargetSameTargetOnce: true
}

export const dopeFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)
    fighter.state.doping = true
  },
  ...dopeFighter
}

export const dopeFighterClient: ClientAbility = {
  shortDescription: 'Temporary performance enhancer',
  longDescription: 'Gives the fighter more strength, speed and recovery',
  ...dopeFighter
}

