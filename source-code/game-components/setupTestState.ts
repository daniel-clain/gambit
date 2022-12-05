
import gameConfiguration from "../game-settings/game-configuration"
import { Employee, FighterInfo, JobSeeker } from "../interfaces/front-end-state-interface"
import Fighter from "./fighter/fighter"
import { Game } from "./game"

export const testSetupBeginning = () => {
  //gameConfiguration.stageDurations.managerOptions = 10

}

export const setupTestState = (game: Game) => {

  //skipFight()
  //freezeOnFight()
  //longManagerOptions()
  //setup1()
  //testFighterStats()
  //managerHasLoan()




  //implementation



  function managerHasLoan(){
    
    const manager = game.has.managers[0]
    manager.has.loan = {debt: 500, amountPaidBackThisWeek: 0, weeksOverdue: 3, isNew: false}

  }

  

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
    const hitman2 = new Employee('Hitman')
    const thug = new Employee('Thug')
    manager1?.has.employees.push(agent2, agent3, dealer, hitman, thug, hitman2)
    manager2?.has.employees.push(lawyer, agent1)
    manager1.has.money = 1000
    if(manager2) manager2.has.money = 1000

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
  //testMainEvent()
  //testContractEnding()
  //quickSinisterVictory()
  lotsOfMoney()
  //testFighterJobSeeker()
  //managerHasFighters()

  //showPostGameStats()

  //finalTournamentTest()

  //addPrivateAgentAndLawyer()


  function addPrivateAgentAndLawyer(){

    game.has.managers[0].has.employees.push(new Employee('Private Agent', 3))
    game.has.managers[0].has.employees.push(new Employee('Lawyer', 3))
    game.has.managers[1].has.employees.push(new Employee('Thug', 3))
    game.has.managers[1].has.employees.push(new Employee('Drug Dealer', 3))
    

  }

  function testFighterJobSeeker(){
    console.log('ding');

    const testFighter = new Fighter('Test Fighter')
    game.has.fighters.push(testFighter)

    testFighter.state.goalContract = {weeklyCost: 1, numberOfWeeks: 1}

    const testJobSeeker = {
      name: testFighter.name,
      type: 'Fighter',
      goalContract: testFighter.state.goalContract
    } as JobSeeker

    game.has.weekController.jobSeekers.push(testJobSeeker)

    game.has.managers.forEach(manager =>
      manager.has.knownFighters.push(testFighter.getInfo())
    )
  }


  function finalTournamentTest(){
    lotsOfMoney()
    gameConfiguration.stageDurations.maxFightDuration = 1
    gameConfiguration.stageDurations.extraTimePerFighter = 0 
    game.has.weekController.weekNumber = 20
    const manager = game.has.managers[0]
    for(let i = 0; i < 8; i++){
      const fighter = game.has.fighters[i]      
      manager.has.fighters.push(fighter)
      fighter.state.manager = manager
    }

  }


  function managerHasFighters(){
    
    const manager1 = game.has.managers[0]

    const testFighters = game.has.fighters.slice(0, 3)
    
    testFighters[0].fighting.stats.baseStrength = 6
    testFighters[1].fighting.stats.baseFitness = 6

    manager1.has.fighters.push(...testFighters)
    game.has.weekController.activeFight.fighters.push(...testFighters)

    testFighters.forEach(f => {
      f.state.manager = manager1
      f.state.activeContract = {
        weeklyCost: 0,
        weeksRemaining: 10
      }
      f.state.sick = true
      f.state.publicityRating = 10
      f.state.fight = game.has.weekController.activeFight
    })


  }

  function lotsOfMoney(){
    const manager = game.has.managers[0]
    manager.has.money = 100000

  }

  function quickSinisterVictory(){
    
    const manager1 = game.has.managers[0]
    game.has.weekController.weekNumber = 20
    const hitman = new Employee('Hitman')
    const thug = new Employee('Thug')
    manager1?.has.employees.push(hitman, thug)
  }
  

  function testMainEvent(){
    game.has.weekController.weekNumber = 20

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


    game.has.fighters.push(fighter1, fighter2)

    game.has.weekController.jobSeekers.push({
      type: 'Fighter', 
      characterType: 'Job Seeker',
      name: fighter2.name, goalContract: fighter2.state.goalContract
    })

  }

  function showPostGameStats() {
    game.state.gameIsFinished = true
    game.state.playerHasVictory = {
      name: game.has.managers[0].has.name,
      victoryType: 'Sinister Victory'
    }
  }
  
}


