import { IllegalActivityName } from "../../../types/game/evidence.type"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, ClientAbility, ServerAbility, AbilityData, AbilityName, AbilitySourceInfo } from "../ability"


const doSurveillance: Ability = {
  name: 'Do Surveillance',
  cost: { money: 50, actionPoints: 1 },
  possibleSources: ['Private Agent'],
  validTargetIf: ['fighter not owned by manager', 'opponent manager', 'this manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  disabled: false,
  priority: 1
}

export const doSurveillanceServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {target, source} = abilityData
    const {type, name} = target
    console.log('abilityData :>> ', abilityData);
    if(type == 'fighter not owned by manager'){
      const fighter = game.has.fighters.find(f => f.name == name)
      fighter.state.underSurveillance = {
        professional: source.name
      }
    }
    if(type == 'opponent manager' || type == 'this manager'){
      const manager = game.has.managers.find(m => m.has.name == name)
      manager.state.underSurveillance = {
        professional: source.name
      }
    }

  },
  ...doSurveillance
}

export const doSurveillanceClient: ClientAbility = {
  shortDescription: 'Gather intel on what actions are occurring',
  longDescription: 'Find out what is happening with target manager or fighter. You can also target yourself for surveillance to block other private agents from gaining info, bonus if you have thugs',
  ...doSurveillance
}

export const handleUnderSurveillance = (surveilledManager: Manager, abilityData: AbilityData, game: Game) => {
  const {source, name, target} = abilityData
  const {roundNumber} = game.has.roundController
  const privateAgentName = surveilledManager.state.underSurveillance.professional


  const managerDoingSurveillance = game.has.managers.find(m => m.has.employees.find(e => e.name == privateAgentName))
  const illegalActivity = getIllegalActivityName(name)
  const evidenceDescription = `(Week ${roundNumber}) - ${surveilledManager.has.name} ${source.type != 'Manager' ? `'s ${source.type} ${source.name}`: ''} was seen using ability ${name} ${target ? `targeting ${target.type} ${target.name}` : ''}`

  managerDoingSurveillance.has.evidence.push({managerName: surveilledManager.has.name, abilityData, illegalActivity, evidenceDescription})

  managerDoingSurveillance.functions.addToLog({type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source.name} doing "${name}" ${abilityData.source.type != 'Manager' ? `. ${source.name}  works for ${surveilledManager.has.name}` : ''}. You have stored this information away as evidence`})
}


function getIllegalActivityName(ability: AbilityName): IllegalActivityName{
  const mapObj: {[Property in AbilityName]?:  IllegalActivityName} = {
    'Assault Fighter': 'solicited assault',
    'Dope Fighter': 'administering performance enhancing drugs',
    'Poison Fighter': 'administering with intent to harm',
    'Murder Fighter': 'solicitation to commit homicide',
    'Sell Drugs': 'supplying illegal substances'
  }
  return mapObj[ability]
}

