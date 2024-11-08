import { Game } from "../../game"
import { Ability, AbilityData, ServerAbility } from "../ability"

export const takeADive: Ability = {
  name: "Take A Dive",
  cost: { money: 200, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  canOnlyTargetSameTargetOnce: true,
}

export const takeADiveServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const fighter = game.has.fighters.find(
      (fighter) => fighter.name == abilityData.target!.name
    )!
    fighter.state.takingADive = true
  },

  ...takeADive,
}
