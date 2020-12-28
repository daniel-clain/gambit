import * as React from 'react';
import {connect} from 'react-redux'
import { useState } from 'react';
import Octagon from '../../../../game-components/fight/octagon';
import { wait } from '../../../../helper-functions/helper-functions';
import FighterFightState from '../../../../interfaces/game/fighter-fight-state-info';
import Coords from '../../../../interfaces/game/fighter/coords';
import './fight.view.scss'
import FighterStates, { FighterStateData, FighterStatesProps } from './fight-results-view-components/fighter-states/fighter-states';
import { FighterInfo } from '../../../../interfaces/server-game-ui-state.interface';
import { FightReport } from '../../../../interfaces/game/fight-report';
import { Bet } from '../../../../interfaces/game/bet';
import { ManagersBet } from '../../../../interfaces/game/managers-bet';
import { ManagersBets } from './fight-results-view-components/managers-bets/managers-bets';
import FighterComponent from './fight-results-view-components/fighter/fighter.component';
import { FrontEndState } from '../../../front-end-state/front-end-state';


type FightExplosionAnimationStages =
'start' |
'grow' |
'shrink-and-fade' |
'removed'


interface FightUiProps{
  startCountdown: number
  timeRemaining: number 
  fighterFightStates: FighterFightState[]
  knownFighterStates: FighterStateData[]
  report: FightReport
  managersBets: ManagersBet[]
}

const Fight_View = ({startCountdown, timeRemaining, fighterFightStates, report, managersBets, knownFighterStates}:FightUiProps) => {


  const [fightExplosionAnimationStage, setFightExplosionAnimationStage] = useState<FightExplosionAnimationStages>('removed')

    //doFightExplosionAnimation() 
    
    const cornerPoints = []

    for(let key in Octagon.points){
      cornerPoints.push(Octagon.points[key])
    }

    
  return (
    <div className='fight-ui'>
      
      <FighterStates fighterStates={knownFighterStates} />

      {managersBets && 
        <ManagersBets managersBets={managersBets}/>
      }

      <div className="fight-ui__content">
        
        <div className="container">
          {startCountdown != 0 && 
            <div className='fight-ui__count-down'>{startCountdown}</div>
          }
          {startCountdown == 0 && timeRemaining != 0 &&
            <div className='fight-ui__time-remaining'>Time Remaining: {timeRemaining}</div>
          }
          <div className={`fight-explosion fight-explosion--${fightExplosionAnimationStage}`}></div>
          <div className="background-top"></div>
          <div className="background-bottom"></div>
          <div className="octagon">
            {cornerPoints.map((point: Coords, index) => 
              <div className="point" key={Math.round(point.x + point.y)} style={{left: point.x, bottom: point.y}}></div>
            )}
            {fighterFightStates.map((fighter, i) => 
              <FighterComponent key={i} fighterFightState={fighter}/>
            )}
          </div>
        </div>
        {report?.winner && 
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
  
  async function doFightExplosionAnimation(){
    setFightExplosionAnimationStage('start')
    await wait(400)
    setFightExplosionAnimationStage('grow') 
    await wait(800)
    setFightExplosionAnimationStage('shrink-and-fade')
    await wait(400)
    setFightExplosionAnimationStage('removed')
  }
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {FightUIState: {
    startCountdown, timeRemaining, fighterFightStates, report, managersBets, knownFighterStates
  }}}
}: FrontEndState): FightUiProps => ({startCountdown, timeRemaining, fighterFightStates, report, managersBets, knownFighterStates})

export default connect(mapStateToProps)(Fight_View)