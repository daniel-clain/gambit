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
  
  this.createFighters = () => {
    
  }

  this.createProfessionals = () => {
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

