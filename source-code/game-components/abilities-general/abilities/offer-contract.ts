import { Ability, ServerAbility, AbilityData } from "../ability"
import { ActiveContract, ContractOffer } from "../../../interfaces/game/contract.interface"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Employee, JobSeeker } from "../../../interfaces/front-end-state-interface"
import { getAbilitySourceManager } from "../ability-service-server"


export const offerContract: Ability = {
  name: 'Offer Contract',
  cost: { money: 0, actionPoints: 1 },
  executes: 'End Of Week',
  canOnlyTargetSameTargetOnce: true
}

export const offerContractServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {weekNumber} = game.has.weekController
    const {target, source} = abilityData
    const sourceManager = getAbilitySourceManager(source, game)
 
    const contractOffer: ContractOffer = abilityData.additionalData.contractOffer

    const jobSeeker: JobSeeker = game.has.weekController.jobSeekers.find(jobSeeker => jobSeeker.name == target.name)

    const isRecontractingFighter: boolean = !jobSeeker

    if(jobSeeker){
      if(jobSeeker.type == 'Professional'){
        const {abilities, profession, skillLevel, name} = jobSeeker
        const activeContract: ActiveContract = {
          weeklyCost: contractOffer.weeklyCost, 
          weeksRemaining: contractOffer.numberOfWeeks
        }
        const jobSeekerIndex = game.has.weekController.jobSeekers.findIndex(jobSeeker => jobSeeker.name == target.name)
        game.has.weekController.jobSeekers.splice(jobSeekerIndex, 1)
        const employee: Employee = {characterType: 'Employee', abilities, profession, skillLevel, name, activeContract, actionPoints: 1}
        sourceManager.has.employees.push(employee)
      }
      if(jobSeeker.type == 'Fighter'){
        const fighter: Fighter = game.has.fighters.find(fighter => fighter.name == jobSeeker.name)
        if(fighter.state.dead){
          sourceManager.functions.addToLog({
            weekNumber,
            message: `Offer contract to ${target.name} failed because he was murdered`, type: 'employee outcome'})
          return
        }
        sourceManager.has.fighters.push(fighter)
        fighter.state.manager = sourceManager
        const activeContract: ActiveContract = {
          weeklyCost: contractOffer.weeklyCost, 
          weeksRemaining: contractOffer.numberOfWeeks
        }
        fighter.state.activeContract = activeContract
        const knownFighterIndex = sourceManager.has.knownFighters.findIndex(fighter => fighter.name == target.name)
        sourceManager.has.knownFighters.splice(knownFighterIndex, 1)
      }
    }
    if(isRecontractingFighter){
      const fighter = sourceManager.has.fighters.find(fighter => fighter.name == target.name)
      if(fighter){
        fighter.state.activeContract = {
          weeklyCost: contractOffer.weeklyCost,
          weeksRemaining: contractOffer.numberOfWeeks
        }
        fighter.state.goalContract = null
      }
    }

    sourceManager.functions.addToLog({
      weekNumber,
      message: `${target.name} has agreed to the contract offed.`, type: 'employee outcome'});

    return 
  },
  ...offerContract
}
