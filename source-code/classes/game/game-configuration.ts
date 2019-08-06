
export interface GameConfiguration{  
  numberOfFighters: number
  numberOfJobSeekers: number
  numberOfJobSeekersPerRound: number
  numberOfFightersPerFight: number
  listOfNames: string[]
  betSizePercentages: {
    small: number
    medium: number
    large: number

  }
  stageDurations: StageDurations
  manager: {
    actionPoints: number
    startingMoney: number
  }
}

export interface StageDurations{
  managerOptions: number
  maxFightDuration: number
  eachNewsSlide: number
  postFightReport: number
}



const gameConfiguration: GameConfiguration = {
  numberOfFighters: 8,
  numberOfJobSeekers: 9,
  numberOfJobSeekersPerRound: 2,
  numberOfFightersPerFight: 2,
  listOfNames: ['Daniel', 'Tomasz', 'Hassan', 'Dardan', 'Alex', 'Angelo', 'Paul', 'Suleman', 'Mark', 'Mat', 'Mike', 'Brad', 'Steve', 'James', 'Jake', 'Harry', 'Kevin', 'Stan', 'Dave', 'Chris', 'Sam', 'Bob', 'Fred'],
  betSizePercentages: {
    small: 15,
    medium: 40,
    large: 60
  },
  stageDurations: {
    managerOptions: 120,
    maxFightDuration: 120,
    eachNewsSlide: 3,
    postFightReport: 8
  },
  manager: {
    actionPoints: 3,
    startingMoney: 500
  }
}

export default gameConfiguration