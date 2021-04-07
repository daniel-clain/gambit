
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
import { prosecuteManagerServer } from './abilities/prosecute-manager';
import { trainFighterServer } from './abilities/train-fighter';
import { dopeFighterServer } from './abilities/dope-fighter';
import { random } from '../../helper-functions/helper-functions';
import { ContractOffer, GoalContract } from '../../interfaces/game/contract.interface';
import { Game } from '../game';
import { Manager } from '../manager';
import { Employee } from '../../interfaces/front-end-state-interface';

export interface AbilityProcessor{
  delayedExecutionAbilities: AbilityData[]
  processSelectedAbility(selectedAbility: AbilityData): void
}

export class AbilityProcessor{
  /* needs an implementation class */

  constructor(private game: Game){}
  
  private abilities: ServerAbility[] = [    
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
    prosecuteManagerServer,
    trainFighterServer,
    dopeFighterServer
  ]
  delayedExecutionAbilities: AbilityData[] = []

  executeAbilities(executes: ExecutesWhenOptions){
    if(executes == 'End Of Round'){
      const offerContractInstances = this.delayedExecutionAbilities.filter((delayedAbility => delayedAbility.name == 'Offer Contract'))
      const offerContractAbility = this.abilities.find(ability => ability.name == 'Offer Contract')
      this.handleOfferContractInstances(offerContractAbility, offerContractInstances)
    }



    this.delayedExecutionAbilities.map((delayedAbility: AbilityData): {ability: ServerAbility, abilityData: AbilityData} => ({
      ability: this.abilities.find(ability => ability.name == delayedAbility.name), 
      abilityData: delayedAbility
    }))
    .filter(({ability}: {ability: ServerAbility}) => ability.executes == executes && ability.name != 'Offer Contract')
    .forEach(({ability, abilityData}: {ability: ServerAbility, abilityData: AbilityData}) => 
      ability.execute(abilityData, this.game)
    )


    this.game.functions.triggerUIUpdate()

    let indexToBeRemoved
    while(indexToBeRemoved != -1){
      if(indexToBeRemoved != undefined)
      this.delayedExecutionAbilities.splice(indexToBeRemoved, 1)
      indexToBeRemoved = 
      this.delayedExecutionAbilities.findIndex((delayedAbility: AbilityData) => 
      this.abilities.find(ability => ability.name == delayedAbility.name).executes == executes
      )
    }
  }

  getAbilitySourceManager(abilityData: AbilityData):Manager{
    if(abilityData.source.type == 'Manager'){
      return this.game.has.managers.find(manager => manager.has.name == abilityData.source.name)
    }
    else{
      return this.game.has.managers.find(manager => manager.has.employees.some(employee => employee.name == abilityData.source.name))
    }
  }

  processSelectedAbility = (abilityData: AbilityData) => {
    const ability: ServerAbility = this.abilities.find(ability => ability.name == abilityData.name)
    this.subtractCost(ability, abilityData)
    console.log();

    const manager = this.getAbilitySourceManager(abilityData)

    manager.functions.addToLog({message: `Used ability ${abilityData.name}${abilityData.target ? `, targeting ${abilityData.target.name}` : ''}`})
    

    if(ability.executes == 'Instantly'){
      ability.execute(abilityData, this.game)
      this.game.functions.triggerUIUpdate()
    }

    else
      this.delayedExecutionAbilities.push(abilityData)   

    this.game.functions.triggerUIUpdate()

    
  }

  private subtractCost(ability: ServerAbility, abilityData: AbilityData){
    const manager = this.getAbilitySourceManager(abilityData)
    if(abilityData.source.type == 'Manager'){
      manager.has.actionPoints -= ability.cost.actionPoints
    }
    else{
      const employee: Employee = manager.has.employees.find(employee => employee.name == abilityData.source.name)
      employee.actionPoints -= ability.cost.actionPoints
    }
    manager.has.money -= ability.cost.money

    //manager.functions.addToLog({message: `${abilityData.source.name} has used ${ability.name} ${abilityData.target ? 'targeting ' + abilityData.target.name : ''}${ability.executes == 'End Of Round' ? ', it will resolve at the end of the round' : '' }`})

  }

  private handleOfferContractInstances(offerContractAbility: ServerAbility, offerContractInstances: AbilityData[]){
    const {roundController, fighters, managers} = this.game.has
    const {jobSeekers} = roundController
    const offerContractTargets: {targetName: string, instances: AbilityData[]}[] = []

    
  
  
    offerContractInstances.forEach(offerContractInstance => {
      const {target, source, additionalData} = offerContractInstance
      const jobSeeker = jobSeekers.find(jobSeeker => jobSeeker.name == target.name)
      const contractOffer: ContractOffer = additionalData.contractOffer
      let goalContract: GoalContract
      if(jobSeeker)
        goalContract = jobSeeker.goalContract
      else
        goalContract = fighters.find(fighter => fighter.name == target.name).state.goalContract
      const randomThreshhold = (random(5) + 5) / 10
      if(contractOffer.weeklyCost < goalContract.weeklyCost * randomThreshhold){
        const manager = source.type == 'Manager' ? managers.find(manager => manager.has.name == source.name) : managers.find(manager => manager.has.employees.some(employee => employee.name == source.name))
        manager.functions.addToLog({message: `Job seeker ${target.name} (${!jobSeeker ? 'Fighter' : jobSeeker.type == 'Fighter' ? 'Fighter' : jobSeeker.profession}) rejected your contract offer because you offered too little`, type: 'report'})
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
        offerContractAbility.execute(offerContractTarget.instances[0], this.game)
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
          offerContractAbility.execute(offerContractInstance, this.game)
        else{        
          const {target} = offerContractInstance
          const manager = this.getAbilitySourceManager(offerContractInstance)
  
          manager.functions.addToLog({message: `${target.name} (${jobSeeker ? jobSeeker.profession : 'Fighter'}) rejected your contract offer because he has accepeted the offer of another manager`, type: 'report'})
        }
      })
  
    }) 
    
    this.game.functions.triggerUIUpdate()
    
  }

  
}


