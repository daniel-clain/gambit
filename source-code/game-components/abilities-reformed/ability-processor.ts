
import Game from '../game';
import { ServerAbility, AbilityData } from './ability';
import { researchFighterServer } from './abilities/research-fighter';
import { ExecutesWhenOptions } from '../../types/game/executes-when-options';
import { assaultFighterServer } from './abilities/assault-fighter';
import { doSurveillanceServer } from './abilities/do-surveillance';
import { gatherEvidenceServer } from './abilities/gather-evidence';
import { guardFighterServer } from './abilities/guard-fighter';
import { murderFighterServer } from './abilities/murder-fighter';
import { offerContractServer } from './abilities/offer-contract';
import { poisonFighterServer } from './abilities/poison-fighter';
import { promoteFighterServer } from './abilities/promote-fighter';
import { sellDrugsServer } from './abilities/sell-drugs';
import { sueManagerServer } from './abilities/sue-manager';
import { trainFighterServer } from './abilities/train-fighter';
import Manager from '../manager/manager';
import { Employee } from '../../interfaces/game-ui-state.interface';
import { dopeFighterServer } from './abilities/dope-fighter';

export interface AbilityProcessor{
  delayedExecutionAbilities: AbilityData[]
  processSelectedAbility(selectedAbility: AbilityData)
}

export const abilityProcessor = (game: Game): AbilityProcessor => {
  
  const abilities: ServerAbility[] = [    
    assaultFighterServer,
    doSurveillanceServer,
    gatherEvidenceServer,
    guardFighterServer,
    murderFighterServer,
    offerContractServer,
    poisonFighterServer,
    promoteFighterServer,
    researchFighterServer,
    sellDrugsServer,
    sueManagerServer,
    trainFighterServer,
    dopeFighterServer
  ]
  let delayedExecutionAbilities: AbilityData[] = []

  game.roundController.endOfManagerOptionsStageSubject.subscribe(
    () => executeAbilities('End Of Manager Options Stage')
  )
  game.roundController.endOfRoundSubject.subscribe(
    () => executeAbilities('End Of Round')
  )

  const executeAbilities = (executes: ExecutesWhenOptions) => {
    delayedExecutionAbilities.map((delayedAbility: AbilityData): {ability: ServerAbility, abilityData: AbilityData} => ({
      ability: abilities.find(ability => ability.name == delayedAbility.name), 
      abilityData: delayedAbility
    }))
    .filter(({ability}: {ability: ServerAbility}) => ability.executes == executes)
    .forEach(({ability, abilityData}: {ability: ServerAbility, abilityData: AbilityData}) => ability.execute(abilityData, game))

    let indexToBeRemoved
    while(indexToBeRemoved != -1){
      if(indexToBeRemoved != undefined)
        delayedExecutionAbilities.splice(indexToBeRemoved, 1)
      indexToBeRemoved = 
      delayedExecutionAbilities.findIndex((delayedAbility: AbilityData) => 
        abilities.find(ability => ability.name == delayedAbility.name).executes == executes
      )
    }
  }

  const subtractCost = (ability: ServerAbility, abilityData: AbilityData) => {
    let manager: Manager
    if(abilityData.source.type == 'Manager'){
      manager = game.managers.find(manager => manager.name == abilityData.source.name)
      manager.actionPoints -= ability.cost.actionPoints
    }
    else{
      manager = game.managers.find(manager => manager.employees.some(employee => employee.name == abilityData.source.name))
      const employee: Employee = manager.employees.find(employee => employee.name == abilityData.source.name)
      employee.actionPoints -= ability.cost.actionPoints
    }
    manager.money -= ability.cost.money

    //manager.addToLog({message: `${abilityData.source.name} has used ${ability.name} ${abilityData.target ? 'targeting ' + abilityData.target.name : ''}${ability.executes == 'End Of Round' ? ', it will resolve at the end of the round' : '' }`})

  }
  function processSelectedAbility(abilityData: AbilityData){
    const ability: ServerAbility = abilities.find(ability => ability.name == abilityData.name)
    subtractCost(ability, abilityData)
    if(ability.executes == 'Instantly')
      ability.execute(abilityData, game)
    else
      delayedExecutionAbilities.push(abilityData)    
  }

  return {
    delayedExecutionAbilities, 
    processSelectedAbility
  }
}