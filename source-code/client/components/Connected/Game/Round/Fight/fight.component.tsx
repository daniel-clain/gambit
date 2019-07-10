import { Component } from "react";
import IMessageService from "../../../../../../interfaces/message-service.interface";
import FighterSkeleton from "../../../../../../interfaces/game/fighter/fighter-skeleton";
import FightSkeleton from "../../../../../../interfaces/game/fight-skeleton";
import styled from 'styled-components'
import FighterComponent from "./fighter/fighter.component";
import * as React from 'react'



const Fight = styled.div`
&.fight{
  position: relative;
  height: 100%;
  background-color: #efefef;

  &__count-down, &__winner, &__time-remaining{
    position: absolute;
    text-shadow: 1px 1px 2px #000;
    font-size: 4rem;
    width: 20rem;
    text-align: center;
    top: 2rem;
    left: 0px;
    right: 0px;
    color: #3f3;
    z-index: 4;
    margin: auto;
  }      

  &__time-remaining{
    font-size: 1.7rem;
    width: 14rem;
    text-align: left;
  }
}
`
const Arena = styled.div`
  position: relative;
  margin: auto;
  width: 1217px;
  height: 798px;
  .arena{
    &__behind{
      z-index: 1;
      position: absolute;
      background-image: url('/images/fight-arena-behind.png');
      width: 100%;
      height: 100%;
    }
    &__fight-area{
      z-index: 2;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    &__infront{
      z-index: 3;
      position: absolute;
      background-image: url('/images/fight-arena-infront.png');
      width: 100%;
      height: 100%;
      
    }
}
`

type FightProps = {
  messageService: IMessageService
}
type FightState = {
  fight: FightSkeleton
}


export default class FightComponent extends Component<FightProps> {

  state: FightState = {
    fight: null
  }

  constructor(props){
    super(props)
    this.props.messageService.onReceiveFightUpdates((fightSkeleton: FightSkeleton) => 
      this.setState({fight: fightSkeleton})
    )
  }
  
  render(){              
    const {fight} = this.state                                   
    let countDown: number
    let timeRemaining: number
    let fighters: FighterSkeleton[]
    let winner: FighterSkeleton
    
    if(fight){      
      countDown = fight.countDown
      timeRemaining = fight.timeRemaining
      fighters = fight.fighters
      winner = fight.winner
    }    
    
    return (
      <div>
        {fight && 
        <Fight className='fight'>
          {countDown != 0 && 
            <div className='fight__count-down'>{countDown}</div>
          }
          {countDown == 0 && timeRemaining != 0 && 
            <div className='fight__time-remaining'>Time Remaining: {timeRemaining}</div>
          }
          <Arena className='arena'>
            <div className='arena__behind'></div>
            <div className='arena__fight-area'>
            {
              fighters.map(fighter => 
                <FighterComponent fighter={fighter} key={fighter.name}></FighterComponent>
              )
            }
            </div>
            <div className='arena__infront'></div>
          
          </Arena>
          {winner && 
            <div className='fight__winner'>{winner.name} Wins!</div>
          }
          {timeRemaining == 0 && !winner &&
            <div className='fight__winner'>Fight Was A Draw</div>
          }
        </Fight>}
      </div>
    )
  }
}