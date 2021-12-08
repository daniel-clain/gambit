
const gameConfiguration = {
  freezeFight: false,
  startingRoundNumber: 1,
  numberOfFighters: 30,
  numberOfProfessionals: 40,
  numberOfProfessionalJobSeekersPerRound: 3,
  numberOfFighterJobSeekersPerRound: 2,
  listOfNames: ['Daniel', 'Tom', 'Alex', 'Angelo', 'Paul', 'Mark', 'Mat', 'Mike', 'Brad', 'Steve', 'James', 'Harry', 'Kevin', 'Stan', 'Dave', 'Chris', 'Sam', 'Bob', 'Fred', 'Frank', 'Jake', 'Alan', 'Ben', 'Chad', 'Denis', 'Eric', 'Greg', 'Lewis', 'Larry', 'Neil', 'Nathan', 'Norbit', 'Phil', 'Ryan', 'Simon', 'Seth', 'Troy', 'Tyler', 'Zach', 'Gavin', 'Robert', 'Tim', 'Tyson', 'Hugh', 'Ronald', 'Spencer', 'Jason', 'Arnold', 'Tod', 'Shawn', 'Liam', 'Will', 'Oliver', 'Ethan', 'John', 'Luke', 'Dylan', 'Anthony', 'Josh', 'Charles', 'Connor', 'Cameron', 'Adam', 'Ian', 'Evan', 'Henry', 'Owen', 'Isaac', 'Jackson', 'Leo', 'Jonathan', 'Declan', 'Vincent', 'Tristan', 'Dom', 'Patrick', 'Arie', 'Adrien', 'Bruce', 'Miles', 'Garrick', 'Barry', 'Jerry', 'George', 'Julian',  'Andy', 'Peter', 'Parth', 'Misael'],
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
    interestAddedPerWeek: .05,
    weeksOfNoPaybackUntilRespond: 3
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
    "Lawyer": 1,
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
  ],
  videos: [
    {
      name: 'Sinister Victory',
      videos:[{
        duration: 78
      }]
    },
    {
      name: 'Wealth Victory',
      videos:[{
        duration: 32
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
    }
  ]
}

export default gameConfiguration