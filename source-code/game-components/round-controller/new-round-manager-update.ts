import Game from "../game";
import Manager from "../manager";
import Fighter from "../fighter/fighter";
import { Employee, KnownFighter, KnownFighterStatValue, FighterInfo, Professional } from "../../interfaces/game-ui-state.interface";
import { loanSharkSettings } from "../../game-settings/loan-shark-settings";
import { random } from "../../helper-functions/helper-functions";
import { RoundController } from "./round-controller";


export const updateManagersForNewRound = (roundController: RoundController, professionals: Professional[], fighters: Fighter[], managers: Manager[]) => {
  
  managers.forEach((manager: Manager) => {
    manager.nextFightBet = null
    manager.readyForNextFight = false
    manager.actionPoints = 3
    returnEmployeesAndFightersWithExpiredContracts(manager)
    updateEmployeeAndFighterWeeksLeft(manager)
    payEmployeeAndFighterWages(manager)
    resetEmployeeActionPoints(manager.employees)
    updateNumberOfRoundsForKnowFighterStats(manager.knownFighters)
    addFightersToManagersKnownFightersList()
    updateLoanSharkData()
  })

  function returnEmployeesAndFightersWithExpiredContracts(manager: Manager){
    const expiredEmployees: Employee[] = manager.employees.filter(employee => employee.activeContract.weeksRemaining == 0)

    manager.employees = manager.employees.filter(employee => employee.activeContract.weeksRemaining != 0)

    expiredEmployees.forEach(employee => {
      const {activeContract, actionPoints, ...rest} = employee
      professionals.push(rest)
    })

    
    const expiredFighters: Fighter[] = manager.fighters.filter(fighter => fighter.state.activeContract.weeksRemaining == 0)

    manager.fighters = manager.fighters.filter(fighter => fighter.state.activeContract.weeksRemaining != 0)

    expiredFighters.forEach(fighter => fighter.state.activeContract = null)

    expiredFighters.forEach(fighter => {
      fighter.state.manager = undefined
      fighter.state.goalContract = null
      const {strength, fitness, intelligence, aggression, numberOfFights, numberOfWins} = fighter.getInfo()
      manager.knownFighters.push({
        name: fighter.name,
        goalContract: fighter.state.goalContract,
        knownStats: {
          strength: {lastKnownValue: strength, roundsSinceUpdated: 0},
          fitness: {lastKnownValue: fitness, roundsSinceUpdated: 0},
          intelligence: {lastKnownValue: intelligence, roundsSinceUpdated: 0},
          aggression: {lastKnownValue: aggression, roundsSinceUpdated: 0},
          manager: {lastKnownValue: undefined, roundsSinceUpdated: 0},
          numberOfFights: {lastKnownValue: numberOfFights, roundsSinceUpdated: 0},
          numberOfWins: {lastKnownValue: numberOfWins, roundsSinceUpdated: 0}
        }
      })
    })
  }

  function payEmployeeAndFighterWages(manager: Manager){
    const employeeExpenses = manager.employees.reduce(
      (count, employee) => count + employee.activeContract.weeklyCost
    , 0)
    const fighterExpenses = manager.fighters.reduce(
      (count, fighter) => count + fighter.state.activeContract.weeklyCost
    , 0)
    manager.money -= (employeeExpenses + fighterExpenses)
    manager.addToLog({message: `Spent ${employeeExpenses} on employee wage`})
  }

  function resetEmployeeActionPoints(employees: Employee[]){
    employees.forEach(employee => employee.actionPoints = 1)
  }



  function updateEmployeeAndFighterWeeksLeft(manager: Manager){
    manager.fighters.forEach(fighter => {
      fighter.state.activeContract.weeksRemaining --
      if(fighter.state.activeContract.weeksRemaining == 0){
        fighter.determineGoalContract()
        manager.addToLog({message: `Your fighter ${fighter.name}'s contract expires after this round. You must recontract him if you want him to stay`, type: 'critical'})
      }
    })
    manager.employees.forEach(employee => {
      employee.activeContract.weeksRemaining --
      if(employee.activeContract.weeksRemaining == 0)
        manager.addToLog({message: `Your employee ${employee.name}'s contract expires after this round`})
    })
  }

  function updateNumberOfRoundsForKnowFighterStats(knownFighters: KnownFighter[]){
    knownFighters.forEach(knownFighter => {
      for(let key in knownFighter.knownStats){
        let stat: KnownFighterStatValue = knownFighter.knownStats[key]
        if(stat)
          stat.roundsSinceUpdated ++
      }
    })
  }

  function addFightersToManagersKnownFightersList(){
    const roundFighersAndJobSeekerFighters: FighterInfo[] = []
    const roundFightersInfo: FighterInfo[] = 
    roundController.activeFight.fighters.map(fighter => fighter.getInfo())
    const jobSeekerFighterInfo: FighterInfo[] = roundController.jobSeekers
    .filter(jobSeeker => jobSeeker.type == 'Fighter')
    .map(jobSeekerFighter => fighters.find(fighter => fighter.name == jobSeekerFighter.name).getInfo())

    roundFighersAndJobSeekerFighters.push(...roundFightersInfo, ...jobSeekerFighterInfo)


    managers.forEach(manager => {
      roundFighersAndJobSeekerFighters.forEach(roundFighter => {
        if(
          managerDoesNotOwnRoundFighter() &&
          managerDoesNotKnowRoundFighter()
        )
          manager.knownFighters.push({
            name: roundFighter.name,
            goalContract: roundFighter.goalContract,
            knownStats: {
              strength: undefined,
              fitness: undefined,
              intelligence: undefined,
              aggression: undefined,
              manager: undefined,
              numberOfFights: undefined,
              numberOfWins: undefined
            }
          })
        else{
          manager.knownFighters = manager.knownFighters.map(knownFighter => {
            const fighterJobSeeker =  roundController.jobSeekers.find(fighterJobSeeker => fighterJobSeeker.name == knownFighter.name)
            return {...knownFighter, goalContract: fighterJobSeeker ? fighterJobSeeker.goalContract : null}
          })
        }

        function managerDoesNotOwnRoundFighter(): boolean{
          return !manager.fighters.some(fighter => fighter.name == roundFighter.name)
        }
        function managerDoesNotKnowRoundFighter(): boolean{
          return !manager.knownFighters.some(knownFighter => knownFighter.name == roundFighter.name)
        }
      })
    })
  }

  function updateLoanSharkData(){
    managers.forEach(manager => {

      if(manager.loan?.debt){
        manager.loan.weeksOverdue ++
        addInterestToLoan()

        if(managerHasPaidBackTheMinimumAmountThisWeek())
          manager.loan = {...manager.loan, weeksOverdue: 0}

        else if(dayBeforeOverdue())
          sendWarning()

        else if(managerHasNotMadeRepaymentInSpecifiedNumberOfWeeks())
          loanSharkAssaultsOneOfManagersFighters()

        manager.loan.amountPaidBackThisWeek = 0

      }


      function sendWarning(){
        manager.addToLog({type: 'critical', message: `you have not a repayment in ${manager.loan.weeksOverdue} weeks, the loan shark is becoming impatient`})
      }
      function dayBeforeOverdue(): boolean{
        return manager.loan.weeksOverdue == loanSharkSettings.weeksOfNoPaybackUntilRespond - 1
      }

      function managerHasPaidBackTheMinimumAmountThisWeek(): boolean{
        return manager.loan.amountPaidBackThisWeek >= loanSharkSettings.minimumAmountToPayBackEachWeek
      }

      function addInterestToLoan(){
        const addedAmount = Math.round(manager.loan.debt * loanSharkSettings.interestAddedPerWeek)
        manager.loan.debt += addedAmount
        manager.addToLog({message: `You loan debt has incresed by ${addedAmount} because of ${loanSharkSettings.interestAddedPerWeek * 100}% interest, you now owe ${manager.loan.debt}`})

      }
      function managerHasNotMadeRepaymentInSpecifiedNumberOfWeeks(): boolean{
        return manager.loan.weeksOverdue >= loanSharkSettings.weeksOfNoPaybackUntilRespond
      }
      function loanSharkAssaultsOneOfManagersFighters(){
        if(manager.fighters.length == 0)
          return
        
        const randomFighter = manager.fighters[random(manager.fighters.length - 1)]

        let randomStat
        let failSafeTries = 0
        while(!randomStat || randomFighter.fighting.stats[randomStat] == 0){
          const stats = ['strength', 'fitness', 'intelligence', 'agression']
          randomStat = stats[random(3)]
          failSafeTries ++
          if(failSafeTries == 10)
            return        
        }

        randomFighter.fighting.stats[randomStat] --

        manager.addToLog({type: 'critical', message: `The loan shark is mad that you didnt pay him back, so he has abducted ${randomFighter.name} and tortured him, his ${randomStat} has been reduced by 1`})


      }

    })
    
  }
}