import * as React from 'react'
import { useState } from 'react'
import './fighter-states.scss'
import { hot } from 'react-hot-loader/root';
import { FighterStateData } from '../../../../../../interfaces/front-end-state-interface';

export interface FighterStatesProps {
  fighterStates: FighterStateData[]
}

export const FighterStates = hot(({ fighterStates }: FighterStatesProps) => {
  let [isHidden, setIsHidden] = useState(true)
  return <>
    <div
      className={`fighter-states ${isHidden ? 'is-hidden' : ''}`}
      onClick={() => setIsHidden(!isHidden)}
    >
      {fighterStates?.map(fighter =>
        <div className='fighter-state' key={fighter.name}>
          <div className="fighter-state__name">{fighter.name}</div>
          <div className="fighter-state__image"></div>
          {fighter &&
            <div className="fighter-state__stats">
              <div className="fighter-state__stats__fighter-stat fighter-state__stats__strength">
                <span className="fighter-state__stats__fighter-stat__label">Strength:</span>
                {fighter.strength ? fighter.strength.lastKnownValue : 'unknown'}
              </div>
              <div className="fighter-state__stats__fighter-stat fighter-state__stats__fitness">
                <span className="fighter-state__stats__fighter-stat__label">Fitness:</span>
                {fighter.fitness ? fighter.fitness.lastKnownValue : 'unknown'}
              </div>
              <div className="fighter-state__stats__fighter-stat fighter-state__stats__agression">
                <span className="fighter-state__stats__fighter-stat__label">Agression:</span>
                {fighter.aggression ? fighter.aggression.lastKnownValue : 'unknown'}
              </div>
              <div className="fighter-state__stats__fighter-stat fighter-state__stats__intelligence">
                <span className="fighter-state__stats__fighter-stat__label">Intelligence:</span>
                {fighter.intelligence ? fighter.intelligence.lastKnownValue : 'unknown'}
              </div>
              <div className="fighter-state__stats__fighter-stat fighter-state__stats__fights">
                <span className="fighter-state__stats__fighter-stat__label">Fights:</span>
                {fighter.numberOfFights ? fighter.numberOfFights.lastKnownValue : 'unknown'}
              </div>
              <div className="fighter-state__stats__fighter-stat fighter-state__stats__fights-won">
                <span className="fighter-state__stats__fighter-stat__label">Fights Won:</span>
                {fighter.numberOfWins ? fighter.numberOfWins.lastKnownValue : 'unknown'}
              </div>
            </div>
          }
          <div className='fighter-state__state'>
            {fighter.hallucinating || fighter.sick && <div className="fighter-state__state__poisoned-icon"></div>}
            {fighter.injured && <div className="fighter-state__state__injured-icon"></div>}
            {fighter.doping && <div className="fighter-state__state__doped-icon"></div>}
          </div>
        </div>
      )}
    </div>
  </>
})