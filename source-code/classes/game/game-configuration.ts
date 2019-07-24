
export interface GameConfiguration{  
  numberOfFighters: number
  numberOfFightersPerFight: number
  fighterNames: string[]
}



const gameConfiguration: GameConfiguration = {
  numberOfFighters: 8,
  numberOfFightersPerFight: 2,
  fighterNames: ['Daniel', 'Tomasz', 'Hassan', 'Dardan', 'Alex', 'Angelo', 'Paul', 'Suleman', 'Mark', 'Mat', 'Mike']
}

export default gameConfiguration