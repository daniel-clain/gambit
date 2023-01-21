
import { randomNumber, randomNumberDigits } from "../../../helper-functions/helper-functions"
import { IllegalActivityName } from "../../../types/game/evidence.type"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, ServerAbility, AbilityData, AbilityName } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"


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
    const {fighters, managers} = game.has

    const fighter = target!.characterType == 'Fighter' && fighters.find(f => f.name == target!.name) || undefined

    const manager = target!.characterType == 'Known Manager' && managers.find(m => m.has.name == target!.name) || undefined
    
    ;(fighter || manager)!.state.underSurveillance = {professional: source!.name}
    


  },
  ...doSurveillance
}


type HandleSurveillanceProps = {surveilledManager?: Manager, surveilledFighter?: Fighter, abilityData: AbilityData, game: Game}


export const handleUnderSurveillance = ({surveilledManager, surveilledFighter, abilityData, game}: HandleSurveillanceProps) => {
  /* ability data is the ability being surveiled , not this surveil ability */
  const {source, name, target} = abilityData
  const {weekNumber} = game.has.weekController
  const privateAgentName = surveilledManager?.state.underSurveillance!.professional || 
  surveilledFighter?.state.underSurveillance!.professional



  const managerDoingSurveillance = game.has.managers.find(m => m.has.employees.find(e => e.name == privateAgentName))!

  const agentDoingSurveillance = managerDoingSurveillance.has.employees.find(e => e.name == privateAgentName)


  const randomNum = randomNumber({to: 100})
  const chanceToDiscover = 70 + agentDoingSurveillance.skillLevel * 10

  const willDiscover = chanceToDiscover > randomNum

  const illegalActivity = getIllegalActivityName(name)

  if(surveilledManager && willDiscover){
    const evidenceDescription = `(Week ${weekNumber}) - ${surveilledManager.has.name} ${source!.characterType != 'Manager' ? `'s ${source!.characterType} ${source!.name}`: ''} was seen using ability ${name} ${target ? `targeting ${target.characterType} ${target.name}` : ''}`
  
    managerDoingSurveillance.has.evidence.push({id: Number(randomNumberDigits(8)), managerName: surveilledManager.has.name, abilityData, illegalActivity, evidenceDescription})
  
    managerDoingSurveillance.functions.addToLog({
      weekNumber,
      type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source!.name} doing "${name}" ${source!.characterType != 'Manager' ? `. ${source!.name}  works for ${surveilledManager.has.name}` : ''}. You have stored this information away as evidence`})
  }


  if(surveilledFighter && willDiscover){
    const {source, target} = abilityData
    const sourceManager = getAbilitySourceManager(source!, game)


    const evidenceDescription = `(Week ${weekNumber}) - ${source!.name} was seen using ability ${name} ${target ? `targeting ${target.characterType} ${target.name}` : ''}`
  
    managerDoingSurveillance.has.evidence.push({id: randomNumberDigits(8), managerName: sourceManager.has.name, abilityData, illegalActivity, evidenceDescription})
  
    managerDoingSurveillance.functions.addToLog({
      weekNumber,
      type: 'employee outcome', message: `Your private agent ${privateAgentName} has caught ${source!.name} doing "${name}" ${source?.characterType != 'Manager' ? `. ${source!.name}  works for ${surveilledFighter.name}` : ''}. You have stored this information away as evidence`})
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
  return mapObj[ability]!
}

