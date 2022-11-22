
import * as React from 'react';
import './direction-test.scss';
import { observer } from 'mobx-react';
import { state } from './direction-test-service';

export const DirectionTest_C = observer(() => {
  const {enemies, directionAway} = state

  return (<direction-test>
    
    <origin-point>
      <direction-away style={{
        transform: `rotate(${directionAway}deg)`
      }}/>
      <enemy-one class='enemy-point' style={{
        transform: `rotate(${enemies.enemy1dir}deg)`,
        height: `${enemies.enemy1dist}px`
      }}/>
      <enemy-two class='enemy-point' style={{
        transform: `rotate(${enemies.enemy2dir}deg)`,
        height: `${enemies.enemy2dist}px`
      }}/>
      <edge-point class='edge-point' style={{
        transform: `rotate(${state.edgeDir}deg)`,
        height: `${state.edgeDist}px`
      }}/>
    </origin-point>

    <directions-info-panel>
      <t-container>
        <t-heading>flanking test</t-heading>
        <t-row>
          <t-label>enemy 1 dir</t-label>
          <t-data>            
            <input 
              type='number'
              onChange={({target: {value}}) => {
                enemies.enemy1dir = Number(value)
              }}
              value={enemies.enemy1dir}
            />
          </t-data>
        </t-row>
        <t-row>
          <t-label>enemy 1 dist</t-label>
          <t-data>            
            <input 
              type='number'
              onChange={({target: {value}}) => {
                enemies.enemy1dist = Number(value)
              }}
              value={enemies.enemy1dist}
            />
          </t-data>
        </t-row>
        <t-row>
          <t-label>enemy 2 dir</t-label>
          <t-data>            
            <input 
              type='number'
              onChange={({target: {value}}) => {
                enemies.enemy2dir = Number(value)
              }}
              value={enemies.enemy2dir}
            />
          </t-data>
        </t-row>
        <t-row>
          <t-label>enemy 2 dist</t-label>
          <t-data>            
            <input 
              type='number'
              onChange={({target: {value}}) => {
                enemies.enemy2dist = Number(value)
              }}
              value={enemies.enemy2dist}
            />
          </t-data>
        </t-row><t-row>
          <t-label>edge dir</t-label>
          <t-data>            
            <input 
              type='number'
              onChange={({target: {value}}) => {
                state.edgeDir = Number(value)
              }}
              value={state.edgeDir}
            />
          </t-data>
        </t-row>
        <t-row>
          <t-label>edge dist</t-label>
          <t-data>            
            <input 
              type='number'
              onChange={({target: {value}}) => {
                state.edgeDist = Number(value)
              }}
              value={state.edgeDist}
            />
          </t-data>
        </t-row>
      </t-container>
    </directions-info-panel>
  </direction-test>)
})