
import gameConfiguration from "../../game-settings/game-configuration";
import { random } from "../../helper-functions/helper-functions";
import { Employee, FighterInfo, KnownFighterStat, Professional } from "../../interfaces/front-end-state-interface";
import Fighter from "../fighter/fighter";
import { Game } from "../game";
import { KnownManager, KnownManagerStat, Manager } from "../manager";

export function doEndOfWeekUpdates(game: Game) {

  const {weekController, fighters, professionals, managers} = game.has
  const {weekNumber} = weekController
  
  managers.forEach((manager) => {
    manager.has.nextFightBet = null
    manager.state.readyForNextFight = false
    manager.state.beingProsecuted = false
    manager.state.underSurveillance = null
    manager.has.actionPoints = manager.state.inJail ? 0 : 3
    returnEmployeesAndFightersWithExpiredContracts(manager)
    updateEmployeeAndFighterWeeksLeft(manager)
    payEmployeeAndFighterWages(manager)
    resetEmployeeActionPoints(manager.has.employees)
    fighterStatsWeeksKnown(manager.has.knownFighters)
    managerStatsWeeksKnown(manager.has.otherManagers)
    
    updateLoanSharkData(manager)
    if(manager.state.inJail){
      if(manager.state.inJail.weeksRemaining = 1)
        manager.state.inJail = null
      else manager.state.inJail.weeksRemaining --
    }

  })

  
  if(weekController.nextWeekIsEvent){
    weekController.nextWeekIsEvent = false
    weekController.thisWeekIsEvent = true
  } else if(weekController.thisWeekIsEvent = true){
    weekController.thisWeekIsEvent = false
  }
  
  returnProfessionalJobSeekersToProfessionalsPool()
  resetFighterAffects()
  reduceExtremeFighterStats()
  clearOldNews()

  function clearOldNews(){
    weekController.preFightNewsStage.newsItems = []
  }

  function returnProfessionalJobSeekersToProfessionalsPool(){
    professionals.push(...weekController.jobSeekers
    .filter(jobSeeker => jobSeeker.type == 'Professional')
    .map((jobSeeker): Professional => {
      const {name, profession, skillLevel, abilities} = jobSeeker
      return {name, profession, skillLevel, abilities}
    }))

    fighters.forEach(f => {
      const isAJobseeker = weekController.jobSeekers.some(j => j.name == f.name)
      if(isAJobseeker){
        delete f.state.goalContract
      }
    })
    
    weekController.jobSeekers = []
  }

  
  function resetFighterAffects() {
    fighters.forEach(fighter => {
      fighter.state.guards = []
      fighter.state.injured = false
      fighter.state.doping = false
      fighter.state.sick = false
      fighter.state.hallucinating = false
      fighter.state.underSurveillance = null
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
    const {employees} = manager.has

    employees.forEach(employee => 
      employee.activeContract.weeksRemaining == 0 && 
      game.functions.resignEmployee(employee, manager)
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
    manager.functions.addToLog({
      weekNumber,
      message: `Spent ${allExpenses} on employee wages`, type: 'report'})
  }

  function resetEmployeeActionPoints(employees: Employee[]){
    employees.forEach(employee => employee.actionPoints = 1)
  }



  function updateEmployeeAndFighterWeeksLeft(manager: Manager){
    const {fighters, employees} = manager.has
    employees.forEach(employee => {
      employee.activeContract.weeksRemaining --
      if(employee.activeContract.weeksRemaining == 0)
        manager.functions.addToLog({
          weekNumber,
          message: `Your employee ${employee.profession} ${employee.name}'s contract expires after this week`})
    })
    fighters.forEach(fighter => {
      fighter.state.activeContract.weeksRemaining --
      if(fighter.state.activeContract.weeksRemaining == 0){
        fighter.determineGoalContract()
        manager.functions.addToLog({
          weekNumber,
          message: `Your fighter ${fighter.name}'s contract expires after this week. You must recontract him if you want him to stay`, type: 'critical'})
      }
    })
  }

  function fighterStatsWeeksKnown(knownFighters: FighterInfo[]){
    knownFighters.forEach(knownFighter => {

      Object.keys(knownFighter).forEach(incrementStatWeeks)

      function incrementStatWeeks(key){
        let knownFighterProperty: KnownFighterStat = knownFighter[key]
        knownFighterProperty?.lastKnownValue && knownFighterProperty.weeksSinceUpdated ++
      }
    })
  }
  function managerStatsWeeksKnown(knownManagers: KnownManager[]){
    knownManagers.forEach(knownManager => {

      Object.keys(knownManager).forEach(incrementStatWeeks)

      function incrementStatWeeks(key){
        let stat: KnownManagerStat = knownManager[key]
        stat?.lastKnownValue && stat.weeksSinceUpdated ++
      }
    })
  }
  function updateLoanSharkData(manager: Manager){
    const {minimumAmountToPayBackEachWeek, interestAddedPerWeek, weeksOfNoPaybackUntilRespond} = gameConfiguration.loanSharkSettings
    
    if(manager.has.loan?.debt == 0){
      delete manager.has.loan
    }
    if(manager.has.loan?.debt){
      manager.has.loan.weeksOverdue ++
      addInterestToLoan()

      if(manager.has.loan.isNew ||managerHasPaidBackTheMinimumAmountThisWeek()){
        manager.has.loan = {...manager.has.loan, weeksOverdue: 0, isNew: false}
      }

      else if(dayBeforeOverdue())
        sendWarning()

      else if(managerHasNotMadeRepaymentInSpecifiedNumberOfWeeks())
        loanSharkAssaultsOneOfManagersFighters()

      manager.has.loan.amountPaidBackThisWeek = 0

    }



    function sendWarning(){
      manager.functions.addToLog({
        weekNumber,
        type: 'critical', message: `You have not made a repayment in ${manager.has.loan.weeksOverdue} weeks, the loan shark is becoming impatient`})
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
      manager.functions.addToLog({
        weekNumber,
        message: `You loan debt has increased by ${addedAmount} because of ${interestAddedPerWeek * 100}% interest, you now owe ${manager.has.loan.debt}`, type:'report'})

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
      const decrement = 2
      while(!randomStat || randomFighter.fighting.stats[randomStat] < decrement){
        const stats = ['baseStrength', 'baseFitness', 'baseIntelligence']
        randomStat = stats[random(3)]
        failSafeTries ++
        if(failSafeTries == 10)
          return        
      }

      randomFighter.state.injured = true

      randomFighter.fighting.stats[randomStat] -= decrement

      manager.functions.addToLog({
        weekNumber,
        type: 'critical', message: `The loan shark is mad that you didn't pay him back, so he has abducted ${randomFighter.name} and tortured him, his ${randomStat.replace('base', '')} has been reduced by ${decrement}`})


    }
    
  }
}

