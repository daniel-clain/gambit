import * as React from 'react';
import './fight.scss'
import { FightUiData } from '../../../../../interfaces/game/fight-ui-data';
import { wait } from '../../../../../helper-functions/helper-functions';
import Octagon from '../../../../../game-components/fight/octagon';
import ManagersBets from './managers-bets/managers-bets';
import Coords from '../../../../../interfaces/game/fighter/coords';
import FighterFightState from '../../../../../interfaces/game/fighter-fight-state-info';
import FighterComponent from './fighter/fighter.component';
import FighterStates, { FighterStatesProps } from './fighter-states/fighter-states';


type FightExplosionAnimationStages =
'start' |
'grow' |
'shrink-and-fade' |
'removed '

interface FightUiState{
  fightExplosionAnimationStage: FightExplosionAnimationStages
}

interface FightUiProps{
  fightUiData: FightUiData
}

export default class FightUi extends React.Component<FightUiProps, FightUiState>{

  state: FightUiState = {
    fightExplosionAnimationStage: 'removed '
  }

  componentDidMount(){
    this.doFightExplosionAnimation()
  }

  async doFightExplosionAnimation(){
    this.setState(({fightExplosionAnimationStage: 'start'}))  
    await wait(400)
    this.setState(({fightExplosionAnimationStage: 'grow'}))  
    await wait(800)
    this.setState(({fightExplosionAnimationStage: 'shrink-and-fade'}))  
    await wait(400)
    this.setState(({fightExplosionAnimationStage: 'removed '}))
  }
  
  render(){
    const {startCountdown, timeRemaining, fighters, report, managersBets} = this.props.fightUiData      
    
    const cornerPoints = []

    for(let key in Octagon.points){
      cornerPoints.push(Octagon.points[key])
    }

    const fighterStatesProps: FighterStatesProps = {
      fighterStates: this.props.fightUiData.fighters.map(fighter => {
        return {
          name: fighter.name,
          poisoned: fighter.poisoned,
          injured: fighter.injured,
          doped: fighter.doped,
          managerKnownStats: fighter.managerKnownStats
        }
      })
    }
    
    return (
      <div className='fight-ui'>
        
        <FighterStates fighterStates={fighterStatesProps.fighterStates} />
        {managersBets ? <ManagersBets managersBets={managersBets}/> : ''}
        <div className="fight-ui__content">
          
          <div className="container">
            {startCountdown != 0 && 
              <div className='fight-ui__count-down'>{startCountdown}</div>
            }
            {startCountdown == 0 && timeRemaining != 0 &&
              <div className='fight-ui__time-remaining'>Time Remaining: {timeRemaining}</div>
            }
            <div className={`fight-explosion fight-explosion--${this.state.fightExplosionAnimationStage}`}></div>
            <div className="background-top"></div>
            <div className="background-bottom"></div>
            <div className="octagon">
              {cornerPoints.map((point: Coords, index) => 
                <div className="point" key={index} style={{left: point.x, bottom: point.y}}></div>
              )}
              {fighters.map((fighter: FighterFightState, i) => 
                <FighterComponent key={i} fighterFightState={fighter}/>
              )}
            </div>
          </div>
          {report && report.winner && 
            <div className='fight-ui__winner'>{report.winner.name} Wins!</div>
          }
          {timeRemaining == 0 && report && !report.winner &&
            <div className='fight-ui__winner'>Fight Was A Draw</div>
          }
        </div>
        <div className="turn-phone-message">
          <div className="image">Turn your phone to landscape view</div> 
        </div>
      </div>
    )
  }
}