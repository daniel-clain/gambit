import IStage from "../../../../interfaces/game/stage";
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import { FightState, FightReport } from "../../fight/fight";
import RoundStages from "../../../../types/game/round-stages";
import ManagerWinnings from "../../../../../manager-winnings";
import Manager from "../../manager/manager";
import { Bet } from "../../../../interfaces/game/bet";
import gameConfiguration from "../../game-configuration";
import Fighter from "../../fighter/fighter";

export default class FightDayStage implements IStage {
  name: RoundStages = 'Fight Day'
  uIUpdateSubject: Subject<void> = new Subject()
  finished: Subject<void> = new Subject();
  
  constructor(private game: Game, private roundController: RoundController){}

  start(): void {
    
    this.finished = new Subject();

    this.resetFighters()

    const {fightStateUpdatedSubject, fightFinishedSubject} = this.roundController.activeFight
    this.roundController.activeFight.start()

    fightStateUpdatedSubject.subscribe(
      (fightState: FightState) => {
        console.log('fight update');
      }
    )

    fightFinishedSubject.subscribe(
      (fightReport: FightReport) => {
        console.log('fight finished');
        this.processManagerBets(fightReport)
        this.stageFinished()
      }
    )
  }

  stageFinished(){
    this.finished.next()
    this.finished.complete()
  }

  resetFighters() {
    this.game.fighters.forEach(fighter => fighter.reset())
  }
  
  private processManagerBets(fightReport: FightReport): FightReport {
    const { winner } = fightReport

    if (winner) {
      const managerWinnings: ManagerWinnings[] = this.game.managers.map(
        (manager: Manager) => {
          let winnings = 0
          const managersBet: Bet = manager.nextFightBet
          if (managersBet) {
            const betSizePercentage = gameConfiguration.betSizePercentages[managersBet.size]
            const managersBetAmount = Math.round(manager.money * betSizePercentage / 100)
            manager.money -= managersBetAmount
            if (managersBet.fighterName == winner.name) {
              winnings += Math.round(managersBetAmount * 1.6 + 50)
            }
          }
          if (manager.fighters.find((f: Fighter) => f.name == winner.name)) {
            winnings += 100
            winnings *= Math.round((winner.publicityRating * 5 + 100) / 100)
          }
          console.log(`${manager.name} just won ${winnings}`);
          manager.money += winnings

          return {
            managerName: manager.name,
            winnings
          }
        })
      fightReport.managerWinnings = managerWinnings
    }
    return fightReport
  }
  
};
