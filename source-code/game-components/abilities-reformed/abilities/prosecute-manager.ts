import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"

const sueManager: Ability = {
  name: 'Prosecute Manager',
  cost: { money: 500, actionPoints: 1 },
  possibleSources: ['Lawyer'],
  possibleTargets: ['opponent manager'],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: true
}

export const prosecuteManagerServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    throw 'sue manager ability not yet implemented'    
  },
  ...sueManager
}

export const prosecuteManagerClient: ClientAbility = {
  shortDescription: 'Prosecute a manager for lots of money',
  longDescription: 'Prosecute an opponent manager for illegal activity, amount sued for is relative to the severity of each account manager is found guilty of. +100 cost for each accusation, 20% chance of success without evidence',
  ...sueManager
}

