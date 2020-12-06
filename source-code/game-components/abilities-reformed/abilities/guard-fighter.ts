import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import { Employee } from "../../../interfaces/server-game-ui-state.interface"


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
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)

    const bodyGuard: Employee = game.managers.reduce((foundBodyGuard: Employee, manager) => foundBodyGuard || manager.employees.find(employee => employee.name == abilityData.source.name), undefined)

    fighter.state.guards.push(bodyGuard)
  },
  ...guardFighter
}

export const guardFighterClient: ClientAbility = {
  shortDescription: 'Chance to block malicious attemps on a fighter',
  longDescription: 'The more skilled the guard is the higher the chance to block an attempt. Can block attempts to assault, poison or murder a fighter',
  ...guardFighter
}

