
import Fighter from "../fighter/fighter";
import { loanSharkSettings } from "../../game-settings/loan-shark-settings";
import { random } from "../../helper-functions/helper-functions";
import { RoundController } from "./round-controller";
import { Manager } from "../manager";
import { Professional, Employee, FighterInfo } from "../../interfaces/front-end-state-interface";


export const updateManagersForNewRound = (roundController: RoundController, professionals: Professional[], fighters: Fighter[], managers: Manager[]) => {
  
  managers.forEach((manager: Manager) => {
    manager.has.nextFightBet = null
    manager.state.readyForNextFight = false
    manager.has.actionPoints = 3
    returnEmployeesAndFightersWithExpiredContracts(manager)
    updateEmployeeAndFighterWeeksLeft(manager)
    payEmployeeAndFighterWages(manager)
    resetEmployeeActionPoints(manager.has.employees)
    updateNumberOfRoundsForKnowFighterStats(manager.has.knownFighters)
    addFightersToManagersKnownFightersList()
    updateLoanSharkData()
  })

  function returnEmployeesAndFightersWithExpiredContracts(manager: Manager){
    const expiredEmployees: Employee[] = manager.has.employees.filter(employee => employee.activeContract.weeksRemaining == 0)

    manager.has.employees = manager.has.employees.filter(employee => employee.activeContract.weeksRemaining != 0)

    expiredEmployees?.forEach(employee => {
      const {activeContract, actionPoints, ...rest} = employee
      professionals.push(rest)
    })

    
    const expiredFighters: Fighter[] = manager.has.fighters.filter(fighter => fighter.state.activeContract?.weeksRemaining == 0)

    manager.has.fighters = manager.has.fighters?.filter(fighter => fighter.state.activeContract?.weeksRemaining != 0)

    expiredFighters?.forEach(fighter => fighter.state.activeContract = undefined)

    expiredFighters?.forEach(expiredFighter => {
      expiredFighter.state.manager = undefined
      expiredFighter.state.goalContract = undefined
      manager.has.knownFighters.push(expiredFighter.getInfo())
    })
  }

  function payEmployeeAndFighterWages(manager: Manager){
    const employeeExpenses = manager.has.employees?.reduce(
      (count, employee) => count + employee.activeContract.weeklyCost
    , 0)
    const fighterExpenses = manager.has.fighters.reduce(
      (count, fighter) => count + fighter.state.activeContract.weeklyCost
    , 0)
    manager.has.money -= (employeeExpenses + fighterExpenses)
    if(roundController.roundNumber > 1)
    manager.functions.addToLog({message: `Spent ${employeeExpenses} on employee wages`, type: 'report'})
  }

  function resetEmployeeActionPoints(employees: Employee[]){
    employees.forEach(employee => employee.actionPoints = 1)
  }



  function updateEmployeeAndFighterWeeksLeft(manager: Manager){
    manager.has.fighters.forEach(fighter => {
      fighter.state.activeContract.weeksRemaining --
      if(fighter.state.activeContract.weeksRemaining == 0){
        fighter.determineGoalContract()
        manager.functions.addToLog({message: `Your fighter ${fighter.name}'s contract expires after this round. You must recontract him if you want him to stay`, type: 'critical'})
      }
    })
    manager.has.employees.forEach(employee => {
      employee.activeContract.weeksRemaining --
      if(employee.activeContract.weeksRemaining == 0)
        manager.functions.addToLog({message: `Your employee ${employee.name}'s contract expires after this round`, type: 'critical'})
    })
  }

  function updateNumberOfRoundsForKnowFighterStats(knownFighters: FighterInfo[]){
    knownFighters.forEach(knownFighter => {

      Object.keys(knownFighter).forEach(incrementStatRounds)

      function incrementStatRounds(key){
        let knownFighterProperty = knownFighter[key]
        knownFighterProperty?.lastKnownValue && knownFighterProperty.lastKnownValue ++
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
          manager.has.knownFighters.push({
            name: roundFighter.name,
            goalContract: roundFighter.goalContract,
            strength: undefined,
            fitness: undefined,
            intelligence: undefined,
            aggression: undefined,
            manager: undefined,
            numberOfFights: undefined,
            numberOfWins: undefined,
            activeContract: undefined
          })
        else{
          manager.has.knownFighters = manager.has.knownFighters.map(knownFighter => {
            const fighterJobSeeker =  roundController.jobSeekers.find(fighterJobSeeker => fighterJobSeeker.name == knownFighter.name)
            return {...knownFighter, goalContract: fighterJobSeeker ? fighterJobSeeker.goalContract : null}
          })
        }

        function managerDoesNotOwnRoundFighter(): boolean{
          return !manager.has.fighters.some(fighter => fighter.name == roundFighter.name)
        }
        function managerDoesNotKnowRoundFighter(): boolean{
          return !manager.has.knownFighters.some(knownFighter => knownFighter.name == roundFighter.name)
        }
      })
    })
  }

  function updateLoanSharkData(){
    managers.forEach(manager => {

      if(manager.has.loan?.debt){
        manager.has.loan.weeksOverdue ++
        addInterestToLoan()

        if(managerHasPaidBackTheMinimumAmountThisWeek())
          manager.has.loan = {...manager.has.loan, weeksOverdue: 0}

        else if(dayBeforeOverdue())
          sendWarning()

        else if(managerHasNotMadeRepaymentInSpecifiedNumberOfWeeks())
          loanSharkAssaultsOneOfManagersFighters()

        manager.has.loan.amountPaidBackThisWeek = 0

      }


      function sendWarning(){
        manager.functions.addToLog({type: 'critical', message: `you have not a repayment in ${manager.has.loan.weeksOverdue} weeks, the loan shark is becoming impatient`})
      }
      function dayBeforeOverdue(): boolean{
        return manager.has.loan.weeksOverdue == loanSharkSettings.weeksOfNoPaybackUntilRespond - 1
      }

      function managerHasPaidBackTheMinimumAmountThisWeek(): boolean{
        return manager.has.loan.amountPaidBackThisWeek >= loanSharkSettings.minimumAmountToPayBackEachWeek
      }

      function addInterestToLoan(){
        const addedAmount = Math.round(manager.has.loan.debt * loanSharkSettings.interestAddedPerWeek)
        manager.has.loan.debt += addedAmount
        manager.functions.addToLog({message: `You loan debt has incresed by ${addedAmount} because of ${loanSharkSettings.interestAddedPerWeek * 100}% interest, you now owe ${manager.has.loan.debt}`, type:'report'})

      }
      function managerHasNotMadeRepaymentInSpecifiedNumberOfWeeks(): boolean{
        return manager.has.loan.weeksOverdue >= loanSharkSettings.weeksOfNoPaybackUntilRespond
      }
      function loanSharkAssaultsOneOfManagersFighters(){
        if(manager.has.fighters.length == 0)
          return
        
        const randomFighter = manager.has.fighters[random(manager.has.fighters.length - 1)]

        let randomStat
        let failSafeTries = 0
        while(!randomStat || randomFighter.fighting.stats[randomStat] == 0){
          const stats = ['baseStrength', 'baseFitness', 'baseIntelligence', 'baseAgression']
          randomStat = stats[random(3)]
          failSafeTries ++
          if(failSafeTries == 10)
            return        
        }

        randomFighter.fighting.stats[randomStat] --

        manager.functions.addToLog({type: 'critical', message: `The loan shark is mad that you didnt pay him back, so he has abducted ${randomFighter.name} and tortured him, his ${randomStat} has been reduced by 1`})


      }

    })
    
  }
}