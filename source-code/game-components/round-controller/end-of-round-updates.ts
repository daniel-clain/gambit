
import gameConfiguration from "../../game-settings/game-configuration";
import { random } from "../../helper-functions/helper-functions";
import { Employee, FighterInfo, KnownFighterStat, Professional } from "../../interfaces/front-end-state-interface";
import Fighter from "../fighter/fighter";
import { Game } from "../game";
import { KnownManager, KnownManagerStat, Manager } from "../manager";

export function doEndOfRoundUpdates(game: Game) {

  const roundController = game.has.roundController
  const fighters = game.has.fighters
  const professionals = game.has.professionals
  const managers = game.has.managers

  
  managers.forEach((manager) => {
    manager.has.nextFightBet = null
    manager.state.readyForNextFight = false
    manager.has.actionPoints = manager.state.inJail ? 0 : 3
    returnEmployeesAndFightersWithExpiredContracts(manager)
    updateEmployeeAndFighterWeeksLeft(manager)
    payEmployeeAndFighterWages(manager)
    resetEmployeeActionPoints(manager.has.employees)
    updateNumberOfRoundsForKnowFighterStats(manager.has.knownFighters)
    updateNumberOfRoundsForKnowManagerStats(manager.has.otherManagers)
    
    updateLoanSharkData(manager)
    if(manager.state.inJail){
      if(manager.state.inJail.weeksRemaining = 1)
        manager.state.inJail = null
      else manager.state.inJail.weeksRemaining --
    }

  })

  
  if(roundController.nextWeekIsEvent){
    roundController.nextWeekIsEvent = false
    roundController.thisWeekIsEvent = true
  } else if(roundController.thisWeekIsEvent = true){
    roundController.thisWeekIsEvent = false
  }
  
  returnProfessionalJobSeekersToProfessionalsPool()
  resetFighterAffects()
  reduceExtremeFighterStats()
  clearOldNews()

  function clearOldNews(){
    roundController.preFightNewsStage.newsItems = []
  }

  function returnProfessionalJobSeekersToProfessionalsPool(){
    professionals.push(...roundController.jobSeekers
    .filter(jobSeeker => jobSeeker.type == 'Professional')
    .map((jobSeeker): Professional => {
      const {name, profession, skillLevel, abilities} = jobSeeker
      return {name, profession, skillLevel, abilities}
    }))

    fighters.forEach(fighter => delete fighter.state.goalContract)
    
    roundController.jobSeekers = []
  }

  
  function resetFighterAffects() {
    fighters.forEach(fighter => {
      fighter.state.guards = []
      fighter.state.injured = false
      fighter.state.doping = false
      fighter.state.sick = false
      fighter.state.hallucinating = false
    })
  }

  function reduceExtremeFighterStats(){
    
    fighters.forEach(fighter => {
      let {stats} = fighter.fighting

      if(stats.fitness > 8  && random(3, true) == 3)
        stats.baseFitness = reduceStat(stats.baseFitness)
        
      if(stats.strength > 8  && random(3, true) == 3)
        stats.baseStrength = reduceStat(stats.baseStrength)
        
      if(stats.baseAggression > 8  && random(3, true) == 3)
        stats.baseAggression = reduceStat(stats.baseAggression)
        

    })

    function reduceStat(stat: number){
      if(stat > 8 && stat <= 10)
        return Math.round(stat - ((stat - 8) * .2))
      if(stat > 10)
        return Math.round(stat - ((stat - 10) * .5))
      
      return stat
    }
  }
  function returnEmployeesAndFightersWithExpiredContracts(manager: Manager){
    const expiredEmployees: Employee[] = manager.has.employees.filter(employee => employee.activeContract.weeksRemaining == 0)

    const {employees} = manager.has

    employees.forEach(employee => 
      employee.activeContract.weeksRemaining == 0 && 
      game.functions.resignEmployee(employee)
    )


    
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
    const allExpenses = employeeExpenses + fighterExpenses
    manager.has.money -= allExpenses
    if(allExpenses)
    manager.functions.addToLog({message: `Spent ${allExpenses} on employee wages`, type: 'report'})
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
        let knownFighterProperty: KnownFighterStat = knownFighter[key]
        knownFighterProperty?.lastKnownValue && knownFighterProperty.roundsSinceUpdated ++
      }
    })
  }
  function updateNumberOfRoundsForKnowManagerStats(knownManagers: KnownManager[]){
    knownManagers.forEach(knownManager => {

      Object.keys(knownManager).forEach(incrementStatRounds)

      function incrementStatRounds(key){
        let stat: KnownManagerStat = knownManager[key]
        stat?.lastKnownValue && stat.roundsSinceUpdated ++
      }
    })
  }
  function updateLoanSharkData(manager: Manager){
    const {minimumAmountToPayBackEachWeek, interestAddedPerWeek, weeksOfNoPaybackUntilRespond} = gameConfiguration.loanSharkSettings
    

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
      return manager.has.loan.weeksOverdue == weeksOfNoPaybackUntilRespond - 1
    }

    function managerHasPaidBackTheMinimumAmountThisWeek(): boolean{
      return manager.has.loan.amountPaidBackThisWeek >= minimumAmountToPayBackEachWeek
    }

    function addInterestToLoan(){
      const addedAmount = Math.round(manager.has.loan.debt * interestAddedPerWeek)
      manager.has.loan.debt += addedAmount
      manager.functions.addToLog({message: `You loan debt has incresed by ${addedAmount} because of ${interestAddedPerWeek * 100}% interest, you now owe ${manager.has.loan.debt}`, type:'report'})

    }
    function managerHasNotMadeRepaymentInSpecifiedNumberOfWeeks(): boolean{
      return manager.has.loan.weeksOverdue >= weeksOfNoPaybackUntilRespond
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
    
  }
}

