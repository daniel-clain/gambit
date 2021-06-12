
import gameConfiguration from "../game-settings/game-configuration"
import { Employee } from "../interfaces/front-end-state-interface"
import Fighter from "./fighter/fighter"
import { Game } from "./game"


export const setupTestState = (game: Game) => {

  gameConfiguration.stageDurations.managerOptions = 6000
  //skipFight()
  //freezeOnFight()
  setup1()

  //implementation

  function skipFight(){
    gameConfiguration.stageDurations.extraTimePerFighter = 0 
    gameConfiguration.stageDurations.maxFightDuration = 1
    gameConfiguration.stageDurations.eachNewsSlide = 1
    gameConfiguration.stageDurations.startCountdown = 1

  }
  function freezeOnFight(){
    gameConfiguration.stageDurations.maxFightDuration = 9999
    gameConfiguration.freezeFight = true

  }

  function setup1(){
    gameConfiguration.stageDurations.managerOptions = 6000

    const manager1 = game.has.managers[0]
    const manager2 = game.has.managers[1]
    const agent1: Employee = new Employee('Private Agent')
    const agent2 = new Employee('Private Agent')
    const agent3 = new Employee('Private Agent')
    const dealer = new Employee('Drug Dealer')
    const lawyer = new Employee('Lawyer')
    const hitman = new Employee('Hitman')
    const thug = new Employee('Thug')
    manager1.has.employees.push(lawyer, agent1)
    manager2?.has.employees.push(agent2, agent3, dealer, hitman, thug)
    manager1.has.money = 10000
    if(manager2) manager2.has.money = 10000

  }

  

}

export const postStartTestState = (game: Game) => {
  //setup2()

  
  function setup2(){
    const manager1 = game.has.managers[0]
    const fighter: Fighter = game.has.fighters[0]
    fighter.state.manager = manager1
    manager1.has.fighters.push(fighter)

    game.has.roundController.activeFight.fighters.push(fighter)
  }

}
