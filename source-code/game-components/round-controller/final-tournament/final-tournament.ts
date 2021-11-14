import { wait } from "../../../helper-functions/helper-functions";
import { FighterInfo, FinalTournamentBoard } from "../../../interfaces/front-end-state-interface";
import Fight from "../../abilities-general/fight/fight";
import Fighter from "../../fighter/fighter";
import { Game } from "../../game";

export type MatchupName = 'Finals' | 'Semi Finals 1' | 'Semi Finals 2' | 'Quarter Finals 1' | 'Quarter Finals 2' | 'Quarter Finals 3' | 'Quarter Finals 4' 

export type Matchup = {
  fighter1: Fighter
  fighter2: Fighter
  winner?: Fighter
  matchupName: MatchupName
}
export type MatchupInfo = {
  fighter1: FighterInfo
  fighter2: FighterInfo
  winner?: FighterInfo
  matchupName: MatchupName
}
export class FinalTournament{
  private quarterFinalsMatchups: Matchup[]
  private semiFinalsMatchups: Matchup[]
  private finalsMatchup: Matchup
  private showingBoard: boolean
  activeFight: Fight
  finalTournamentBoard: FinalTournamentBoard
  
  constructor(private game: Game) {
    console.log('fight tournament');
    this.setupTournament()
  }

  private setupTournament(){
    const fighters = getTop8Fighters(this)

    this.quarterFinalsMatchups = [
      {
        fighter1: fighters[7], 
        fighter2: fighters[3], 
        matchupName: 'Quarter Finals 1'
      },{
        fighter1: fighters[5], 
        fighter2: fighters[1], 
        matchupName: 'Quarter Finals 2'
      },{
        fighter1: fighters[6], 
        fighter2: fighters[2], 
        matchupName: 'Quarter Finals 3'
      },{
        fighter1: fighters[4], 
        fighter2: fighters[0], 
        matchupName: 'Quarter Finals 4'
      }
    ]

    function getTop8Fighters(thisClass: FinalTournament){
      return thisClass.game.has.fighters.filter(f => f.state.manager)
      .sort(
        (compareFighter1, compareFighter2) => {
          return (
            compareFighter1.state.numberOfWins / compareFighter1.state.numberOfFights -
            compareFighter2.state.numberOfWins / compareFighter2.state.numberOfFights
          )
        }
      )
      .slice(0, 8)
    }
    
  }



  startTournament = async () => {
    await this.showTournamentBoard()
    console.log('quarter finals');
    for(let matchup of this.quarterFinalsMatchups){
      console.log(`${matchup.fighter1.name} vs. ${matchup.fighter2.name}`);
      matchup.winner = await this.doFight(matchup)
      
      this.semiFinalsMatchups = [
        {
          fighter1: this.quarterFinalsMatchups[0].winner, 
          fighter2: this.quarterFinalsMatchups[1].winner, 
          matchupName: 'Semi Finals 1'
        }, {
          fighter1: this.quarterFinalsMatchups[2].winner, 
          fighter2: this.quarterFinalsMatchups[3].winner, 
          matchupName: 'Semi Finals 2'
        }
      ]
      await this.showTournamentBoard()
    }

    
    console.log('semi finals');
    for(let matchup of this.semiFinalsMatchups){
      console.log(`${matchup.fighter1.name} vs. ${matchup.fighter2.name}`);
      matchup.winner = await this.doFight(matchup)
      this.finalsMatchup = {
        fighter1: this.semiFinalsMatchups[0].winner, 
        fighter2: this.semiFinalsMatchups[1].winner,
        matchupName: 'Finals'
      }
      await this.showTournamentBoard()
    }

    

    console.log('finals');
    console.log(`${this.finalsMatchup.fighter1.name} vs. ${this.finalsMatchup.fighter2.name}`);
    this.finalsMatchup.winner = await this.doFight(this.finalsMatchup)
    await this.showTournamentBoard()

    this.showWinnerVideo()
    
  }

  private updateTournamentBoard(){
    this.finalTournamentBoard = {
      finals: {
        winner: this.finalsMatchup?.winner?.getInfo(),
        fighter1: this.finalsMatchup?.fighter1?.getInfo(),
        fighter2: this.finalsMatchup?.fighter2?.getInfo(),
        matchupName: 'Finals'
      },
      semiFinals: this.semiFinalsMatchups?.map(sf => {
        return {
          winner: sf.winner?.getInfo(),
          fighter1: sf.fighter1?.getInfo(),
          fighter2: sf.fighter2?.getInfo(),
          matchupName: sf.matchupName
        }
      }),
      
      quarterFinals: this.quarterFinalsMatchups.map(qf => {
        return {
          winner: qf.winner?.getInfo(),
          fighter1: qf.fighter1?.getInfo(),
          fighter2: qf.fighter2?.getInfo(),
          matchupName: qf.matchupName
        }
      }),
      showTournamentBoard: this.showingBoard
    }
  }

  private doFight(matchup: Matchup): Promise<Fighter>{
    this.activeFight = new Fight([matchup.fighter1, matchup.fighter2])
    this.activeFight.start()
    this.activeFight.fightUiDataSubject.subscribe(() => {
      this.game.functions.triggerUIUpdate()
    })
    return new Promise(resolve => {
      this.activeFight.fightFinishedSubject.subscribe(fightReport => {
        this.activeFight.doTeardown()
        this.activeFight.fighters.forEach(f => f.reset())
        resolve(this.activeFight.fighters.find(f => f.name == fightReport.winner.name))
      })
    });
  }

  private async showTournamentBoard(){
    this.showingBoard = true
    this.updateTournamentBoard()
    this.game.functions.triggerUIUpdate()
    if(this.finalsMatchup?.winner){
      await wait(5000)
      return
    } else {
      await wait(3000)
    }
    this.finalTournamentBoard.showTournamentBoard = false
    this.game.functions.triggerUIUpdate()
  }

  private showWinnerVideo = () => {
    console.log(this.finalsMatchup.winner.name)
    const fightersManager = this.finalsMatchup.winner.state.manager
    this.game.state.finalTournament = null
    this.game.state.playerHasVictory = {
      name: fightersManager.has.name,
      victoryType: 'Domination Victory'
    }
    this.game.functions.triggerUIUpdate()
  }
}