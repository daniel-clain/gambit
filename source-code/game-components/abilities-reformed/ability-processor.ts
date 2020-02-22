
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
import Manager from '../manager';
import { Employee, JobSeeker } from '../../interfaces/game-ui-state.interface';
import { dopeFighterServer } from './abilities/dope-fighter';
import { random } from '../../helper-functions/helper-functions';
import { ContractOffer, GoalContract } from '../../interfaces/game/contract.interface';

export interface AbilityProcessor{
  delayedExecutionAbilities: AbilityData[]
  processSelectedAbility(selectedAbility: AbilityData)
}

export const getAbilityProcessor = (game: Game): AbilityProcessor => {
  
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
    if(executes == 'End Of Round'){
      const offerContractInstances = delayedExecutionAbilities.filter((delayedAbility => delayedAbility.name == 'Offer Contract'))
      const offerContractAbility = abilities.find(ability => ability.name == 'Offer Contract')
      handleOfferContractInstances(offerContractAbility, offerContractInstances, game)
    }



    delayedExecutionAbilities.map((delayedAbility: AbilityData): {ability: ServerAbility, abilityData: AbilityData} => ({
      ability: abilities.find(ability => ability.name == delayedAbility.name), 
      abilityData: delayedAbility
    }))
    .filter(({ability}: {ability: ServerAbility}) => ability.executes == executes && ability.name != 'Offer Contract')
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


function handleOfferContractInstances(offerContractAbility: ServerAbility, offerContractInstances: AbilityData[], game: Game){

  const {jobSeekers} = game.roundController
  const offerContractTargets: {targetName: string, instances: AbilityData[]}[] = []


  offerContractInstances.forEach(offerContractInstance => {
    const {target, source, additionalData} = offerContractInstance
    const jobSeeker = jobSeekers.find(jobSeeker => jobSeeker.name == target.name)
    const contractOffer: ContractOffer = additionalData.contractOffer
    let goalContract: GoalContract
    if(jobSeeker)
      goalContract = jobSeeker.goalContract
    else
      goalContract = game.fighters.find(fighter => fighter.name == target.name).state.goalContract
    const randomThreshhold = (random(5) + 5) / 10
    if(contractOffer.weeklyCost < goalContract.weeklyCost * randomThreshhold){
      const manager = source.type == 'Manager' ? game.managers.find(manager => manager.name == source.name) : game.managers.find(manager => manager.employees.some(employee => employee.name == source.name))
      manager.addToLog({message: `Job seeker ${target.name} (${!jobSeeker ? 'Fighter' : jobSeeker.type == 'Fighter' ? 'Fighter' : jobSeeker.profession}) rejected your contract offer because you offered too little`})
      return
    }

    const targetExists = offerContractTargets.find(offerCOntractTarget => offerCOntractTarget.targetName == offerContractInstance.target.name)
    if(!targetExists)
      offerContractTargets.push({
        targetName: offerContractInstance.target.name,
        instances: [offerContractInstance]
      })
    else
      targetExists.instances.push(offerContractInstance)
  })


  function sortBestOffer(offerContractInstances: AbilityData[]): AbilityData[]{    
    return offerContractInstances.sort((abilityDataA: AbilityData, abilityDataB: AbilityData) => { 
      const a = abilityDataA.additionalData.contractOffer.weeklyCost
      const b = abilityDataB.additionalData.contractOffer.weeklyCost
      return a > b ? -1 : a < b ? 1 : 0
    })
  }
  
  offerContractTargets.forEach(offerContractTarget => {
  const jobSeeker = jobSeekers.find(j => j.name == offerContractTarget.targetName)
    if(offerContractTarget.instances.length == 1){
      offerContractAbility.execute(offerContractTarget.instances[0], game)
      return
    }

    const sortedInstances = sortBestOffer(offerContractTarget.instances)
    
    const bestOfferInstances = sortedInstances.filter(instance => instance.additionalData.contractOffer.weeklyCost == sortedInstances[0].additionalData.contractOffer.weeklyCost)

    let selectedSourceName

    const numberOfTiedInstances = bestOfferInstances.length
    if(numberOfTiedInstances == 1)   
      selectedSourceName = bestOfferInstances[0].source.name
    else{
      const randomSelection = random(numberOfTiedInstances - 1)
      selectedSourceName = bestOfferInstances[randomSelection].source.name
    }
    offerContractTarget.instances.forEach(offerContractInstance => {
      if(offerContractInstance.source.name == selectedSourceName)
        offerContractAbility.execute(offerContractInstance, game)
      else{        
        const {target, source} = offerContractInstance
        const manager = source.type == 'Manager' ? game.managers.find(manager => manager.name == source.name) : game.managers.find(manager => manager.employees.some(employee => employee.name == source.name))

        manager.addToLog({message: `${target.name} (${jobSeeker ? jobSeeker.profession : 'Fighter'}) rejected your contract offer because he has accepeted the offer of another manager`})
      }
    })

  }) 
  
}