import * as React from 'react';
import { FightUIState } from "../../../../../interfaces/front-end-state-interface"
import {Fight_View} from '../../../game/fight-view/fight.view'
import './display-fight-ui.scss';

interface DisplayFightUiProps {
  fightUiData: FightUIState
}

export default class DisplayFightUi extends React.Component<DisplayFightUiProps>{


  render() {

    return (
      <div className='display-fight-ui'>
        <Fight_View isDisplay={true} />
      </div>
    )
  }
}