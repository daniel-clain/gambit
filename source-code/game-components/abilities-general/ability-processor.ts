
import { ServerAbility, AbilityData } from './ability';
import { researchFighterServer } from './abilities/research-fighter';
import { ExecutesWhenOptions } from '../../types/game/executes-when-options';
import { assaultFighterServer } from './abilities/assault-fighter';
import { doSurveillanceServer } from './abilities/do-surveillance';
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
import { investigateManagerServer } from './abilities/investigate-manager';
import { dominationVictoryServer } from './abilities/domination-victory';
import { sinisterVictoryServer } from './abilities/sinister-victory';
import { wealthVictoryServer } from './abilities/wealth-victory';
import { takeADiveServer } from './abilities/take-a-dive';

import { getAbilitySourceManager } from './ability-service-server';
import { ifSourceIsEmployee, ifSourceIsManager, ifTargetIsFighter } from '../../client/front-end-service/ability-service-client';

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
    guardFighterServer,
    murderFighterServer,
    offerContractServer,
    poisonFighterServer,
    promoteFighterServer,
    researchFighterServer,
    sellDrugsServer,
    prosecuteManagerServer,
    takeADiveServer,
    trainFighterServer,
    dopeFighterServer,
    investigateManagerServer,
    dominationVictoryServer,
    sinisterVictoryServer,
    wealthVictoryServer
  ]
  delayedExecutionAbilities: AbilityData[] = []

  executeAbilities(executes: ExecutesWhenOptions){
    
    if(executes == 'End Of Week'){
      const offerContractInstances = this.delayedExecutionAbilities.filter((delayedAbility => delayedAbility.name == 'Offer Contract'))
      const offerContractAbility = this.abilities.find(ability => ability.name == 'Offer Contract')
      this.handleOfferContractInstances(offerContractAbility, offerContractInstances)
    }



    const sortedAbilitiesToExecute = this.delayedExecutionAbilities.map((delayedAbility: AbilityData): {ability: ServerAbility, abilityData: AbilityData} => ({
      ability: this.abilities.find(ability => ability.name == delayedAbility.name), 
      abilityData: delayedAbility
    }))
    .filter(({ability}: {ability: ServerAbility}) => {
      if(ability.name == 'Offer Contract') return false
      if(
        ability.executes instanceof Array ? 
        ability.executes.includes(executes) : 
        ability.executes == executes 
      ) return true
      else return false
    })
    .sort((a, b) => !a.ability.priority ? 1 : !b.ability.priority ? -1 : a.ability.priority-b.ability.priority)

    sortedAbilitiesToExecute.forEach(({ability, abilityData}: {ability: ServerAbility, abilityData: AbilityData}) => {
      
      const {source, target} = abilityData
      if(target?.characterType == 'Fighter'){
      
        
        const fighter = this.game.has.fighters.find(fighter => fighter.name == target.name)
        
        
        if(fighter.state.dead){
          const {weekNumber} = this.game.has.weekController
          const sourceManager = getAbilitySourceManager(source, this.game)
          sourceManager.functions.addToLog({
            weekNumber,
            message: `Attempt to ${ability.name} targeting ${target.name} failed because he was found dead`, type: 'employee outcome'
          })
          return
        }
        else {
          ability.execute(abilityData, this.game, executes)
        }

      }
      else{
        ability.execute(abilityData, this.game, executes)
      }

    })


    this.game.functions.triggerUIUpdate()

    let indexToBeRemoved
    while(indexToBeRemoved != -1){
      if(indexToBeRemoved != undefined)
      this.delayedExecutionAbilities.splice(indexToBeRemoved, 1)
      indexToBeRemoved = 
      this.delayedExecutionAbilities.findIndex((delayedAbility: AbilityData) => {
        const abilityExecutes = this.abilities.find(ability => ability.name == delayedAbility.name).executes
        
        if(abilityExecutes instanceof Array){
          return abilityExecutes.reduce((isFinalTimeExecuted, executeTime) => {

            if(isFinalTimeExecuted) return true

            if(
              executeTime == 'End Of Week' && 
              executeTime == executes
            ) return true

            if(
              executeTime == 'End Of Manager Options Stage' && 
              executeTime == executes && 
              !abilityExecutes.includes('End Of Week')
            ) {
              return true
            }

            if(
              executeTime == 'Instantly' && 
              executeTime == executes && 
              !abilityExecutes.includes('End Of Manager Options Stage') &&
              !abilityExecutes.includes('End Of Week')
            ) return true

          }, false)
          
        } else return abilityExecutes == executes


      })
    }
  }

  

  processSelectedAbility = (abilityData: AbilityData) => {
    const {target, source} = abilityData
    const ability: ServerAbility = this.abilities.find(ability => ability.name == abilityData.name)
    this.subtractCost(ability, abilityData)
    const {weekNumber} = this.game.has.weekController

    const manager = getAbilitySourceManager(source, this.game)

    manager.functions.addToLog({
      message: `Used ability ${abilityData.name}${target ? `, targeting ${target.name}` : ''}`,
      weekNumber
    })
    
    ability.onSelected?.(abilityData, this.game)

    if(ability.executes == 'Instantly'){
      ability.execute(abilityData, this.game)
      this.game.functions.triggerUIUpdate()
    }

    else
      this.delayedExecutionAbilities.push(abilityData)   

    this.game.functions.triggerUIUpdate()

    
  }

  private subtractCost(ability: ServerAbility, abilityData: AbilityData){
    const {source} = abilityData

    const manager = getAbilitySourceManager(source, this.game)

    ifSourceIsManager(source, () => 
      manager.has.actionPoints -= ability.cost.actionPoints
    )
    
    ifSourceIsEmployee(source, () => {
      const employee = manager.has.employees.find(e => e.name == source.name)
      employee.actionPoints -= ability.cost.actionPoints
    })
    
    manager.has.money -= ability.cost.money

  }

  private handleOfferContractInstances(offerContractAbility: ServerAbility, offerContractInstances: AbilityData[]){
    const {weekController, fighters} = this.game.has
    const {jobSeekers, weekNumber} = weekController
    const offerContractTargets = getOffersArray()

  
    
    offerContractTargets.forEach(offerContractTarget => {
      const jobSeeker = jobSeekers.find(j => j.name == offerContractTarget.targetName)
      if(offerContractTarget.instances.length == 1){
        offerContractAbility.execute(offerContractTarget.instances[0], this.game)
        return
      }
  
      const sortedInstances = sortBestOffer(offerContractTarget.instances)
      // get all equal hightest offers
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
          const manager = getAbilitySourceManager(offerContractInstance.source, this.game)
          const {weekNumber} = this.game.has.weekController
  
          manager.functions.addToLog({
            weekNumber,
            message: `${target.name} (${jobSeeker?.profession ? jobSeeker.profession : jobSeeker.type}) rejected your contract offer because he has accepted the offer of another manager`, 
            type: 'report'})
        }
      })
  
    }) 
    
    this.game.functions.triggerUIUpdate()
  
    

    /* implementation */
  
    function getOffersArray(): {targetName: string, instances: AbilityData[]}[]{
      
      const offers: {targetName: string, instances: AbilityData[]}[] = []

      offerContractInstances.forEach(offerContractInstance => {
        const {target, source, additionalData} = offerContractInstance
        const jobSeeker = jobSeekers.find(jobSeeker => jobSeeker.name == target.name)
        const contractOffer: ContractOffer = additionalData.contractOffer

        let goalContract: GoalContract
        if(jobSeeker)
          goalContract = jobSeeker.goalContract
        else
          goalContract = fighters.find(fighter => fighter.name == target.name).state.goalContract

        const randomThreshold = (random(5) + 5) / 10
        if(contractOffer.weeklyCost < goalContract.weeklyCost * randomThreshold){
          
          const manager = this.getAbilitySourceManager(offerContractInstance)

          manager.functions.addToLog({
            weekNumber,
            message: `Job seeker ${target.name} (${!jobSeeker ? 'Fighter' : jobSeeker.type == 'Fighter' ? 'Fighter' : jobSeeker.profession}) rejected your contract offer because you offered too little`, 
            type: 'report'})
          return
        }
    
        const targetExists = offers.find(offerContractTarget => offerContractTarget.targetName == offerContractInstance.target.name)
        if(!targetExists)
          offers.push({
            targetName: offerContractInstance.target.name,
            instances: [offerContractInstance]
          })
        else
          targetExists.instances.push(offerContractInstance)
      })
      return offers
    }



    function sortBestOffer(offerContractInstances: AbilityData[]): AbilityData[]{    
      return offerContractInstances.sort((abilityDataA: AbilityData, abilityDataB: AbilityData) => { 
        const a = abilityDataA.additionalData.contractOffer.weeklyCost
        const b = abilityDataB.additionalData.contractOffer.weeklyCost
        return a > b ? -1 : a < b ? 1 : 0
      })
    }
    
  }

  
}


