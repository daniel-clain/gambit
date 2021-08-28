import { randomNumber } from "../../../helper-functions/helper-functions"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { IllegalActivityName } from "../../../types/game/evidence.type"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, ClientAbility, ServerAbility, AbilityData, AbilityName, AbilitySourceInfo } from "../ability"


const doSurveillance: Ability = {
  name: 'Do Surveillance',
  cost: { money: 50, actionPoints: 1 },
  possibleSources: ['Private Agent'],
  validTargetIf: ['fighter not owned by manager', 'opponent manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  disabled: false,
  priority: 1
}

export const doSurveillanceServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {target, source} = abilityData
    const {type, name} = target
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
  shortDescription: 'Get evidence on whats happening',
  longDescription: 'Find out what is happening with target manager or fighter. If the manager does anything or if anything happens to the fighter while they are being watched, the private agent will collect evidence.',
  ...doSurveillance
}
type HandleSurveillanceProps = {surveilledManager?: Manager, surveilledFighter?: Fighter, abilityData: AbilityData, game: Game}
export const handleUnderSurveillance = ({surveilledManager, surveilledFighter, abilityData, game}: HandleSurveillanceProps) => {
  const {source, name, target} = abilityData
  const {roundNumber} = game.has.roundController
  const privateAgentName = surveilledManager?.state.underSurveillance.professional || 
  surveilledFighter?.state.underSurveillance.professional

  const managerDoingSurveillance = game.has.managers.find(m => m.has.employees.find(e => e.name == privateAgentName))
  const illegalActivity = getIllegalActivityName(name)

  if(surveilledManager){
    const evidenceDescription = `(Week ${roundNumber}) - ${surveilledManager.has.name} ${source.type != 'Manager' ? `'s ${source.type} ${source.name}`: ''} was seen using ability ${name} ${target ? `targeting ${target.type} ${target.name}` : ''}`
  
    managerDoingSurveillance.has.evidence.push({id: Number(randomNumber({digits: 8})),managerName: surveilledManager.has.name, abilityData, illegalActivity, evidenceDescription})
  
    managerDoingSurveillance.functions.addToLog({type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source.name} doing "${name}" ${abilityData.source.type != 'Manager' ? `. ${source.name}  works for ${surveilledManager.has.name}` : ''}. You have stored this information away as evidence`})
  }


  if(surveilledFighter){
    const {source, target} = abilityData
    const {managers} = game.has
    const soureManager = source.type == 'Manager' ? managers.find(m => m.has.name == source.name) : managers.find(m => m.has.employees.some(e => e.name == source.name))

    if(soureManager.has.name == managerDoingSurveillance.has.name){
      return
    }

    const evidenceDescription = `(Week ${roundNumber}) - ${source.name} was seen using ability ${name} ${target ? `targeting ${target.type} ${target.name}` : ''}`
  
    managerDoingSurveillance.has.evidence.push({id: randomNumber({digits: 8}), managerName: soureManager.has.name, abilityData, illegalActivity, evidenceDescription})
  
    managerDoingSurveillance.functions.addToLog({type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source.name} doing "${name}" ${abilityData.source.type != 'Manager' ? `. ${source.name}  works for ${surveilledFighter.name}` : ''}. You have stored this information away as evidence`})
  }
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

