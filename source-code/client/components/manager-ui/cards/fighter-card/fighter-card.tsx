
import * as React from 'react';

import { FighterInfo, KnownFighterStats, JobSeeker } from '../../../../../interfaces/game-ui-state.interface';
import { ManagerInfo } from '../../../../../game-components/manager/manager';
import AbilityBlock from './../ability-block/ability-block';
import './fighter-card.scss';
import './../modal-card.scss';
import InfoBox from '../../partials/info-box/info-box';
import { InfoBoxListItem } from '../../../../../interfaces/game/info-box-list';
import { abilityServiceClient } from '../../../../../game-components/abilities-reformed/ability-service-client';
import { ClientAbility, AbilityData, AbilityName } from '../../../../../game-components/abilities-reformed/ability';
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

    let fighterOwnedByManager: boolean

    let fighter: any = managerInfo.knownFighters.find(fighter => fighter.name == selectedFighter)

    if (!fighter) {
      const fighterInfo: FighterInfo = managerInfo.fighters.find(fighter => fighter.name == selectedFighter)
      if (fighterInfo) {
        fighterOwnedByManager = true
        fighter = fighterInfo
      }
    }



    const abilitiesFighterCanBeTheTargetOf: ClientAbility[] = abilityServiceClient.getAbilitiesFighterCanBeTheTargetOf(fighterOwnedByManager)

    const fighterIsAJobSeeker: boolean = jobSeekers.some(jobSeeker => jobSeeker.name == selectedFighter)

    const lastWeekOfContract = fighter.activeContract && fighter.activeContract.weeksRemaining == 0

    const offerContractAbility = abilityServiceClient.abilities.find(ability => ability.name == 'Offer Contract')

    if(fighterIsAJobSeeker || lastWeekOfContract){
      abilitiesFighterCanBeTheTargetOf.push(offerContractAbility)
    }

    let infoBoxList: InfoBoxListItem[]

    if (fighterOwnedByManager) {

      const { strength, fitness, intelligence, aggression, manager, numberOfFights, numberOfWins } = fighter as FighterInfo
      infoBoxList = [
        { label: 'Strength', value: strength },
        { label: 'Fitness', value: fitness },
        { label: 'Intelligence', value: intelligence },
        { label: 'Aggression', value: aggression },
        { label: 'Manager', value: manager },
        { label: 'Number of Fights', value: numberOfFights },
        { label: 'Number of Wins', value: numberOfWins }
      ]
    }
    else {
      const { strength, fitness, intelligence, aggression, manager, numberOfFights, numberOfWins } = fighter.knownStats as KnownFighterStats
      infoBoxList = [
        { label: 'Strength', value: strength ? `${strength.lastKnownValue} (${strength.roundsSinceUpdated})` : 'unknown' },
        { label: 'Fitness', value: fitness ? `${fitness.lastKnownValue} (${fitness.roundsSinceUpdated})` : 'unknown' },
        { label: 'Intelligence', value: intelligence ? `${intelligence.lastKnownValue} (${intelligence.roundsSinceUpdated})` : 'unknown' },
        { label: 'Aggression', value: aggression ? `${aggression.lastKnownValue} (${aggression.roundsSinceUpdated})` : 'unknown' },
        { label: 'Manager', value: manager ? `${manager.lastKnownValue ? manager.lastKnownValue : 'none'} (${manager.roundsSinceUpdated})` : 'unknown' },
        { label: 'Number of Fights', value: numberOfFights ? `${numberOfFights.lastKnownValue ? numberOfFights.lastKnownValue : 'none'} (${numberOfFights.roundsSinceUpdated})` : 'unknown' },
        { label: 'Number of Wins', value: numberOfWins ? `${numberOfWins.lastKnownValue ? numberOfWins.lastKnownValue : 'none'} (${numberOfWins.roundsSinceUpdated})` : 'unknown' }
      ]
    }

    const { name, inNextFight } = fighter

    
    let contractInfo: InfoBoxListItem[]
    
    if(fighterOwnedByManager)
      contractInfo = [
        {label: 'Weeks remaining', value: fighter.activeContract.weeksRemaining},
        {label: 'Cost per week', value: fighter.activeContract.costPerWeek}
      ]

    return (
      <div className='card fighter-card'>
        <div className='card__heading heading'>{name}</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left fighter-card__image'></div>
          <div className='card__two-columns__right'>
            {fighterOwnedByManager ?
              <div className='fighter-card__fight-experience'>
                <Fights numberOfFights={fighter.numberOfFights}/>
                <Wins numberOfWins={fighter.numberOfWins}/>
              </div>
              :
              <div className='fighter-card__fight-experience'>                
                <Fights 
                  numberOfFights={
                    fighter.knownStats.numberOfFights ?
                    `${fighter.knownStats.numberOfFights.lastKnownValue} 
                    (${fighter.knownStats.numberOfFights.roundsSinceUpdated})`
                    : '?'
                  }
                />
                <Wins 
                  numberOfWins={
                    fighter.knownStats.numberOfWins ?
                    `${fighter.knownStats.numberOfWins.lastKnownValue} 
                    (${fighter.knownStats.numberOfWins.roundsSinceUpdated})`
                    : '?'
                  }
                />
              </div>
            }
            <div className='fighter-card__stats'>
              <InfoBox
                heading={`${!fighterOwnedByManager ? 'Known ' : ''}Stats`}
                list={infoBoxList}
              />
            </div>
            {fighterOwnedByManager && 
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
                    name,
                    type: fighterOwnedByManager ?
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

