
import gameConfiguration from "../game-settings/game-configuration"
import { Employee } from "../interfaces/front-end-state-interface"
import Fighter from "./fighter/fighter"
import { Game } from "./game"


export const setupTestState = (game: Game) => {

  skipFight()
  //freezeOnFight()
  //longManagerOptions()
  setup1()
  //testFighterStats()





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
  function longManagerOptions(){
    gameConfiguration.stageDurations.managerOptions = 6000
  }

  function setup1(){

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
    manager1.has.money = 100000
    if(manager2) manager2.has.money = 100000

  }

  
  function testFighterStats(){
    const manager1 = game.has.managers[0]
    const promoter = new Employee('Promoter',3)
    const trainer = new Employee('Trainer',3)
    const dealer = new Employee('Drug Dealer')
    manager1.has.employees.push(dealer, promoter, trainer)
  }
  

  

}

export const postStartTestState = (game: Game) => {
  //setup2()
  //testMainEvent()
  //testContractEnding()

  
  function setup2(){
    const manager1 = game.has.managers[0]
    const fighter: Fighter = game.has.fighters[0]
    fighter.state.manager = manager1
    manager1.has.fighters.push(fighter)
    game.has.roundController.activeFight.fighters.push(fighter)
  }

  function testMainEvent(){
    game.has.roundController.roundNumber = 20

  }
  
  function testContractEnding(){

    const manager1 = game.has.managers[0]
    const agent1: Employee = new Employee('Private Agent')
    agent1.activeContract = {
      weeklyCost: 0,
      weeksRemaining: 1
    }

    manager1.has.employees.push(agent1)

    const fighter1: Fighter = new Fighter('Test Fighter')
    fighter1.state.activeContract = {
      weeklyCost: 10,
      weeksRemaining: 1
    }
    const fighter2: Fighter = new Fighter('Test Fighter2')
    fighter1.state.goalContract = {
      weeklyCost: 10,
      numberOfWeeks: 1
    }
    fighter1.state.manager = manager1
    manager1.has.fighters.push(fighter1)


    game.has.fighters.push(fighter2)

    game.has.roundController.jobSeekers.push({
      type: 'Fighter', name: fighter2.name, goalContract: fighter2.state.goalContract
    })

  }

}
