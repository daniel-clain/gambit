import { VideoName } from "../client/videos/videos"

const gameConfiguration = {
  freezeFight: false,
  startingWeekNumber: 1,
  baseFightersCount: 30,
  baseProfessionalsCount: 40,
  countPlayerFactor: .2,
  numberOfProfessionalJobSeekersPerWeek: 3,
  numberOfFighterJobSeekersPerWeek: 2,
  tryToWinAvailableFromWeek: 20,
  listOfNames: [
    'Daniel', 'Tom', 'Alex', 'Angelo', 'Paul', 'Mark', 'Mat', 'Mike', 'Brad', 'Steve', 'James', 'Harry', 'Kevin', 'Stan', 'Dave', 'Chris', 'Sam', 'Bob', 'Fred', 'Frank', 'Jake', 'Alan', 'Ben', 'Chad', 'Denis', 'Eric', 'Greg', 'Lewis', 'Larry', 'Neil', 'Nathan', 'Norbit', 'Phil', 'Ryan', 'Simon', 'Seth', 'Troy', 'Tyler', 'Zach', 'Gavin', 'Robert', 'Tim', 'Tyson', 'Hugh', 'Ronald', 'Spencer', 'Jason', 'Arnold', 'Tod', 'Shawn', 'Liam', 'Will', 'Oliver', 'Ethan', 'John', 'Luke', 'Dylan', 'Anthony', 'Josh', 'Charles', 'Connor', 'Cameron', 'Adam', 'Ian', 'Evan', 'Henry', 'Owen', 'Isaac', 'Jackson', 'Leo', 'Jonathan', 'Declan', 'Vincent', 'Tristan', 'Dom', 'Patrick', 'Arie', 'Adrien', 'Bruce', 'Miles', 'Garrick', 'Barry', 'Jerry', 'George', 'Julian', 'Andy', 'Peter', 'Drew', 'Craig', 'Angus', 'Boris', 'Jake', 'Raymond', 'Martin', 'Harold', 'Justin', 'Jeff', 'Matthew'
  ],
  betSizePercentages: {
    small: 10,
    medium: 30,
    large: 50
  },
  fightWinnings: {
    betWinningsBase: 150,
    betAmountMultiplier: 2,
    playersFighterWinBase: 100,
    playersFighterMultiplier: .2,
    totalPublicityMultiplier: 10
  },
  loanSharkSettings: {
    minimumAmountToPayBackEachWeek: 50,
    interestAddedPerWeek: .1,
    weeksOfNoPaybackUntilRespond: 2
  },
  stageDurations: {
    managerOptions: 180,
    eachNewsSlide: 3,
    maxFightDuration: 120,
    extraTimePerFighter: 10,
    showWinningsDuration: 8,
    startCountdown: 3
  },
  manager: {
    actionPoints: 3,
    startingMoney: 750
  },
  professionalTypeProbability: {    
    "Lawyer": {
      minimum: 2,
      maximum: 5,
      probability: 1
    },
    "Thug": {
      minimum: 5,
      maximum: 9,
      probability: 4
    },
    "Drug Dealer": {
      minimum: 4,
      maximum: 7,
      probability: 2
    },
    "Talent Scout": {
      minimum: 6,
      maximum: 9,
      probability: 5
    },
    "Private Agent": {
      minimum: 2,
      maximum: 7,
      probability: 2
    },
    "Hitman": {
      minimum: 2,
      maximum: 5,
      probability: 1
    },
    "Promoter": {
      minimum: 3,
      maximum: 6,
      probability: 3
    },
    "Trainer": {
      minimum: 4,
      maximum: 7,
      probability: 4
    },
  },
  fightersAfterWeeks:[
    {week: 0, fighters:2},
    {week: 6, fighters:3},
    {week: 14, fighters:4}
  ],
  videos: <{name: VideoName, videos: {duration: number}[]}[]>[
    {
      name: 'Final Tournament',
      videos:[{
        duration: 21
      }]
    },
    {
      name: 'Sinister Victory',
      videos:[{
        duration: 78
      }]
    },
    {
      name: 'Wealth Victory',
      videos:[{
        duration: 50
      }]
    },
    {
      name: 'Wealth Victory Fail',
      videos:[{
        duration: 50
      }]
    },
    {
      name: 'Sinister Victory Fail',
      videos:[{
        duration: 66
      },{
        duration: 45
      }]
    },
    {
      name: 'Domination Victory',
      videos:[{
        duration: 37
      }]
    },
    {
      name: 'Default Victory',
      videos:[{
        duration: 35
      }]
    }
  ]
}

export default gameConfiguration