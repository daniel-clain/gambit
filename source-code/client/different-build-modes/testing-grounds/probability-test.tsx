
import * as React from 'react';
import '../../styles/global.scss';
import { observer } from 'mobx-react';
import { Fight_View } from '../../views/game/fight-view/fight.view';
import { initialSetup, state } from './probability-test-service';
import './probability-test.scss'
import { FightersInfoPanel_C } from './fighters-info-panel';


initialSetup()
export const ProbabilityTest_C = observer(() => {
  return <>
    <FightersInfoPanel_C/>
    <Fight_View/>
  </>
       
})