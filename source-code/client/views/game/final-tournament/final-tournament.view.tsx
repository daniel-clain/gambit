import * as React from 'react';
import { Fight_View } from '../fight-view/fight.view';
import { MatchupName } from '../../../../game-components/week-controller/final-tournament/final-tournament';
import './final-tournament.scss'
import { frontEndState } from '../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';
import { toCamelCase } from '../../../../helper-functions/helper-functions';

export const FinalTournament_View = observer(() => {
  const {serverUIState: {serverGameUIState}} = frontEndState

  const {finals, semiFinals, quarterFinals, showTournamentBoard} = serverGameUIState!.finalTournamentBoard
  return showTournamentBoard ? 
    <div className="final-tournament-board-container">
      <div className="final-tournament-board">
        {finals.winner ? 
          <div className="tournament-winner">Winner <br/>{finals.winner?.name}!</div>
        : ''}
        <div className='fighter-name finalist fighter1'>{finals.fighter1?.name}</div>
        <div className='fighter-name finalist fighter2'>{finals.fighter2?.name}</div>

        {semiFinals?.map(semiFinal => [     
          <div 
            key={`fighter1-${semiFinal.matchupName}`} 
            className={`fighter-name ${toCamelCase(semiFinal.matchupName)} fighter1`}
          >
            {semiFinal.fighter1?.name}
          </div>, 
          <div 
            key={`fighter2-${semiFinal.matchupName}`} 
            className={`fighter-name ${toCamelCase(semiFinal.matchupName)} fighter2`}
          >
            {semiFinal.fighter2?.name}
          </div>
        ])}

        {quarterFinals.map(quarterFinal => [     
          <div 
            key={`fighter1-${quarterFinal.matchupName}`} 
            className={`fighter-name ${toCamelCase(quarterFinal.matchupName)} fighter1`}
          >
            {quarterFinal.fighter1?.name}
          </div>,   
          <div 
            key={`fighter2-${quarterFinal.matchupName}`} 
            className={`fighter-name ${toCamelCase(quarterFinal.matchupName)} fighter2`}
          >
            {quarterFinal.fighter2?.name}
          </div>
        ])}
          
      </div>
    </div> :
    <Fight_View />

})
