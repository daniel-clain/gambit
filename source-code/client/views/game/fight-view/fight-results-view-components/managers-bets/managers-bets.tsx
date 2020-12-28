import * as React from 'react';
import './managers-bets.scss'
import { ManagersBet } from '../../../../../../interfaces/game/managers-bet';



interface ManagersBetProps{
  managersBets: ManagersBet[]
}

export const ManagersBets = ({managersBets}: ManagersBetProps) => {
  return (    
    <div className="managers-bets">
      {managersBets.map(manager =>
        <div className='managers-bet' key={manager.name}>
          <div className="manager">              
            <div className={`manager__image manager__image--${manager.image.toLowerCase().replace(' ', '-')}`}></div>
            <div className="manager__name">{manager.name}</div>
          </div>
          <div className="fighter-bet-on">
            <div className="fighter-bet-on__name">{(manager.bet && manager.bet.fighterName) ? manager.bet.fighterName : 'No Bet'}</div>
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
