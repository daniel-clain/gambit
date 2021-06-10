import { Employee, Professional } from "../interfaces/front-end-state-interface";
import gameConfiguration from "../game-settings/game-configuration";
import { random, shuffle } from "../helper-functions/helper-functions";
import { Profession } from "../types/game/profession";
import SkillLevel from "../types/game/skill-level.type";
import Fighter from "./fighter/fighter";
import { Game } from "./game";
import { getProfessionalsAbilities } from "./professionals";

export class Game_Implementation{
  shuffledNames 

  constructor(public game: Game){}

  setupFightersAndProfessionals(){
    this.shuffledNames = shuffle([...gameConfiguration.listOfNames.filter(name => !this.game.has.players.some(p => p.name == name))])
    
    this.game.has.fighters = this.createRandomFighters()
    this.game.has.professionals = this.createRandomProfessionals()
  }


  createRandomFighters(): Fighter[]{
    const amount: number = gameConfiguration.numberOfFighters
    const newFighters: Fighter[] = []
    for(;newFighters.length < amount;){
      const newFighter = new Fighter(this.shuffledNames.pop())
      newFighter.fighting.stats.baseStrength = random(5, true)
      newFighter.fighting.stats.baseFitness = random(5, true)
      newFighter.fighting.stats.baseAggression = random(5)
      newFighter.fighting.stats.baseIntelligence = random(10, true)

      newFighter.fighting.reset()
      newFighters.push(newFighter)
      
    }

    generateFighterHistory()
    return newFighters

    function generateFighterHistory(){
      const numberOfFights = newFighters.length * 5
  
      for (let fight = 0; fight < numberOfFights; fight++) {
        const randomNumberOfFightersInTheFight = random(3, true) + 1
  
  
        let randomFighters: Fighter[] = []
        for (; randomFighters.length != randomNumberOfFightersInTheFight; ) {
          const randomFighterIndex = random(newFighters.length - 1)
          const randomFighter = newFighters[randomFighterIndex]
          const fighterAlreadyInList = randomFighters.some(fighter => fighter.name == randomFighter.name)
  
          if(fighterAlreadyInList) continue
  
          randomFighters.push(randomFighter)
          
        }
  
        randomFighters.forEach(fighter => fighter.state.numberOfFights++)
  
        const fightersChanceToWin = randomFighters.map(fighter => {
          const {fitness, strength, aggression, intelligence} = fighter.fighting.stats
          return {
            fighter,
            chance: Math.round(fitness + strength + (aggression / 2) + intelligence)
          }
        })
  
        const totalProbability: number = fightersChanceToWin.reduce(
          (totalProbability, {chance}) =>
            totalProbability + chance, 0)
  
  
        const randomNum = random(totalProbability, true)
        let probabilityRange: number = 0;
  
  
        let fightWinner: Fighter
        for (let {fighter, chance} of fightersChanceToWin) {
          if (
            randomNum > probabilityRange &&
            randomNum <= probabilityRange + chance
          ){
            fightWinner = fighter
            break
          }
          else
            probabilityRange += chance
        }
        if(!fightWinner)
          throw console.error('There should have been a fight winner', fightersChanceToWin)
  
        fightWinner.state.numberOfWins++
        
      }
    }
    
  }

  
  createRandomProfessionals(): Professional[]{
    
    
    const {numberOfProfessionals} = gameConfiguration
    const professionals: Professional[] = []
    for(;professionals.length < numberOfProfessionals;){
      professionals.push(getRandomProfessional(this.shuffledNames))
    }
    return professionals

    
    function getRandomProfessional(shuffledNames): Professional {
      const randomProfession: Profession = getRandomProfession()
      
      return new Professional(randomProfession, <SkillLevel>random(3, true), shuffledNames.pop())
      
      function getRandomProfession(): Profession {
        let totalProbability = 0
        
        for( let profession in gameConfiguration.professionalTypeProbability){
          totalProbability += gameConfiguration.professionalTypeProbability[profession]
        }
        const randomNumber = random(totalProbability, true)
        let probabilityRange = 0
        for ( let profession in gameConfiguration.professionalTypeProbability) {
          if (
            randomNumber > probabilityRange &&
            randomNumber <= probabilityRange + gameConfiguration.professionalTypeProbability[profession]
          )
            return profession as Profession
          else
            probabilityRange += gameConfiguration.professionalTypeProbability[profession]
        }
      }
    }
  }

  getAllConnectedGameDisplays(){
    
    return this.game.has.gameDisplays?.filter(gameDisplay => this.game.has.connectionManager.disconnectedPlayerVotes
      .find(d => d.disconnectedPlayer.id == gameDisplay.id))
  }


  removeFighterFromTheGame = (fighterName, game: Game) => {
    const fighter = game.has.fighters.find(fighter => fighter.name == fighterName)
    fighter.state.dead = true
  
    game.has.managers.forEach(manager => {
      const {fighters, knownFighters} = manager.has
      fighters.splice(
        fighters.findIndex(f => f.name == fighterName), 1
      )
      knownFighters.splice(
        fighters.findIndex(f => f.name == fighterName), 1
      )
    })
  
    const {fighters} = game.has.roundController.activeFight
    fighters.splice(
      fighters.findIndex(f => f.name == fighterName), 1
    )
  }

  resignEmployee(employee: Employee){
    const employeesManager = this.game.has.managers.find(m => m.has.employees.some(e => e.name == employee.name))
    
    employeesManager.has.employees = employeesManager.has.employees.filter(e => e.name == employee.name)

    const {actionPoints, activeContract, ...rest} = employee

    this.game.has.professionals.push(rest)
  }

}
