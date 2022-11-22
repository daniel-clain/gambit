
import * as React from 'react';
import { DirectionTest_C } from './direction-test';
import { useState } from 'react';
import { ProbabilityTest_C } from './probability-test';
import './testing-grounds.scss'


export const TestingGrounds_C = () => {
  const [view, setView] = useState('direction')
  return <testing-grounds>
    <view-buttons>
      <button onClick={() => setView('probability')}>probability</button>
      <button onClick={() => setView('direction')}>direction</button>
    </view-buttons>
    <view-container style={{position: 'relative'}}>
      {view == 'probability' ? <ProbabilityTest_C/> : ''}
      {view == 'direction' ? <DirectionTest_C/> : ''}
    </view-container>
  </testing-grounds>
       
}