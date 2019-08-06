import { Component } from "react";
import { IMessageService } from "../../../../../../interfaces/message-service.interface";
import FightUpdates from "../../../../../../interfaces/game/fighter/fight-updates";
import GameUpdates from "../../../../../../interfaces/game/fighter/game-updates";
import { Fighter } from "../../../../../../classes/game/fighter/fighter";
import FighterSkeleton from "../../../../../../interfaces/game/fighter/fighter-skeleton";

type FightProps = {
  messageService: IMessageService
}


export class FightComponentxx extends Component<FightProps> {

  fighters: FighterSkeleton[]

  constructor(props){
    super(props)
    this.props.messageService.onReceiveGameUpdates((gameUpdates: GameUpdates) => 
      this.fighters = gameUpdates.fightUpdates.fighters
    )
  }

  render(){                                                 
    let countDown: number
    let timeRemaining: number
    let fighters: FighterSkeleton[]
    let winner: FighterSkeleton
    
    if(this.fight){      
      countDown = this.fight.countDown
      timeRemaining = this.fight.timeRemaining
      fighters = this.fight.fighters
      winner = this.fight.winner
    }
    
    return this.fight && 
      <div id='fight'>
        {countDown != 0 && 
          <div id='fight__count-down'>{countDown}</div>
        }
        {countDown == 0 && timeRemaining != 0 && 
          <div id='fight__time-remaining'>Time Remaining: {timeRemaining}</div>}
        <div class='arena'>
          <div class='arena--behind'></div>
          <div class='arena--fight-area'>
          {
            fighters.map(fighter => <fighter-component fighter={fighter}></fighter-component>)
          }
          </div>
          <div class='arena--infront'></div>
        
        </div>
        {winner && 
          <div id='fight__winner'>{winner.name} Wins!</div>
        }
        {timeRemaining == 0 && !winner &&
          <div id='fight__winner'>Fight Was A Draw</div>
        }
      </div>
  }
}