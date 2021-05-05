
import gameConfiguration from "../game-settings/game-configuration"
import { Employee } from "../interfaces/front-end-state-interface"
import { Game } from "./game"

gameConfiguration.stageDurations.managerOptions = 500

export const setupTestState = (game: Game) => {
  gameConfiguration.fightersAfterRounds = [{round: 0, fighters: 3}]
  const manager1 = game.has.managers[0]
  const agent1: Employee = new Employee('Private Agent')
  const agent2 = new Employee('Private Agent')
  const agent3 = new Employee('Private Agent')
  const dealer = new Employee('Drug Dealer')
  const hitman = new Employee('Hitman')
  const thug = new Employee('Thug')
  manager1.has.employees.push(agent1, agent2, agent3, dealer, hitman, thug)
  gameConfiguration.stageDurations.eachNewsSlide = 10
  manager1.has.money = 10000
  gameConfiguration.startingRoundNumber = 15
  /* 

  gameConfiguration.stageDurations.maxFightDuration = 1

  game.has.managers[0].has.money = -50 */

  //gameConfiguration.stageDurations.showWinningsDuration = 999999
  /* 



/* 
  for(; manager1.has.activityLogs.length < 100; manager1.functions.addToLog({message: 'some bullshit'})){} */

}