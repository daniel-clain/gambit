import { random, shuffle } from "../helper-functions/helper-functions";
import { JobSeeker, Professional } from "../interfaces/game-ui-state.interface";
import Game from "./game";
import gameConfiguration from "./game-configuration";
import { PlayerInfo } from "../interfaces/player-info.interface";
import Manager from "./manager/manager";
import UpdateCommunicatorGameWebsocket from "./update-communicator-game-websocket";
import UpdateCommunicatorGame from "./update-communicator-game";
import Fighter from "./fighter/fighter";
import { GameType } from "../types/game/game-type";
import { type } from "os";
import SkillLevel from "../types/skill-level.type";
import { Profession } from "../types/game/profession";
import { getProfessionalsAbilities } from "./professionals";

export const setupGame = (game: Game, gameType: GameType, playerInfo: PlayerInfo[]) => {
    
  const shuffledNames: string[] = shuffle([...gameConfiguration.listOfNames])  

  const setupPlayersAndManagers = (playerInfo: PlayerInfo[], gameType: GameType) => {
    game.managers = []
    game.playersUpdateCommunicators = []
    playerInfo.forEach((playerInfo: PlayerInfo, index) => {
      const {socket, name, id} = playerInfo
      const playersManager: Manager = new Manager(playerInfo.name, game)
      game.managers.push(playersManager)
      if(gameType == 'Websockets')
        game.playersUpdateCommunicators.push(new UpdateCommunicatorGameWebsocket(
          socket,
          game,
          playersManager
        ))
      if(gameType == 'Local')
        game.playersUpdateCommunicators.push(new UpdateCommunicatorGame(
          game,
          playersManager
        ))
    }) 
  }

  const createFighters = () => {
    const amount: number = gameConfiguration.numberOfFighters
    const newFighters: Fighter[] = []
    for(;newFighters.length < amount;){
      const newFighter = new Fighter(shuffledNames.pop())
      newFighter.fighting.stats.baseStrength = random(5, true)
      newFighter.fighting.stats.fitness = random(5, true)
      newFighter.fighting.stats.baseAggression = random(5, true)
      newFighter.fighting.stats.baseIntelligence = random(5, true)
      newFighter.fighting.reset()
      newFighters.push(newFighter)
    }

    game.fighters = newFighters
  }

  const createProfessionals = () => {
    const {numberOfProfessionals} = gameConfiguration
    const professionals: Professional[] = []
    for(;professionals.length < numberOfProfessionals;){
      professionals.push(getRandomProfessional())
    }
    game.professionals = professionals
  }

  const getRandomProfessional = (): Professional => {
    const randomProfession: Profession = getRandomProfession()
    
    return {
      name: shuffledNames.pop(),
      profession: randomProfession,
      abilities: getProfessionalsAbilities(randomProfession),
      skillLevel: <SkillLevel>random(3, true)
    }
  }

  const getRandomProfession = (): Profession => {
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
  
  createFighters()
  createProfessionals()
  setupPlayersAndManagers(playerInfo, gameType)

};
