import { random, shuffle } from "../helper-functions/helper-functions";
import { Professional } from "../interfaces/game-ui-state.interface";
import Game from "./game";
import gameConfiguration from "../game-settings/game-configuration";
import { PlayerInfo } from "../interfaces/player-info.interface";
import Manager from "./manager";
import Fighter from "./fighter/fighter";
import { GameType } from "../types/game/game-type";
import SkillLevel from "../types/game/skill-level.type";
import { Profession } from "../types/game/profession";
import { getProfessionalsAbilities } from "./professionals";
import { AbilityProcessor, getAbilityProcessor } from "./abilities-reformed/ability-processor";
import PlayerUpdateCommunicatorGame from "./update-communicators/player-update-communicator-game";
import PlayerUpdateCommunicatorGameWebsocket from "./update-communicators/player-update-communicator-game-websocket";
import DisplayUpdateCommunicatorGameWebsocket from "./update-communicators/display-update-communicator-game-websocket";

export const setupGame = (game: Game, gameType: GameType, playerInfo: PlayerInfo[]) => {
  const shuffledNames: string[] = shuffle([...gameConfiguration.listOfNames]) 

  createFighters()
  createProfessionals()
  setupPlayersAndManagers(playerInfo, gameType)     
  setupGameDisplay(playerInfo, gameType)

  function setupGameDisplay (playerInfo: PlayerInfo[], gameType: GameType) {
    game.displayUpdateCommunicators = []
    playerInfo
    .filter(playerInfo => playerInfo.name == 'Game Display')
    .forEach((playerInfo: PlayerInfo, index) => {
      const {socket, name, id} = playerInfo
      if(gameType == 'Websockets')
        game.displayUpdateCommunicators.push(new DisplayUpdateCommunicatorGameWebsocket(
          socket,
          game
        ))
    }) 
  }

  function setupPlayersAndManagers (playerInfo: PlayerInfo[], gameType: GameType) {
    const abilityProcessor: AbilityProcessor = getAbilityProcessor(game)
    game.managers = []
    game.playersUpdateCommunicators = []
    playerInfo
    .filter(playerInfo => playerInfo.name != 'Game Display')
    .forEach((playerInfo: PlayerInfo, index) => { 
      const {socket, name, id} = playerInfo
      const playersManager: Manager = new Manager(playerInfo.name, game)
      game.managers.push(playersManager)
      if(gameType == 'Websockets')
        game.playersUpdateCommunicators.push(new PlayerUpdateCommunicatorGameWebsocket(
          socket,
          game,
          playersManager,
          abilityProcessor
        ))
      if(gameType == 'Local')
        game.playersUpdateCommunicators.push(new PlayerUpdateCommunicatorGame(
          game,
          playersManager,
          abilityProcessor
        ))
    }) 
  }

  function createFighters(){
    const amount: number = gameConfiguration.numberOfFighters
    const newFighters: Fighter[] = []
    for(;newFighters.length < amount;){
      const newFighter = new Fighter(shuffledNames.pop())
      /* newFighter.fighting.stats.baseStrength = 1
      newFighter.fighting.stats.fitness = 10
      newFighter.fighting.stats.baseAggression = 0
      newFighter.fighting.stats.baseIntelligence = 10 */
      newFighter.fighting.stats.baseStrength = random(5, true)
      newFighter.fighting.stats.fitness = random(5, true)
      newFighter.fighting.stats.baseAggression = random(5)
      newFighter.fighting.stats.baseIntelligence = random(10)
      newFighter.fighting.reset()
      newFighters.push(newFighter)
    }

    game.fighters = newFighters
  }

  function createProfessionals(){
    const {numberOfProfessionals} = gameConfiguration
    const professionals: Professional[] = []
    for(;professionals.length < numberOfProfessionals;){
      professionals.push(getRandomProfessional())
    }
    game.professionals = professionals
  }

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

};
