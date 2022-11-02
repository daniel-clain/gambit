
import * as React from 'react';

import './fighter-card.scss';
import '../modal-card.scss';
import {AbilityBlock} from '../../partials/ability-block/ability-block';
import Fights from '../../partials/fights-and-wins/fights';
import Wins from '../../partials/fights-and-wins/wins';
import { ClientAbility } from '../../../../../../../game-components/abilities-general/ability';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { Modal } from '../../partials/modal/modal';
import { InfoBox } from '../../partials/info-box/info-box';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';
import { getAbilitiesThatCanTargetThis } from '../../../../../../front-end-service/ability-service-client';
import { toJS } from 'mobx';



export const FighterCard = observer(() => {
  const {serverUIState: {serverGameUIState},
    clientUIState: {
      clientPreGameUIState: {clientName},
      clientGameUIState: {
        clientManagerUIState: {activeModal}
      }
    }
  } = frontEndState
  
  const {
    enoughFightersForFinalTournament,
    playerManagerUIState
  } = serverGameUIState!

  const {
    managerInfo: {knownFighters, fighters},
    delayedExecutionAbilities,
    jobSeekers,
    week
  } = playerManagerUIState!

  const fighterName = activeModal!.data as string
  const thisPlayersName = clientName
  const allFighters = [...knownFighters, ...fighters]
  const fighter = allFighters.find(f => f.name == fighterName)!
  const isYourFighter = fighter.manager?.lastKnownValue == thisPlayersName

  const goalContractInfo = fighter.goalContract && [        
    {label: 'Number of weeks', value: fighter.goalContract.numberOfWeeks},
    {label: 'Weekly cost', value: fighter.goalContract.weeklyCost}
  ]

  const abilitiesThatTargetFighter = getAbilitiesThatCanTargetThis(fighter)
  

  let infoBoxList: InfoBoxListItem[]

  if (isYourFighter) {
    const {strength, fitness, intelligence, aggression} = fighter
    infoBoxList = [
      { label: 'Strength', value: strength?.lastKnownValue },
      { label: 'Fitness', value: fitness?.lastKnownValue },
      { label: 'Intelligence', value: intelligence?.lastKnownValue },
      { label: 'Aggression', value: aggression?.lastKnownValue },
      { label: 'Manager', value: thisPlayersName }
    ]
  }
  else {
    const { strength, fitness, intelligence, aggression, manager } = fighter
    infoBoxList = [
      { label: 'Strength', value: strength ? `${strength.lastKnownValue} (${strength.weeksSinceUpdated})` : 'unknown' },
      { label: 'Fitness', value: fitness ? `${fitness.lastKnownValue} (${fitness.weeksSinceUpdated})` : 'unknown' },
      { label: 'Intelligence', value: intelligence ? `${intelligence.lastKnownValue} (${intelligence.weeksSinceUpdated})` : 'unknown' },
      { label: 'Aggression', value: aggression ? `${aggression.lastKnownValue} (${aggression.weeksSinceUpdated})` : 'unknown' },
      { label: 'Manager', value: manager ? `${manager.lastKnownValue ? manager.lastKnownValue : 'none'} (${manager.weeksSinceUpdated})` : 'unknown' }
    ]
  }


  
  const contractInfo = isYourFighter && [
    {label: 'Weeks remaining', value: fighter.activeContract.weeksRemaining},
    {label: 'Cost per week', value: fighter.activeContract.weeklyCost}
  ] || undefined


  return (
    <Modal>
      <div className='card fighter-card'>
        <div className='card__heading heading'>{fighter.name}</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left fighter-card__image'></div>
          <div className='card__two-columns__right'>
            {isYourFighter ?
              <div className='fighter-card__fight-experience'>
                <Fights numberOfFights={fighter.numberOfFights.lastKnownValue}/>
                <Wins numberOfWins={fighter.numberOfWins.lastKnownValue}/>
              </div>
              :
              <div className='fighter-card__fight-experience'>
                <Fights 
                  numberOfFights={
                    fighter.numberOfFights ?
                    `${fighter.numberOfFights.lastKnownValue} 
                    (${fighter.numberOfFights.weeksSinceUpdated})`
                    : '?'
                  }
                />
                <Wins 
                  numberOfWins={
                    fighter.numberOfWins ?
                    `${fighter.numberOfWins.lastKnownValue} 
                    (${fighter.numberOfWins.weeksSinceUpdated})`
                    : '?'
                  }
                />
              </div>
            }
            <div className='fighter-card__stats'>
              <InfoBox
                heading={`${!isYourFighter ? 'Known ' : ''}Stats`}
                list={infoBoxList}
              />
            </div>
            {goalContractInfo && 
              <InfoBox 
                heading={'Goal Contract'}
                list={goalContractInfo}
              />
            }
            {fighter.activeContract &&
              <InfoBox 
                heading={'Active Contract'}
                list={contractInfo}
              />
            }
          </div>
        </div>

        <div className='heading'>Options</div>
        <div className='card__options'>
          {abilitiesThatTargetFighter.map(
            (clientAbility: ClientAbility) => (
              <AbilityBlock
                key={clientAbility.name}
                abilityData={{
                  name: clientAbility.name,
                  target: fighter,
                  source: undefined
                }}
              />
            )
          )}
        </div>

      </div >
    </Modal>
  )
})