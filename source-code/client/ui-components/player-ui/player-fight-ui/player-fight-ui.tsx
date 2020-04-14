import * as React from 'react';
import { FightUiData } from '../../../../interfaces/game/fight-ui-data';
import FightUi from '../../global/main-components/fight-ui/fight-ui';

interface PlayerFightUiProps{
  fightUiData: FightUiData
}

export default function PlayerFightUi(props: PlayerFightUiProps){
  return <>
    <div className='player-fight-ui'>
      <FightUi fightUiData={props.fightUiData}/>
    </div>
  </>
}