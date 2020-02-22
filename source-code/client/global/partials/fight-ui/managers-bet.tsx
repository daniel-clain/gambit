import * as React from 'React';
import './managers-bets.scss'
import { ManagerDisplayInfo } from '../../../../interfaces/game-ui-state.interface';

interface ManagersBetProps{
  managers: ManagerDisplayInfo[]
}

export default function ManagersBets(props: ManagersBetProps){
  return (    
    <div className="managers-bets">
      {props.managers.map(manager =>
        <div className='managers-bet' key={manager.name}>
          <div className="manager">              
            <div className={`manager__image manager__image--${manager.image.split(' ').join('-').toLowerCase()}`}></div>
            <div className="manager__name">{manager.name}</div>
          </div>
          <div className="fighter-bet-on">
            <div className="fighter-bet-on__name">{manager.bet.fighterName ? manager.bet.fighterName : 'No Bet'}</div>
            <div className="fighter-bet-on__image"></div>
            {manager.bet && manager.bet.size &&
              <div className="fighter-bet-on__amount">{manager.bet.size}</div>
            }
          </div>
        </div>
      )}
    </div>
  )
};
