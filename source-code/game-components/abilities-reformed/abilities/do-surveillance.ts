import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"


const doSurveillance: Ability = {
  name: 'Do Surveillance',
  cost: { money: 50, actionPoints: 1 },
  possibleTargets: ['fighter not owned by manager', 'opponent manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false
}

export const doSurveillanceServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    throw `${name} ability not yet implemented`
  },
  ...doSurveillance
}

export const doSurveillanceClient: ClientAbility = {
  shortDescription: 'Gather intel on what actions are occuring',
  longDescription: 'Find out what is happening with target manager or fighter',
  ...doSurveillance
}

