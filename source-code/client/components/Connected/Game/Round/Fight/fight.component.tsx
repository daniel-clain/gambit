import { Component } from "react";
import IMessageService from "../../../../../../interfaces/message-service.interface";
import FighterSkeleton from "../../../../../../interfaces/game/fighter/fighter-skeleton";
import FightSkeleton from "../../../../../../interfaces/game/fight-skeleton";
import styled from 'styled-components'
import FighterComponent from "./fighter/fighter.component";
import * as React from 'react'
import fightArenaBehind from './images/fight-arena-behind.png'
import fightArenaInfront from './images/fight-arena-infront.png'



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
  fightArenaBehindImage
  fightArenaInfront

  constructor(props){
    super(props)
    this.props.messageService.onReceiveFightUpdates((fightSkeleton: FightSkeleton) => 
      this.setState({fight: fightSkeleton})
    )
    this.fightArenaBehindImage = fightArenaBehind
    this.fightArenaInfront = fightArenaInfront
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

    

    const Fight = styled.div`
    .fight{
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
    console.log('fightArenaBehind :', fightArenaBehind);
    const Arena = styled.div`
    .arena{
      position: relative;
      margin: auto;
      width: 1217px;
      height: 798px;
      &--behind{
        z-index: 1;
        position: absolute;
        background-image: url(${fightArenaBehind});
        width: 100%;
        height: 100%;
      }
      &--fight-area{
        z-index: 2;
        position: absolute;
        width: 100%;
        height: 100%;
      }
      &--infront{
        z-index: 3;
        position: absolute;
        background-image: url(${fightArenaInfront});
        width: 100%;
        height: 100%;
        
      }
    }
    `
    
    return (
      <div>
        <img src={fightArenaBehind}/>
        {fight && 
        <Fight className='fight'>
          {countDown != 0 && 
            <div className='fight__count-down'>{countDown}</div>
          }
          {countDown == 0 && timeRemaining != 0 && 
            <div className='fight__time-remaining'>Time Remaining: {timeRemaining}</div>
          }
          <Arena className='arena'>
            <div className='arena--behind'></div>
            <div className='arena--fight-area'>
            {
              fighters.map(fighter => 
                <FighterComponent fighter={fighter} key={fighter.name}></FighterComponent>
              )
            }
            </div>
            <div className='arena--infront'></div>
          
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