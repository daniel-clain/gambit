import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { ActiveContract, ContractOffer } from "../../../interfaces/game/contract.interface"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Employee, JobSeeker } from "../../../interfaces/front-end-state-interface"


const offerContract: Ability = {
  name: 'Offer Contract',
  cost: { money: 0, actionPoints: 1 },
  possibleSources: ['Manager', 'Talent Scout'],
  validTargetIf: ['job seeker'],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: true
}

export const offerContractServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    let manager: Manager
 
    if(abilityData.source.type == 'Manager'){
      manager = game.has.managers.find((manager: Manager) => manager.has.name == abilityData.source.name)
    }
    else{      
      manager = game.has.managers.find((manager: Manager) => {
        return manager.has.employees.some(employee => employee.name == abilityData.source.name)
      })
    }

    const contractOffer: ContractOffer = abilityData.additionalData.contractOffer

    const jobSeeker: JobSeeker = game.has.roundController.jobSeekers.find(jobSeeker => jobSeeker.name == abilityData.target.name)

    const isRecontractingFighter: boolean = !jobSeeker

    if(jobSeeker){
      if(jobSeeker.type == 'Professional'){
        const {abilities, profession, skillLevel, name} = jobSeeker
        const activeContract: ActiveContract = {
          weeklyCost: contractOffer.weeklyCost, 
          weeksRemaining: contractOffer.numberOfWeeks
        }
        const jobSeekerIndex = game.has.roundController.jobSeekers.findIndex(jobSeeker => jobSeeker.name == abilityData.target.name)
        game.has.roundController.jobSeekers.splice(jobSeekerIndex, 1)
        const employee: Employee = {abilities, profession, skillLevel, name, activeContract, actionPoints: 1}
        manager.has.employees.push(employee)
      }
      if(jobSeeker.type == 'Fighter'){
        const fighter: Fighter = game.has.fighters.find(fighter => fighter.name == jobSeeker.name)
        if(fighter.state.dead){
          manager.functions.addToLog({message: `Offer contract to ${abilityData.target.name} failed because he was murdered`, type: 'employee outcome'})
          return
        }
        manager.has.fighters.push(fighter)
        fighter.state.manager = manager
        const activeContract: ActiveContract = {
          weeklyCost: contractOffer.weeklyCost, 
          weeksRemaining: contractOffer.numberOfWeeks
        }
        fighter.state.activeContract = activeContract
        const knownFighterIndex = manager.has.knownFighters.findIndex(fighter => fighter.name == abilityData.target.name)
        manager.has.knownFighters.splice(knownFighterIndex, 1)
      }
    }
    if(isRecontractingFighter){
      const fighter = manager.has.fighters.find(fighter => fighter.name == abilityData.target.name)
      if(fighter){
        fighter.state.activeContract = {
          weeklyCost: contractOffer.weeklyCost,
          weeksRemaining: contractOffer.numberOfWeeks
        }
        fighter.state.goalContract = null
      }
    }

    manager.functions.addToLog({message: `${abilityData.target.name} has agreed to the contract offed.`, type: 'employee outcome'});

    return 
  },
  ...offerContract
}

export const offerContractClient: ClientAbility = {
  shortDescription: 'Offer a contract to work for you',
  longDescription: `Offer a fighter or professional a contract to work for you, you earn more money when your fighter wins, and your employees can perform actions on your behalf. If you offer less than what they're asking for, theres a chance they will refuse. If another manager makes a better offer, they will take that offer instead`,
  ...offerContract
}

