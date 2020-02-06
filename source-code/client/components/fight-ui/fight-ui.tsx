import * as React from 'react';
import './fight.scss'

import { FightState } from '../../../game-components/fight/fight';
import FighterFightState from '../../../interfaces/game/fighter-fight-state-info';
import FighterComponent from './fighter/fighter.component';

export interface FightUiProps{
  fightState: FightState
}

export default class FightUi extends React.Component<FightUiProps>{
  
  render(){
    const {startCountdown, timeRemaining, fighters, report} = this.props.fightState                                   
    
    
    if(this.props.fightState){
      return (
        <div className='fight-ui'>
          <div className="fight-ui__content">
            
            <div className="container">
              {startCountdown != 0 && 
                <div className='fight__count-down'>{startCountdown}</div>
              }
              {startCountdown == 0 && timeRemaining != 0 && 
                <div className='fight__time-remaining'>Time Remaining: {timeRemaining}</div>
              }
              <div className="background-top"></div>
              <div className="background-bottom"></div>
              <div className="octagon">
                {fighters.map((fighter: FighterFightState, i) => 
                  <FighterComponent key={i} fighterFightState={fighter}/>
                )}
              </div>
            </div>
            {report && report.winner && 
              <div className='fight__winner'>{report.winner} Wins!</div>
            }
            {timeRemaining == 0 && report && !report.winner &&
              <div className='fight__winner'>Fight Was A Draw</div>
            }
          </div>
          <div className="turn-phone-message">
            <div className="image">Turn your phone to portrait view</div> 
          </div>
        </div>
      )
    }
  }
}