
export interface GameConfiguration{  
  numberOfFighters: number
  numberOfProfessionals: number
  numberOfProfessionalJobSeekersPerRound: number
  numberOfFighterJobSeekersPerRound: number
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
}

export interface StageDurations{
  managerOptions: number
  maxFightDuration: number
  eachNewsSlide: number
  postFightReport: number
}

const gameConfiguration: GameConfiguration = {
  numberOfFighters: 30,
  numberOfProfessionals: 40,
  numberOfProfessionalJobSeekersPerRound: 3,
  numberOfFighterJobSeekersPerRound: 2,
  numberOfFightersPerFight: 3,
  listOfNames: ['Daniel', 'Tom', 'Alex', 'Angelo', 'Paul', 'Mark', 'Mat', 'Mike', 'Brad', 'Steve', 'James', 'Harry', 'Kevin', 'Stan', 'Dave', 'Chris', 'Sam', 'Bob', 'Fred', 'Frank', 'Jake', 'Alan', 'Ben', 'Chad', 'Denis', 'Eric', 'Greg', 'Lewis', 'Larry', 'Neil', 'Nathan', 'Norbit', 'Phil', 'Ryan', 'Simon', 'Seth', 'Troy', 'Tyler', 'Zach', 'George', 'Gavin', 'Robert', 'Tim', 'Tyson', 'Hugh', 'Ronald', 'Spencer', 'Jason', 'Arnold', 'Tod', 'Shawn', 'Liam', 'Will', 'Oliver', 'Ethan', 'John', 'Luke', 'Dylan', 'Anthony', 'Josh', 'Charles', 'Connor', 'Cameron', 'Adam', 'Ian', 'Evan', 'Henry', 'Owen', 'Isaac', 'Jackson', 'Leo', 'Jonathan', 'Declan', 'Vincent', 'Tristan'],
  betSizePercentages: {
    small: 10,
    medium: 30,
    large: 50
  },
  stageDurations: {
    managerOptions: 120,
    maxFightDuration: 120999,
    eachNewsSlide: 1,
    postFightReport: 1
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
  }
}

export default gameConfiguration