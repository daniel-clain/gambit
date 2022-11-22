
import * as React from 'react';
import '../../styles/global.scss';
import { observer } from 'mobx-react';
import { fight, getProbabilities, setMemoryOfBehindElapsed, state, update } from './probability-test-service';
import { useEffect } from 'react';
import FacingDirection from '../../../types/fighter/facing-direction';


export const FightersInfoPanel_C = observer(() => {
  //const {serverUIState:{serverGameUIState}} = frontEndState
  //const {fighterFightStates} = serverGameUIState!.fightUIState
  
  useEffect(()=>{}, [state.updates])
  


  return (
    <fighters-info-panel>
      <button
        onClick={() => getProbabilities()}
      >
        Get Probabilities
      </button>
      {fight.fighters.map(fighter => {
        const {fighting, name} = fighter
        const {movement, stats} = fighting
        const {coords} = movement
        return (
          <fighter-info class='container' key={fighter.name}>
            <t-heading>{name}</t-heading>
            
            <t-container>
              <t-heading>Stats</t-heading>
              <t-row>
                <t-label>Intelligence</t-label>
                <t-data>            
                  <input 
                    type='number'
                    onChange={({target: {value}}) => {
                      stats.baseIntelligence = Number(value)
                      update()
                    }}
                    value={stats.intelligence}
                  />
                </t-data>
              </t-row>
            </t-container>
            <t-container>
              <t-heading>Fighting</t-heading>
              <t-row>
                <t-label>Memory of behind elapsed</t-label>
                <t-data>   
                  <input 
                    type='number'
                    onChange={({target: {value}}) => {
                      setMemoryOfBehindElapsed(Number(value))
                      update()
                    }}
                    value={fighting.timers.get('memory of enemy behind').timeElapsed}
                  />
                </t-data>
              </t-row>
              <t-row>
                <t-label>Facing</t-label>
                <t-data>            
                <select
                  value={fighting.facingDirection}
                  onChange={(e) => {
                    fighting.facingDirection=e.target.value as FacingDirection
                    update()
                  }} 
                >
                  {['left', 'right'].map(dir => 
                    <option
                      key={dir}
                      value={dir}
                    >{dir}</option>
                  )}
                </select>
                </t-data>
              </t-row>
              <t-row>
                <t-label>Spirit</t-label>
                <t-data>            
                  <input 
                    type='number'
                    onChange={({target: {value}}) => {
                      fighting.spirit = Number(value)
                      update()
                    }}
                    value={fighting.spirit}
                  />
                </t-data>
              </t-row>
              <t-row>
                <t-label>Stamina</t-label>
                <t-data>
                  <input 
                    onChange={({target: {value}}) => {
                      fighting.stamina = Number(value)
                      update()
                    }}
                    value={fighting.stamina}
                  />
                </t-data>
              </t-row>
            </t-container>
            <t-container>
              <t-heading>Movement</t-heading>
              <t-row>
                <t-label>X</t-label>
                <t-data>            
                  <input 
                    type='number'
                    onChange={({target: {value}}) => {
                      coords.x = Number(value)
                      update()
                    }}
                    value={coords.x}
                  />
                </t-data>
              </t-row>
              <t-row>
                <t-label>Y</t-label>
                <t-data>
                  <input 
                    onChange={({target: {value}}) => {
                      coords.y = Number(value)
                      update()
                    }}
                    value={coords.y}
                  />
                </t-data>
              </t-row>
            </t-container>
          </fighter-info>
        )

      })}
    </fighters-info-panel>
  )
       
})