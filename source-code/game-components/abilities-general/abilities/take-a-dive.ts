import { Ability, ServerAbility, AbilityData } from "../ability"
import { Game } from "../../game"


export const takeADive: Ability = {
  name: 'Take A Dive',
  cost: { money: 200, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const takeADiveServer: ServerAbility = {

  execute(abilityData: AbilityData, game: Game){
    console.log('abilityData.target.name :>> ', abilityData.target.name);
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)
    fighter.state.takingADive = true
  },

  ...takeADive
}
