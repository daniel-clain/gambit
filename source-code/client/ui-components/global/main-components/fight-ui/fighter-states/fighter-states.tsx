import * as React from 'react'
import { KnownFighterStats } from "../../../../../../interfaces/game-ui-state.interface";
import './fighter-states.scss'

interface FighterStateData{  
  name: string
  poisoned: boolean
  injured: boolean
  doped: boolean
  managerKnownStats: KnownFighterStats
}

export interface FighterStatesProps{
  fighterStates: FighterStateData[]
}

export default function FighterStates(props: FighterStatesProps){
  return <div className='fighter-states'>
    {props.fighterStates.map(fighter => 
      <div className='fighter-state' key={fighter.name}>
        <div className="fighter-state__name">{fighter.name}</div>
        <div className="fighter-state__image"></div>
        {fighter.managerKnownStats &&
          <div className="fighter-state__stats">
            <div className="fighter-state__stats__fighter-stat fighter-state__stats__strength">
              <span className="fighter-state__stats__fighter-stat__label">Strength:</span>
              {fighter.managerKnownStats.strength ? fighter.managerKnownStats.strength.lastKnownValue : 'unknown'}
            </div>
            <div className="fighter-state__stats__fighter-stat fighter-state__stats__fitness">
              <span className="fighter-state__stats__fighter-stat__label">Fitness:</span>
              {fighter.managerKnownStats.fitness ? fighter.managerKnownStats.fitness.lastKnownValue : 'unknown'}
            </div>
            <div className="fighter-state__stats__fighter-stat fighter-state__stats__agression">
              <span className="fighter-state__stats__fighter-stat__label">Agression:</span>
              {fighter.managerKnownStats.aggression ? fighter.managerKnownStats.aggression.lastKnownValue : 'unknown'}
            </div>
            <div className="fighter-state__stats__fighter-stat fighter-state__stats__intelligence">
              <span className="fighter-state__stats__fighter-stat__label">Intelligence:</span>
              {fighter.managerKnownStats.intelligence ? fighter.managerKnownStats.intelligence.lastKnownValue : 'unknown'}
            </div>
            <div className="fighter-state__stats__fighter-stat fighter-state__stats__fights">
              <span className="fighter-state__stats__fighter-stat__label">Fights:</span>
              {fighter.managerKnownStats.numberOfFights ? fighter.managerKnownStats.numberOfFights.lastKnownValue : 'unknown'}
            </div>
            <div className="fighter-state__stats__fighter-stat fighter-state__stats__fights-won">
              <span className="fighter-state__stats__fighter-stat__label">Fights Won:</span>
              {fighter.managerKnownStats.numberOfWins ? fighter.managerKnownStats.numberOfWins.lastKnownValue : 'unknown'}
            </div>
          </div>
        }
        <div className='fighter-state__state'>
          {fighter.poisoned && <div className="fighter-state__state__poisoned-icon"></div>}
          {fighter.injured && <div className="fighter-state__state__injured-icon"></div>}
          {fighter.doped && <div className="fighter-state__state__doped-icon"></div>}
        </div>
      </div>
    )}
  </div>
}