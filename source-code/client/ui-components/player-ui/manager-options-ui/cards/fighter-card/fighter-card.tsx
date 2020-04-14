
import * as React from 'react';

import './fighter-card.scss';
import '../modal-card.scss';
import { JobSeeker, FighterInfo, KnownFighter } from '../../../../../../interfaces/game-ui-state.interface';
import { AbilityData, ClientAbility } from '../../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../../game-components/manager';
import InfoBox from '../../partials/info-box/info-box';
import AbilityBlock from '../ability-block/ability-block';
import { InfoBoxListItem } from '../../../../../../interfaces/game/info-box-list';
import { abilityServiceClient } from '../../../../../../game-components/abilities-reformed/ability-service-client';
import Fights from '../../partials/fights-and-wins/fights';
import Wins from '../../partials/fights-and-wins/wins';


export interface FighterCardProps {
  jobSeekers: JobSeeker[]
  delayedExecutionAbilities: AbilityData[]
  selectedFighter: string
  managerInfo: ManagerInfo
  abilitySelected(abilityData: AbilityData)
}

export class FighterCard extends React.Component<FighterCardProps>{

  render() {
    const { selectedFighter, abilitySelected, managerInfo, delayedExecutionAbilities, jobSeekers } = this.props

    let knownFighter: KnownFighter = managerInfo.knownFighters.find(fighter => fighter.name == selectedFighter)

    const yourFighter: FighterInfo = managerInfo.fighters.find(fighter => fighter.name == selectedFighter)

    let goalContractInfo: InfoBoxListItem[]

    if(knownFighter){
      if(knownFighter.goalContract){
        goalContractInfo = [        
        {label: 'Number of weeks', value: knownFighter.goalContract.numberOfWeeks},
        {label: 'Weekly cost', value: knownFighter.goalContract.weeklyCost}
        ]
      }
    }

    
    if(yourFighter && yourFighter.goalContract){
      goalContractInfo = [        
      {label: 'Number of weeks', value: yourFighter.goalContract.numberOfWeeks},
      {label: 'Weekly cost', value: yourFighter.goalContract.weeklyCost}
      ]
    }


    const abilitiesFighterCanBeTheTargetOf: ClientAbility[] = abilityServiceClient.getAbilitiesFighterCanBeTheTargetOf(!!yourFighter)



    const offerContractAbility = abilityServiceClient.abilities.find(ability => ability.name == 'Offer Contract')

    if(
      (knownFighter && knownFighter.goalContract) || 
      (yourFighter && yourFighter.goalContract)
    )
      abilitiesFighterCanBeTheTargetOf.push(offerContractAbility)
    

    let infoBoxList: InfoBoxListItem[]

    if (yourFighter) {
      const {strength, fitness, intelligence, aggression, manager} = yourFighter
      infoBoxList = [
        { label: 'Strength', value: strength },
        { label: 'Fitness', value: fitness },
        { label: 'Intelligence', value: intelligence },
        { label: 'Aggression', value: aggression },
        { label: 'Manager', value: manager }
      ]
    }
    else {
      const { strength, fitness, intelligence, aggression, manager } = knownFighter.knownStats
      infoBoxList = [
        { label: 'Strength', value: strength ? `${strength.lastKnownValue} (${strength.roundsSinceUpdated})` : 'unknown' },
        { label: 'Fitness', value: fitness ? `${fitness.lastKnownValue} (${fitness.roundsSinceUpdated})` : 'unknown' },
        { label: 'Intelligence', value: intelligence ? `${intelligence.lastKnownValue} (${intelligence.roundsSinceUpdated})` : 'unknown' },
        { label: 'Aggression', value: aggression ? `${aggression.lastKnownValue} (${aggression.roundsSinceUpdated})` : 'unknown' },
        { label: 'Manager', value: manager ? `${manager.lastKnownValue ? manager.lastKnownValue : 'none'} (${manager.roundsSinceUpdated})` : 'unknown' }
      ]
    }

    const fighterName = yourFighter ? yourFighter.name : knownFighter.name

    
    let contractInfo: InfoBoxListItem[]
    
    if(yourFighter)
      contractInfo = [
        {label: 'Weeks remaining', value: yourFighter.activeContract.weeksRemaining},
        {label: 'Cost per week', value: yourFighter.activeContract.weeklyCost}
      ]

    return (
      <div className='card fighter-card'>
        <div className='card__heading heading'>{fighterName}</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left fighter-card__image'></div>
          <div className='card__two-columns__right'>
            {yourFighter ?
              <div className='fighter-card__fight-experience'>
                <Fights numberOfFights={yourFighter.numberOfFights}/>
                <Wins numberOfWins={yourFighter.numberOfWins}/>
              </div>
              :
              <div className='fighter-card__fight-experience'>                
                <Fights 
                  numberOfFights={
                    knownFighter.knownStats.numberOfFights ?
                    `${knownFighter.knownStats.numberOfFights.lastKnownValue} 
                    (${knownFighter.knownStats.numberOfFights.roundsSinceUpdated})`
                    : '?'
                  }
                />
                <Wins 
                  numberOfWins={
                    knownFighter.knownStats.numberOfWins ?
                    `${knownFighter.knownStats.numberOfWins.lastKnownValue} 
                    (${knownFighter.knownStats.numberOfWins.roundsSinceUpdated})`
                    : '?'
                  }
                />
              </div>
            }
            <div className='fighter-card__stats'>
              <InfoBox
                heading={`${!!knownFighter ? 'Known ' : ''}Stats`}
                list={infoBoxList}
              />
            </div>
            {goalContractInfo && 
              <InfoBox 
                heading={'Goal Contract'}
                list={goalContractInfo}
              />
            }
            {yourFighter &&
              <InfoBox 
                heading={'Active Contract'}
                list={contractInfo}
              />
            }
          </div>
        </div>

        <div className='heading'>Options</div>
        <div className='card__options'>
          {abilitiesFighterCanBeTheTargetOf.map(
            (clientAbility: ClientAbility) => (
              <AbilityBlock
                key={clientAbility.name}
                managerInfo={managerInfo}
                delayedExecutionAbilities={delayedExecutionAbilities}
                abilityData={{
                  name: clientAbility.name,
                  target: {
                    name: fighterName,
                    type: yourFighter ?
                      'fighter owned by manager' :
                      'fighter not owned by manager'
                  },
                  source: undefined
                }}
                onSelected={abilitySelected}
              />
            )
          )}
        </div>

      </div >
    )
  }
}

