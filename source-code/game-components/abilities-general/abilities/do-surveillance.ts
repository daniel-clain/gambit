import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"


const doSurveillance: Ability = {
  name: 'Do Surveillance',
  cost: { money: 50, actionPoints: 1 },
  possibleSources: ['Private Agent'],
  possibleTargets: ['fighter not owned by manager', 'opponent manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false,
  disabled: true
}

export const doSurveillanceServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    throw `${name} ability not yet implemented`
  },
  ...doSurveillance
}

export const doSurveillanceClient: ClientAbility = {
  shortDescription: 'Gather intel on what actions are occuring',
  longDescription: 'Find out what is happening with target manager or fighter. You can also target yourself for surveilancce to block other private agents from gaining info, bonus if you have thugs',
  ...doSurveillance
}

