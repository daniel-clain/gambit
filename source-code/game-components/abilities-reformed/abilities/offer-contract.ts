import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import Manager from "../../manager"
import { ActiveContract, ContractOffer } from "../../../interfaces/game/contract.interface"
import Fighter from "../../fighter/fighter"
import { JobSeeker, Employee } from "../../../interfaces/game-ui-state.interface"


const offerContract: Ability = {
  name: 'Offer Contract',
  cost: { money: 0, actionPoints: 1 },
  possibleTargets: ['job seeker', 'recontracting fighter'],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: true
}

export const offerContractServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    let manager: Manager
 
    if(abilityData.source.type == 'Manager'){
      manager = game.managers.find((manager: Manager) => manager.name == abilityData.source.name)
    }
    else{      
      manager = game.managers.find((manager: Manager) => {
        return manager.employees.some(employee => employee.name == abilityData.source.name)
      })
    }

    const contractOffer: ContractOffer = abilityData.additionalData.contractOffer

    const jobSeeker: JobSeeker = game.roundController.jobSeekers.find(jobSeeker => jobSeeker.name == abilityData.target.name)

    const isRecontractingFighter: boolean = !jobSeeker

    if(jobSeeker){
      if(jobSeeker.type == 'Professional'){
        const {abilities, profession, skillLevel, name} = jobSeeker
        const activeContract: ActiveContract = {
          weeklyCost: contractOffer.weeklyCost, 
          weeksRemaining: contractOffer.numberOfWeeks,
          numberOfWeeks: contractOffer.numberOfWeeks
        }
        game.roundController.jobSeekers.splice(game.roundController.jobSeekers.findIndex(jobSeeker => jobSeeker.name == abilityData.target.name), 1)
        const employee: Employee = {abilities, profession, skillLevel, name, activeContract, actionPoints: 1}
        manager.employees.push(employee)
      }
      if(jobSeeker.type == 'Fighter'){
        const fighter: Fighter = game.fighters.find(fighter => fighter.name == jobSeeker.name)
        if(fighter.state.dead){
          manager.addToLog({message: `Offer contract to ${abilityData.target.name} failed beacuse he was murdered`})
          return
        }
        manager.fighters.push(fighter)
        fighter.state.manager = manager
        const activeContract: ActiveContract = {
          weeklyCost: contractOffer.weeklyCost, 
          weeksRemaining: contractOffer.numberOfWeeks,
          numberOfWeeks: contractOffer.numberOfWeeks
        }
        fighter.state.activeContract = activeContract
        const knownFighterIndex = manager.knownFighters.findIndex(fighter => fighter.name == abilityData.target.name)
        manager.knownFighters.splice(knownFighterIndex, 1)
      }
    }
    if(isRecontractingFighter){
      const fighter = manager.fighters.find(fighter => fighter.name == abilityData.target.name)
      if(fighter){
        fighter.state.activeContract = {
          weeklyCost: contractOffer.weeklyCost,
          weeksRemaining: contractOffer.numberOfWeeks,
          numberOfWeeks: contractOffer.numberOfWeeks
        }
      }
    }

    manager.addToLog({message: `${abilityData.target.name} has agreed to the contract offed by ${abilityData.source.name}. ${abilityData.target.name} now works for you`});

    return 
  },
  ...offerContract
}

export const offerContractClient: ClientAbility = {
  shortDescription: 'Offer a contract to work for you',
  longDescription: 'Offer a fighter or proffessional a contract to work form you, you earn more money when your fighter wins, and your empoyees can perform actions on your behalf',
  ...offerContract
}

