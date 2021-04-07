
import gameConfiguration from "../game-settings/game-configuration"
import { Employee } from "../interfaces/front-end-state-interface"
import { Game } from "./game"

gameConfiguration.stageDurations.managerOptions = 999999

export const setupTestState = (game: Game) => {
  const manager1 = game.has.managers[0]
  /* 

  gameConfiguration.stageDurations.maxFightDuration = 1

  game.has.managers[0].has.money = -50 */

  //gameConfiguration.stageDurations.showWinningsDuration = 999999
  /* 

  const agent1: Employee = new Employee('Private Agent')
  const agent2 = new Employee('Private Agent')
  const agent3 = new Employee('Private Agent')
  const dealer = new Employee('Drug Dealer')
  const hitman = new Employee('Hitman')


  game.has.managers[0].has.employees.push(agent1, agent2, agent3, dealer, hitman)*/
/* 
  for(; manager1.has.activityLogs.length < 100; manager1.functions.addToLog({message: 'some bullshit'})){} */

}