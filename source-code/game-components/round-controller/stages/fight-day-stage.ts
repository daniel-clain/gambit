import IStage from "../../../interfaces/game/stage";
import { RoundController } from "../round-controller";
import { Bet } from "../../../interfaces/game/bet";
import gameConfiguration from "../../../game-settings/game-configuration";
import Fighter from "../../fighter/fighter";
import { Manager } from "../../manager";
import { RoundStage } from "../../../types/game/round-stage.type";
import { FightReport, ManagerWinnings } from "../../../interfaces/front-end-state-interface";

export default class FightDayStage implements IStage {
  name: RoundStage = 'Fight Day'
  endStage
  
  constructor(private roundController: RoundController, private managers: Manager[]){}

  start(): Promise<void> {
    return new Promise(resolve => {
      this.endStage = resolve

      const {fightFinishedSubject} = this.roundController.activeFight


      this.roundController.activeFight.start()

      fightFinishedSubject.subscribe(
        fightReport => {
          this.makeItRain(fightReport)
          const playersHadWinnings = fightReport.managerWinnings?.some(m => m.winnings > 0)
          const duration = playersHadWinnings ? gameConfiguration.stageDurations.showWinningsDuration : 1
          setTimeout(this.stageFinished, duration * 1000);
          
        }
      )

      this.roundController.triggerUIUpdate()
    })   

  }

  makeItRain(fightReport: FightReport){
    this.processManagerBets(fightReport)
    this.roundController.triggerUIUpdate()

  }


  pause(){
    this.roundController.activeFight.pause()
  }
  unpause(){
    this.roundController.activeFight.unpause()
  }

  stageFinished = () => {
    console.log('fight finished');
    this.resetFighters()
    if(!this.endStage){
      debugger
    }
    this.endStage()
  }

  resetFighters() {
    this.roundController.activeFight.fighters.forEach(fighter => fighter.reset())
  }
  
  private processManagerBets(fightReport: FightReport): FightReport {
    const { winner } = fightReport

    if (winner) {
      const bonusFromPublicityRating = this.roundController.activeFight.fighters.reduce((totalPublicityRating, fighter) => totalPublicityRating += fighter.state.publicityRating, 0) * 10
      const managerWinnings: ManagerWinnings[] = this.managers.map(
        (manager: Manager) => {
          let winnings = 0
          const managersBet: Bet = manager.has.nextFightBet
          if (managersBet) {
            const betSizePercentage = gameConfiguration.betSizePercentages[managersBet.size]
            const managersBetAmount = Math.round(manager.has.money * betSizePercentage / 100)
            
          manager.functions.addToLog({message: `You spent ${managersBetAmount} money on the last fight`, type: 'betting'})
            manager.has.money -= managersBetAmount
            if (managersBet.fighterName == winner.name) {
              winnings += Math.round(managersBetAmount * 2 + 150)
              winnings += bonusFromPublicityRating
            }
          }
          const managersFighter = manager.has.fighters.find((f: Fighter) => f.name == winner.name)
          if (managersFighter) {
            winnings += 100
            winnings += Math.round(winnings *(managersFighter.state.publicityRating * 2) / 100)
          }
          console.log(`${manager.has.name} just won ${winnings}`);
          manager.has.money += winnings

          
          


          if(winnings)
            manager.functions.addToLog({message: `You made ${winnings} money in winnings from the last fight`, type: 'betting'})

          return {
            managerName: manager.has.name,
            winnings
          }
        })
      fightReport.managerWinnings = managerWinnings
    }
    return fightReport
  }
  
};
