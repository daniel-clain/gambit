import * as React from 'react';
import './managers-bets.scss'
import { useEffect, useState } from 'react';
import { MoneyRain } from './money-rain';
import { ManagersBet, FightReport } from '../../../../../../interfaces/front-end-state-interface';
import { ManagerInfo } from '../../../../../../game-components/manager';

interface ManagersBetProps {
  managersBets: ManagersBet[]
  report: FightReport
  isDisplay?: boolean
}

export const ManagersBets_C = ({ managersBets, report, isDisplay }: ManagersBetProps) => {
  let [isHidden, setIsHidden] = useState(isDisplay?false:true)

  const hasWinnings = report?.managerWinnings?.some(({ winnings }) => winnings > 0)


  const managerWinnings = (manager: ManagersBet) => {
    return report?.managerWinnings?.find(m => m.managerName == manager.name)?.winnings
  }


  return (
    <div
      className={`
      managers-bets 
      ${isHidden ? 'is-hidden' : ''} 
      ${hasWinnings ? 'has-winnings' : ''}
      ${report?.draw ? 'was-draw' : ''}
      `}
      onClick={() => setIsHidden(!isHidden)}
    >
      {managersBets?.map(manager =>
        <div className='managers-bet' key={manager.name}>
          <MoneyRain money={managerWinnings(manager)} />
          <div className="managers-bet__manager">
            <div className={`managers-bet__manager__image managers-bet__manager__image--${manager.image.toLowerCase().replace(' ', '-')}`}></div>
            <div className="managers-bet__manager__name">{manager.name}</div>
          </div>
          {manager.bet ?
            <div className="fighter-bet-on">
              <div className="fighter-bet-on__name">{manager.bet.fighterName}</div>
              <div className="fighter-bet-on__image"></div>
              <div className="fighter-bet-on__amount">{manager.bet.size}</div>
            </div>
            : 
            <div className="fighter-bet-on">No Bet</div>
          }
        </div>
      )}
    </div>
  )
};


