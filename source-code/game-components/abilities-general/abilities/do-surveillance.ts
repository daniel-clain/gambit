import { ifSourceIsEmployee, ifSourceIsManager, ifTargetIsFighter, ifTargetIsJobSeeker, ifTargetIsManager } from "../../../client/front-end-service/ability-service-client"
import { randomNumber } from "../../../helper-functions/helper-functions"
import { JobSeeker } from "../../../interfaces/front-end-state-interface"
import { IllegalActivityName } from "../../../types/game/evidence.type"
import { Profession } from "../../../types/game/profession"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, ServerAbility, AbilityData, AbilityName } from "../ability"
import { getSourceType, getTargetType } from "../ability-service-server"


export const doSurveillance: Ability = {
  name: 'Do Surveillance',
  cost: { money: 50, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  priority: 1
}

export const doSurveillanceServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {target, source} = abilityData

    ifTargetIsFighter(target, fighterInfo => {
      const fighter = game.has.fighters.find(f => f.name == fighterInfo.name)
      fighter.state.underSurveillance = {
        professional: source.name
      }
    })

    ifTargetIsManager(target, managerInfo => {
      const manager = game.has.managers.find(m => m.has.name == managerInfo.name)
      manager.state.underSurveillance = {
        professional: source.name
      }
    })

  },
  ...doSurveillance
}


type HandleSurveillanceProps = {surveilledManager?: Manager, surveilledFighter?: Fighter, abilityData: AbilityData, game: Game}


export const handleUnderSurveillance = ({surveilledManager, surveilledFighter, abilityData, game}: HandleSurveillanceProps) => {
  /* ability data is the ability being surveiled , not this surveil ability */
  const {source, name, target} = abilityData
  const {weekNumber} = game.has.weekController
  const privateAgentName = surveilledManager?.state.underSurveillance.professional || 
  surveilledFighter?.state.underSurveillance.professional

  const sourceType = getSourceType(source)
  const targetType = target && getTargetType(target)



  const managerDoingSurveillance = game.has.managers.find(m => m.has.employees.find(e => e.name == privateAgentName))
  const illegalActivity = getIllegalActivityName(name)

  if(surveilledManager){
    const evidenceDescription = `(Week ${weekNumber}) - ${surveilledManager.has.name} ${sourceType != 'Manager' ? `'s ${sourceType} ${source.name}`: ''} was seen using ability ${name} ${target ? `targeting ${targetType} ${target.name}` : ''}`
  
    managerDoingSurveillance.has.evidence.push({id: Number(randomNumber({digits: 8})),managerName: surveilledManager.has.name, abilityData, illegalActivity, evidenceDescription})
  
    managerDoingSurveillance.functions.addToLog({
      weekNumber,
      type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source.name} doing "${name}" ${sourceType != 'Manager' ? `. ${source.name}  works for ${surveilledManager.has.name}` : ''}. You have stored this information away as evidence`})
  }


  if(surveilledFighter){
    const {source, target} = abilityData
    const {managers} = game.has
    const sourceManager = sourceType == 'Manager' ? managers.find(m => m.has.name == source.name) : managers.find(m => m.has.employees.some(e => e.name == source.name))

    if(sourceManager.has.name == managerDoingSurveillance.has.name){
      return
    }

    const evidenceDescription = `(Week ${weekNumber}) - ${source.name} was seen using ability ${name} ${target ? `targeting ${targetType} ${target.name}` : ''}`
  
    managerDoingSurveillance.has.evidence.push({id: randomNumber({digits: 8}), managerName: sourceManager.has.name, abilityData, illegalActivity, evidenceDescription})
  
    managerDoingSurveillance.functions.addToLog({
      weekNumber,
      type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source.name} doing "${name}" ${sourceType != 'Manager' ? `. ${source.name}  works for ${surveilledFighter.name}` : ''}. You have stored this information away as evidence`})
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

