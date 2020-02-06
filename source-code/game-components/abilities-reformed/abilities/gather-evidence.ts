import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"


const gatherEvidence: Ability = {
  name: 'Gather Evidence',
  cost: { money: 20, actionPoints: 1 },
  possibleTargets: ['opponent manager'],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: true
}

export const gatherEvidenceServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    throw `${name} ability not yet implemented`
  },
  ...gatherEvidence
}

export const gatherEvidenceClient: ClientAbility = {
  shortDescription: 'Gather evidence of illegal activity',
  longDescription: 'If you are suspicious another manager is responsible for illegal activity, gather evidence to use as proof',
  ...gatherEvidence
}

