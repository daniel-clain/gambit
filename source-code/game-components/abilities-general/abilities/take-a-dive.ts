import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { random } from "../../../helper-functions/helper-functions"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { handleUnderSurveillance } from "./do-surveillance"


const takeADive: Ability = {
  name: 'Take A Dive',
  cost: { money: 0, actionPoints: 0 },
  possibleSources: ['Manager'],
  notValidTargetIf: ['fighter not owned by manager'],
  validTargetIf: ['fighter in next fight', 'fighter owned by manager'],
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

export const takeADiveClient: ClientAbility = {
  shortDescription: 'Fighter tries not to win',
  longDescription: `This fighter will try to not win, he will move slower and be unaggressive. However, if a rampage is triggered, he will forget he is taking a dive`,
  ...takeADive
}

