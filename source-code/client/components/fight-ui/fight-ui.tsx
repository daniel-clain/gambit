
import * as React from 'react';
import FighterComponent from './fighter/fighter.component';
import './fight.scss'
import OctagonBoundaries from './octagon-boundaries';
import { FightState } from '../../../classes/game/fight/fight';

export interface FightUiProps{
  fightState: FightState
}

export default class FightUi extends React.Component<FightUiProps>{
  
  render(){
    console.log('this.props.fightUiState :', this.props.fightState);
    const {startCountdown, timeRemaining, fighters, report} = this.props.fightState                                   
    
    
    if(this.props.fightState){
      return (
        <div className='fight'>
          {startCountdown != 0 && 
            <div className='fight__count-down'>{startCountdown}</div>
          }
          {startCountdown == 0 && timeRemaining != 0 && 
            <div className='fight__time-remaining'>Time Remaining: {timeRemaining}</div>
          }
          <OctagonBoundaries fighters={this.props.fightState.fighters}/>
          {report && report.winner && 
            <div className='fight__winner'>{report.winner} Wins!</div>
          }
          {timeRemaining == 0 && report && !report.winner &&
            <div className='fight__winner'>Fight Was A Draw</div>
          }
        </div>
      )
    }
  }
}