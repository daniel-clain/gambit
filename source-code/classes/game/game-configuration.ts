
export interface GameConfiguration{  
  numberOfFighters: number
  numberOfFightersPerFight: number
  fighterNames: string[]
  betSizePercentages: {
    small: number
    medium: number
    large: number

  }
  stageDurations: {
    managerOptions: number
    maxFightDuration: number
    eachNewsSlide: number
    postFightReport: number
  }
}



const gameConfiguration: GameConfiguration = {
  numberOfFighters: 8,
  numberOfFightersPerFight: 2,
  fighterNames: ['Daniel', 'Tomasz', 'Hassan', 'Dardan', 'Alex', 'Angelo', 'Paul', 'Suleman', 'Mark', 'Mat', 'Mike'],
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
  }
}

export default gameConfiguration