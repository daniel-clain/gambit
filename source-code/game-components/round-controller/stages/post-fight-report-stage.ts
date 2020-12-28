import { RoundController } from "../round-controller";
import IStage from "../../../interfaces/game/stage";
import RoundStages from "../../../types/game/round-stage.type";
import gameConfiguration from "../../../game-settings/game-configuration";

export default class PostFightReportStage implements IStage {
  name: RoundStages = 'Post Fight Report'
  
  constructor(private roundController: RoundController){}

  start(): Promise<void> {
    return new Promise(resolve => {
      
      setTimeout(resolve, gameConfiguration.stageDurations.postFightReport)  
    })
  }

  pause(){console.log('no implemented')}
  unpause(){console.log('no implemented')}

};
