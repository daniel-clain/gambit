import { random, shuffle } from "../helper-functions/helper-functions";
import { Professional } from "../interfaces/server-game-ui-state.interface";
import gameConfiguration from "../game-settings/game-configuration";
import { Player } from "../interfaces/player-info.interface";
import Fighter from "./fighter/fighter";
import { GameType } from "../types/game/game-type";
import SkillLevel from "../types/game/skill-level.type";
import { Profession } from "../types/game/profession";
import { getProfessionalsAbilities } from "./professionals";

  

function GameUtility(){ 
  const shuffledNames = shuffle([...gameConfiguration.listOfNames])
  
  this.createFighters = () => {
    const amount: number = gameConfiguration.numberOfFighters
    const newFighters: Fighter[] = []
    for(;newFighters.length < amount;){
      const newFighter = new Fighter(shuffledNames.pop())
      newFighter.fighting.stats.baseStrength = random(5, true)
      newFighter.fighting.stats.fitness = random(5, true)
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

  this.createProfessionals = () => {
    const {numberOfProfessionals} = gameConfiguration
    const professionals: Professional[] = []
    for(;professionals.length < numberOfProfessionals;){
      professionals.push(getRandomProfessional())
    }
    return professionals
    
    function getRandomProfessional(): Professional {
      const randomProfession: Profession = getRandomProfession()
      
      return {
        name: shuffledNames.pop(),
        profession: randomProfession,
        abilities: getProfessionalsAbilities(randomProfession),
        skillLevel: <SkillLevel>random(3, true)
      }
    }
    function getRandomProfession(): Profession{
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
    
  this.setupGameDisplay = (playerInfo: Player[], gameType: GameType) => {
    /* game.displayUpdateCommunicators = []
    playerInfo
    .filter(playerInfo => playerInfo.name == 'Game Display')
    .forEach((playerInfo: Player, index) => {
      const {socketObj, name, id} = playerInfo
      if(gameType == 'Websockets')
        game.displayUpdateCommunicators.push(new DisplayUpdateCommunicatorGameWebsocket(
          socketObj,
          game
        ))
    }) */ 
  }
}

export default GameUtility

