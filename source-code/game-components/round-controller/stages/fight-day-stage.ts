import IStage from "../../../interfaces/game/stage";
import { RoundController } from "../round-controller";
import { Bet } from "../../../interfaces/game/bet";
import gameConfiguration from "../../../game-settings/game-configuration";
import Fighter from "../../fighter/fighter";
import { Manager } from "../../manager";
import { RoundStage } from "../../../types/game/round-stage.type";
import { FightReport, ManagerWinnings } from "../../../interfaces/front-end-state-interface";
import { Game } from "../../game";

export default class FightDayStage implements IStage {
  name: RoundStage = 'Fight Day'
  endStage
  
  constructor(private game: Game){}

  start(): Promise<void> {
    const {roundController} = this.game.has
    return new Promise(resolve => {
      this.endStage = resolve
      

      const {fightFinishedSubject} = this.game.has.roundController.activeFight


      roundController.activeFight.start()

      fightFinishedSubject.subscribe(
        fightReport => {
          this.makeItRain(fightReport)
          const playersHadWinnings = fightReport.managerWinnings?.some(m => m.winnings > 0)
          const duration = playersHadWinnings ? gameConfiguration.stageDurations.showWinningsDuration : 1
          setTimeout(this.stageFinished, duration * 1000);
        }
      )

      roundController.triggerUIUpdate()
    })   

  }

  makeItRain(fightReport: FightReport){
    this.processManagerBets(fightReport)
    this.game.has.roundController.triggerUIUpdate()

  }


  pause(){
    this.game.has.roundController.activeFight.pause()
  }
  unpause(){
    this.game.has.roundController.activeFight.unpause()
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
    this.game.has.roundController.activeFight.fighters.forEach(fighter => fighter.reset())
  }
  
  private processManagerBets(fightReport: FightReport) {
    const { winner, draw } = fightReport

    const {roundNumber} = this.game.has.roundController

    const managerWinnings: ManagerWinnings[] = this.game.has.managers.map((manager: Manager) => {


      let winnings = 0
      let betWinnings = 0
      let playersFighterWinnings = 0

      const managersBet: Bet = manager.has.nextFightBet
      let  managersBetAmount

      
      if (managersBet) {
        const betSizePercentage = gameConfiguration.betSizePercentages[managersBet.size]
        managersBetAmount = Math.round(manager.has.money * betSizePercentage / 100)
        manager.has.money -= managersBetAmount
        manager.functions.addToLog({
          roundNumber,
          message: `You spent ${managersBetAmount} on a ${managersBet.size} bet on ${managersBet.fighterName}`, type: 'betting'})
      }
      
      if(draw){
        if (managersBet) {
          manager.functions.addToLog({
            roundNumber,
            message: `The fight was a draw, all managers will get back half of their bet money. You get back ${Math.round(managersBetAmount / 2)} of the ${managersBetAmount} you bet on ${managersBet.fighterName}`, type: 'betting'})
          manager.has.money -= Math.round(managersBetAmount / 2)
        } else {
          manager.functions.addToLog({
            roundNumber,
            message: `The fight was a draw, all managers will get back half of their bet money.`, type: 'betting'})

        }
      }

      if (winner) {
        const {playersFighterMultiplier, playersFighterWinBase, betWinningsBase, betAmountMultiplier, totalPublicityMultiplier} = gameConfiguration.fightWinnings

        const managerWonBet = winner.name == managersBet?.fighterName
        const bonusFromPublicityRating = this.game.has.roundController.activeFight.fighters.reduce((totalPublicityRating, fighter) => totalPublicityRating += fighter.state.publicityRating, 0) * totalPublicityMultiplier

        if (managersBet) {
        
          if (managerWonBet) {
            winnings += betWinningsBase
            betWinnings =  Math.round(managersBetAmount * betAmountMultiplier)
            winnings += betWinnings
          }
        }

        const managersFighter = manager.has.fighters.find((f: Fighter) => f.name == winner.name)
        
        if(managersFighter){
          winnings += playersFighterWinBase
          playersFighterWinnings = Math.round((winnings * managersFighter.state.publicityRating * playersFighterMultiplier))

          winnings += playersFighterWinnings
        }


        if(this.game.has.roundController.thisWeekIsEvent){
          winnings *= 3
        }

        // manager logs
        if(managerWonBet){
          manager.functions.addToLog({
            roundNumber,
            message: `
          ${managersBet.fighterName} has won the fight! Your ${managersBet.size} bet on ${managersBet.fighterName} has won you $${winnings}. 
          ${playersFighterWinnings || bonusFromPublicityRating ? 'Including: ': ''}
          ${playersFighterWinnings ? `$${playersFighterWinnings} sponsored fighter bonus.`:''}
          ${bonusFromPublicityRating ? `$${bonusFromPublicityRating} fight publicity bonus.`:''}
        `, type: 'betting'})
        }
        if(managersBet && !managerWonBet && managersFighter){
          manager.functions.addToLog({
            roundNumber,
            message: `
          Unfortunately ${managersBet.fighterName} did not win the fight. However your sponsored fighter ${winner.name} did win earning you ${playersFighterWinnings ? `$${playersFighterWinnings} sponsored fighter bonus.`:''}
        `, type: 'betting'})
        }
        if(!managersBet && managersFighter){
          manager.functions.addToLog({
            roundNumber,
            message: `
          Although you did not bet on the fight, Your sponsored fighter ${winner.name} did win earning you ${playersFighterWinnings ? `$${playersFighterWinnings} sponsored fighter bonus.`:''}
        `, type: 'betting'})
        }

        manager.has.money += winnings
      }


      

      return {
        managerName: manager.has.name,
        winnings
      }
    })
    fightReport.managerWinnings = managerWinnings
  }
  
};
