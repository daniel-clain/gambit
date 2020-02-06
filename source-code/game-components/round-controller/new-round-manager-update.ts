import Game from "../game";
import Manager from "../manager/manager";
import Fighter from "../fighter/fighter";
import { Employee, KnownFighter, KnownFighterStatValue, FighterInfo } from "../../interfaces/game-ui-state.interface";


export const updateManagersForNewRound = (game: Game) => {
  
  game.managers.forEach((manager: Manager) => {
    manager.nextFightBet = null
    manager.readyForNextFight = false
    manager.actionPoints = 3
    returnEmployeesAndFightersWithExpiredContracts(manager, game)
    updateEmployeeAndFighterWeeksLeft(manager)
    payEmployeeAndFighterWages(manager)
    resetEmployeeActionPoints(manager.employees)
    updateNumberOfRoundsForKnowFighterStats(manager.knownFighters)
    addFightersToManagersKnownFightersList(game)
  })
}

function returnEmployeesAndFightersWithExpiredContracts(manager: Manager, game: Game){
  const expiredEmployees: Employee[] = manager.employees.filter(employee => employee.activeContract.weeksRemaining == 0)

  manager.employees = manager.employees.filter(employee => employee.activeContract.weeksRemaining != 0)

  expiredEmployees.forEach(employee => {
    const {activeContract, actionPoints, ...rest} = employee
    game.professionals.push(rest)
  })

  
  const expiredFighters: Fighter[] = manager.fighters.filter(fighter => fighter.state.activeContract.weeksRemaining == 0)

  manager.fighters = manager.fighters.filter(fighter => fighter.state.activeContract.weeksRemaining != 0)

  expiredFighters.forEach(fighter => fighter.state.activeContract = null)

  expiredFighters.forEach(fighter => {
    fighter.state.manager = undefined
    const {strength, fitness, intelligence, aggression, numberOfFights, numberOfWins} = fighter.getInfo()
    manager.knownFighters.push({
      name: fighter.name,
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
    (count, employee) => count + employee.activeContract.costPerWeek
  , 0)
  const fighterExpenses = manager.fighters.reduce(
    (count, fighter) => count + fighter.state.activeContract.costPerWeek
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
    if(fighter.state.activeContract.weeksRemaining == 0)
      manager.addToLog({message: `Your fighter ${fighter.name}'s contract expires after this round. You must recontract him if you want him to stay`, type: 'critical'})
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

function addFightersToManagersKnownFightersList(game: Game){
  const roundFighersAndJobSeekerFighters: FighterInfo[] = []
  const roundFightersInfo: FighterInfo[] = 
  game.roundController.activeFight.fighters.map(fighter => fighter.getInfo())
  const jobSeekerFighterInfo: FighterInfo[] = game.roundController.jobSeekers
  .filter(jobSeeker => jobSeeker.type == 'Fighter')
  .map(jobSeekerFighter => game.fighters.find(fighter => fighter.name == jobSeekerFighter.name).getInfo())

  roundFighersAndJobSeekerFighters.push(...roundFightersInfo, ...jobSeekerFighterInfo)


  game.managers.forEach(manager => {
    roundFighersAndJobSeekerFighters.forEach(roundFighter => {
      if(
        !manager.fighters.some(fighter => fighter.name == roundFighter.name) &&
        !manager.knownFighters.some(knownFighter => knownFighter.name == roundFighter.name)
      )
        manager.knownFighters.push({
          name: roundFighter.name,
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
    })
  })
}