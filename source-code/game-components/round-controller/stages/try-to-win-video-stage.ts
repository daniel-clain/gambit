import IStage from "../../../interfaces/game/stage";
import { RoundController } from "../round-controller";
import { NewsItem } from "../../../types/game/news-item";
import gameConfiguration from "../../../game-settings/game-configuration";
import { RoundStage } from "../../../types/game/round-stage.type";
import { Game } from "../../game";
import { wait } from "../../../helper-functions/helper-functions";
export default class TryToWinVideoStage implements IStage {
  name: RoundStage = 'Try To Win Video'
  private endRound
  
  
  constructor(private game: Game){}

  start(): Promise<void> {
    return new Promise(async resolve => {
      const {playerHasVictory, playerHasFailedVictory} = this.game.state
      let enoughTimeForVideoToPlay: number
      if(playerHasVictory){
        const type = playerHasVictory.victoryType
        if(type == 'Sinister Victory'){
          enoughTimeForVideoToPlay = 60
        }
        if(type == 'Wealth Victory'){
          enoughTimeForVideoToPlay = 40
        }
      }
      
      if(playerHasFailedVictory){
        const type = playerHasFailedVictory.victoryType
        if(type == 'Sinister Victory'){
          enoughTimeForVideoToPlay = 70
        }
        if(type == 'Wealth Victory'){
          enoughTimeForVideoToPlay = 40
        }
      }

      await wait(enoughTimeForVideoToPlay)
      this.endRound = resolve
      this.endRound()


    })
  }

  pause(){console.log('no implemented')}
  unpause(){console.log('no implemented')}


  
};
