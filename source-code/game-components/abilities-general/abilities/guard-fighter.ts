import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"


const guardFighter: Ability = {
  name: 'Guard Fighter',
  cost: { money: 5, actionPoints: 1 },
  possibleSources: ['Thug'],
  possibleTargets: ['fighter owned by manager', 'fighter not owned by manager'],
  executes: 'Instantly',
  canOnlyTargetSameTargetOnce: false
}

export const guardFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)

    const bodyGuard: Employee = game.has.managers.reduce((foundBodyGuard: Employee, manager) => foundBodyGuard || manager.has.employees.find(employee => employee.name == abilityData.source.name), undefined)

    fighter.state.guards.push(bodyGuard)
  },
  ...guardFighter
}

export const guardFighterClient: ClientAbility = {
  shortDescription: 'Chance to block malicious attemps on a fighter',
  longDescription: 'The more skilled the guard is the higher the chance to block an attempt. Can block attempts to assault, poison or murder a fighter',
  ...guardFighter
}

