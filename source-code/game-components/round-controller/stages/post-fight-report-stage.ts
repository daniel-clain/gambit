
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import IStage from "../../../interfaces/game/stage";
import RoundStages from "../../../types/game/round-stage.type";
import gameConfiguration from "../../../game-settings/game-configuration";

export default class PostFightReportStage implements IStage {
  name: RoundStages = 'Post Fight Report'
  
  constructor(private game: Game, private roundController: RoundController){}

  start(): Promise<void> {
    return new Promise(resolve => {
      
      setTimeout(resolve, gameConfiguration.stageDurations.postFightReport)  
    })
  }

};
