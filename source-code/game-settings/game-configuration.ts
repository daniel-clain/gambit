
export interface GameConfiguration{  
  startingRoundNumber: number
  numberOfFighters: number
  numberOfProfessionals: number
  numberOfProfessionalJobSeekersPerRound: number
  numberOfFighterJobSeekersPerRound: number
  listOfNames: string[]
  betSizePercentages: {
    small: number
    medium: number
    large: number

  }
  loanSharkSettings: {    
    minimumAmountToPayBackEachWeek: number
    interestAddedPerWeek: number
    weeksOfNoPaybackUntilRespond: number
  }
  stageDurations: StageDurations
  manager: {
    actionPoints: number
    startingMoney: number
  }
  professionalTypeProbability: {    
    "Lawyer": number
    "Thug": number
    "Drug Dealer": number
    "Talent Scout": number
    "Private Agent": number
    "Hitman": number
    "Promoter": number
    "Trainer": number
  }
  fightersAfterRounds: {round: number, fighters:number}[]
  
}

export interface StageDurations{
  managerOptions: number
  maxFightDuration: number
  eachNewsSlide: number
  showWinningsDuration: number
}

const gameConfiguration: GameConfiguration = {
  startingRoundNumber: 1,
  numberOfFighters: 30,
  numberOfProfessionals: 40,
  numberOfProfessionalJobSeekersPerRound: 3,
  numberOfFighterJobSeekersPerRound: 2,
  listOfNames: ['Daniel', 'Tom', 'Alex', 'Angelo', 'Paul', 'Mark', 'Mat', 'Mike', 'Brad', 'Steve', 'James', 'Harry', 'Kevin', 'Stan', 'Dave', 'Chris', 'Sam', 'Bob', 'Fred', 'Frank', 'Jake', 'Alan', 'Ben', 'Chad', 'Denis', 'Eric', 'Greg', 'Lewis', 'Larry', 'Neil', 'Nathan', 'Norbit', 'Phil', 'Ryan', 'Simon', 'Seth', 'Troy', 'Tyler', 'Zach', 'George', 'Gavin', 'Robert', 'Tim', 'Tyson', 'Hugh', 'Ronald', 'Spencer', 'Jason', 'Arnold', 'Tod', 'Shawn', 'Liam', 'Will', 'Oliver', 'Ethan', 'John', 'Luke', 'Dylan', 'Anthony', 'Josh', 'Charles', 'Connor', 'Cameron', 'Adam', 'Ian', 'Evan', 'Henry', 'Owen', 'Isaac', 'Jackson', 'Leo', 'Jonathan', 'Declan', 'Vincent', 'Tristan', 'Dom', 'Patrick', 'Arie', 'John', 'Adrien', 'Bruce', 'Miles'],
  betSizePercentages: {
    small: 10,
    medium: 30,
    large: 50
  },
  loanSharkSettings: {
    minimumAmountToPayBackEachWeek: 50,
    interestAddedPerWeek: .05,
    weeksOfNoPaybackUntilRespond: 3
  },
  stageDurations: {
    managerOptions: 180,
    eachNewsSlide: 3,
    maxFightDuration: 120,
    showWinningsDuration: 10
  },
  manager: {
    actionPoints: 3,
    startingMoney: 500
  },
  professionalTypeProbability: {    
    "Lawyer": 0,
    "Thug": 4,
    "Drug Dealer": 2,
    "Talent Scout": 5,
    "Private Agent": 2,
    "Hitman": 1,
    "Promoter": 3,
    "Trainer": 4
  },
  fightersAfterRounds:[
    {round: 0, fighters:2},
    {round: 7, fighters:3},
    {round: 14, fighters:4}
  ]
}

export default gameConfiguration