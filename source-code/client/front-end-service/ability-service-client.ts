
import { ClientAbility, AbilityData, AbilitySourceInfo, AbilityTargetInfo } from "../../game-components/abilities-general/ability"
import { researchFighterClient } from "../../game-components/abilities-general/abilities/research-fighter"
import { assaultFighterClient } from "../../game-components/abilities-general/abilities/assault-fighter"
import { doSurveillanceClient } from "../../game-components/abilities-general/abilities/do-surveillance"
import { guardFighterClient } from "../../game-components/abilities-general/abilities/guard-fighter"
import { murderFighterClient } from "../../game-components/abilities-general/abilities/murder-fighter"
import { offerContractClient } from "../../game-components/abilities-general/abilities/offer-contract"
import { poisonFighterClient } from "../../game-components/abilities-general/abilities/poison-fighter"
import { promoteFighterClient } from "../../game-components/abilities-general/abilities/promote-fighter"
import { sellDrugsClient } from "../../game-components/abilities-general/abilities/sell-drugs"
import { prosecuteManagerClient } from "../../game-components/abilities-general/abilities/prosecute-manager"
import { trainFighterClient } from "../../game-components/abilities-general/abilities/train-fighter"
import { dopeFighterClient } from "../../game-components/abilities-general/abilities/dope-fighter"
import { ManagerInfo } from "../../game-components/manager"
import { Employee, JobSeeker } from "../../interfaces/front-end-state-interface"
import { investigateManagerClient } from "../../game-components/abilities-general/abilities/investigate-manager"
import { dominationVictoryClient } from "../../game-components/abilities-general/abilities/domination-victory"
import { sinisterVictoryClient } from "../../game-components/abilities-general/abilities/sinister-victory"
import { wealthVictoryClient } from "../../game-components/abilities-general/abilities/wealth-victory"

export const abilityService = (() => ({
  abilities: <ClientAbility[]>[
    assaultFighterClient,
    doSurveillanceClient,
    guardFighterClient,
    murderFighterClient,
    offerContractClient,
    poisonFighterClient,
    promoteFighterClient,
    researchFighterClient,
    sellDrugsClient,
    prosecuteManagerClient,
    trainFighterClient,
    dopeFighterClient,
    investigateManagerClient,
    dominationVictoryClient, 
    sinisterVictoryClient, 
    wealthVictoryClient
  ],

  getTryToWinAbilities(){
    return [dominationVictoryClient, sinisterVictoryClient, wealthVictoryClient]
  },


  getPossibleSources(ability: ClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo[]{

    const possibleSources: AbilitySourceInfo[] = []


    possibleSources.push(
      ...managerInfo.employees
        .filter(employee =>
          employee.abilities.includes(ability.name) &&
          employee.actionPoints >= ability.cost.actionPoints
        )
        .map(({ name, profession }: Employee): AbilitySourceInfo => ({
          name,
          type: profession
        }))
    )

    if (
      managerInfo.abilities.includes(ability.name) &&
      managerInfo.actionPoints >= ability.cost.actionPoints
    )
      possibleSources.push({
        type: 'Manager',
        name: managerInfo.name
      })

    return possibleSources
  },

  getAppropriateSource(clientAbility: ClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo {
    const employeeThatCanDoAbility = managerInfo.employees.find(employee => employee.abilities.includes(clientAbility.name) && employee.actionPoints >= clientAbility.cost.actionPoints)
    let managerSource
    let employeeSource

    if (
      managerInfo.abilities.includes(clientAbility.name) &&
      managerInfo.actionPoints >= clientAbility.cost.actionPoints
    )
      managerSource = {
        type: 'Manager',
        name: managerInfo.name
      }
    if (employeeThatCanDoAbility)
      employeeSource = {
        type: employeeThatCanDoAbility.profession,
        name: employeeThatCanDoAbility.name
      }

    if(clientAbility.name == 'Offer Contract' && managerSource)
      return managerSource
    else if(employeeSource)
      return employeeSource
    else if(managerSource)
      return managerSource
    
  },
  
  isPossibleToPerformAbility(abilityData: AbilityData, managerInfo: ManagerInfo, delayedExecutionAbilities: AbilityData[], currentRound: number, enoughFightersForFinalTournament: boolean): boolean {


    const clientAbility: ClientAbility = this.abilities.find(ability => ability.name == abilityData.name)

    if(clientAbility.canOnlyBeUsedOnce && delayedExecutionAbilities.some(a => a.name == clientAbility.name))
      return false


    if (!this.canAffordAbility(clientAbility, managerInfo.money))
      return false

    const possibleSources: AbilitySourceInfo[] = this.getPossibleSources(clientAbility, managerInfo)

    if(clientAbility?.notActiveUntilRound > currentRound){
      return false
    }

    if(clientAbility.name == 'Domination Victory' && !enoughFightersForFinalTournament){
      return false
    }

    if (possibleSources.length == 0)
      return false

    const hasDrugDealer = managerInfo.employees.some(employee => employee.profession == 'Drug Dealer')
    if(
      (clientAbility.name == 'Dope Fighter' || 
      clientAbility.name == 'Poison Fighter') 
      && !hasDrugDealer
    )
      return false

    if (
      clientAbility.validTargetIf.includes('fighter owned by manager') &&
      !clientAbility.validTargetIf.includes('fighter not owned by manager')

    )
      if (managerInfo.fighters.length == 0)
        return false

    if (this.canOnlyBeTargetedOnceConflict(clientAbility, abilityData, delayedExecutionAbilities, managerInfo))
      return false

    return true
  },

  canOnlyBeTargetedOnceConflict(ability: ClientAbility, abilityData: AbilityData, delayedExecutionAbilities: AbilityData[], managerInfo: ManagerInfo): boolean{
    if(
      ability.canOnlyTargetSameTargetOnce && 
      abilityData.target && 
      delayedExecutionAbilities.some(delayedAbility => {
        if(
          (
            delayedAbility.source.name == managerInfo.name || 
            managerInfo.employees.some(employee => employee.name == delayedAbility.source.name)
          ) &&
          delayedAbility.name == ability.name && 
          delayedAbility.target.name == abilityData.target.name
        )
          return true
      })
    )
      return true
  },

  canAffordAbility(ability: ClientAbility, managerMoney: number): boolean {

    return ability.cost.money <= managerMoney
  },

  validateAbilityConfirm(clientAbility: ClientAbility, managerInfo: ManagerInfo, abilityData: AbilityData, delayedExecutionAbilities: AbilityData[], currentRound: number, enoughFightersForFinalTournament: boolean) {

    if (!abilityData.source)
      throw (`${clientAbility.name} requires a source`)

    
    if(clientAbility.canOnlyBeUsedOnce && delayedExecutionAbilities.some(a => a.name == clientAbility.name))
      throw ('Ability can only be used once')

    if(clientAbility.name == 'Domination Victory' && !enoughFightersForFinalTournament){
      throw (`Not enough manager owned fighters for final tournament (minimum 8)`)
    }


    if (clientAbility?.notActiveUntilRound > currentRound)
      throw (`${clientAbility.name} is not available until round 20`)

    if (clientAbility.validTargetIf.length != 0 && !abilityData.target)
      throw (`${clientAbility.name} requires a target`)
    if (managerInfo.money < clientAbility.cost.money)
      throw (`manager does not have enough money to pay for ${clientAbility.name}`)

    
    let sourceActionPoints: number
    if (abilityData.source.type == 'Manager')
      sourceActionPoints = managerInfo.actionPoints
    else
      sourceActionPoints = managerInfo.employees.find(employee => employee.name == abilityData.source.name).actionPoints

    if (sourceActionPoints < clientAbility.cost.actionPoints)
      throw (`${abilityData.source.type} ${abilityData.source.name} does not have enough action points for ${clientAbility.name}`)

    
    if (prosecuteManagerHasNoEvidence())
      throw (`${clientAbility.name} requires a evidence`)


    if((clientAbility.name == 'Dope Fighter' || clientAbility.name == 'Poison Fighter') && !managerInfo.employees.some(employee => employee.profession == 'Drug Dealer'))
      throw(`${clientAbility.name} can only be used unless if you have a Drug Dealer employed`)

    if (this.canOnlyBeTargetedOnceConflict(clientAbility, abilityData, delayedExecutionAbilities, managerInfo))
      throw (`${abilityData.target.name} has already been targeted for ${clientAbility.name} and can not be the target of this ability again`)

    function prosecuteManagerHasNoEvidence(){
      if(abilityData.name != 'Prosecute Manager') return false
      if(
        !abilityData.additionalData || 
        !(abilityData.additionalData.length > 0)
      ) return true
      return false
    }

  },
  getAbilitiesFighterCanBeTheTargetOf(fighterOwnedByManager: boolean, fighterInNextFight: boolean): ClientAbility[] {
    return this.abilities.filter((ability: ClientAbility) => {
      if(ability.disabled) return false
      if(
        ability.notValidTargetIf?.includes('fighter')  
      ) return false
      if(
        fighterOwnedByManager &&
        ability.notValidTargetIf?.includes('fighter owned by manager')  
      ) return false

      if(!ability.validTargetIf.length) return true
      if(
        fighterInNextFight &&
        ability.validTargetIf.includes('fighter in next fight')
      ) return true
      if(
        fighterOwnedByManager &&
        ability.validTargetIf.includes('fighter owned by manager')
      ) return true
      if(
        !fighterOwnedByManager &&
        ability.validTargetIf.includes('fighter not owned by manager')
      ) return true
    })
  },


  getPossibleTargets(clientAbility: ClientAbility, managerInfo: ManagerInfo, jobSeekers: JobSeeker[], nextFightFighters:string[]): AbilityTargetInfo[] {
    const targetList: AbilityTargetInfo[] = []

    if (clientAbility.validTargetIf.includes('fighter owned by manager')){
      targetList.push(...managerInfo.fighters.map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'fighter owned by manager' })))
    }
    if (clientAbility.validTargetIf.includes('fighter in next fight')){
      targetList.push(...managerInfo.knownFighters.filter(f => nextFightFighters.includes(f.name)).map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'fighter in next fight' })))
    }

    if (clientAbility.validTargetIf.includes('fighter not owned by manager')){
      targetList.push(...managerInfo.knownFighters.map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'fighter not owned by manager' })))
    }
    
    if (clientAbility.validTargetIf.includes('opponent manager')){
      targetList.push(...managerInfo.otherManagers.map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'opponent manager' })))
    }

    if (clientAbility.validTargetIf.includes('job seeker')){
      targetList.push(...jobSeekers.map((jobSeeker): AbilityTargetInfo => ({ name: jobSeeker.name, type: 'job seeker' })))
    }

    return targetList
  }

}))()