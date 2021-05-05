
import * as React from 'react';

import {connect} from 'react-redux'
import './fighter-card.scss';
import '../modal-card.scss';
import {AbilityBlock} from '../../partials/ability-block/ability-block';
import Fights from '../../partials/fights-and-wins/fights';
import Wins from '../../partials/fights-and-wins/wins';
import { AbilityData, ClientAbility } from '../../../../../../../game-components/abilities-general/ability';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { FighterInfo, FrontEndState, JobSeeker } from '../../../../../..//../interfaces/front-end-state-interface';
import { Modal } from '../../partials/modal/modal';
import { InfoBox } from '../../partials/info-box/info-box';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';


export interface FighterCardProps {
  jobSeekers: JobSeeker[]
  fighterName: string
  allFighters: FighterInfo[]
  thisPlayersName: string

}

const FighterCard = ({fighterName, thisPlayersName, allFighters}: FighterCardProps) => {
  const fighter = allFighters.find(f => f.name == fighterName)
  const {abilityService} = frontEndService
  const isYourFighter = fighter.manager?.lastKnownValue == thisPlayersName


  let goalContractInfo: InfoBoxListItem[]

  if(fighter.goalContract){
    goalContractInfo = [        
    {label: 'Number of weeks', value: fighter.goalContract.numberOfWeeks},
    {label: 'Weekly cost', value: fighter.goalContract.weeklyCost}
    ]
  }



  const abilitiesFighterCanBeTheTargetOf: ClientAbility[] = abilityService.getAbilitiesFighterCanBeTheTargetOf(isYourFighter)



  const offerContractAbility = abilityService.abilities.find(ability => ability.name == 'Offer Contract')

  if(fighter.goalContract)
    abilitiesFighterCanBeTheTargetOf.push(offerContractAbility)
  

  let infoBoxList: InfoBoxListItem[]

  if (isYourFighter) {
    const {strength, fitness, intelligence, aggression} = fighter
    infoBoxList = [
      { label: 'Strength', value: strength.lastKnownValue },
      { label: 'Fitness', value: fitness.lastKnownValue },
      { label: 'Intelligence', value: intelligence.lastKnownValue },
      { label: 'Aggression', value: aggression.lastKnownValue },
      { label: 'Manager', value: thisPlayersName }
    ]
  }
  else {
    const { strength, fitness, intelligence, aggression, manager } = fighter
    infoBoxList = [
      { label: 'Strength', value: strength ? `${strength.lastKnownValue} (${strength.roundsSinceUpdated})` : 'unknown' },
      { label: 'Fitness', value: fitness ? `${fitness.lastKnownValue} (${fitness.roundsSinceUpdated})` : 'unknown' },
      { label: 'Intelligence', value: intelligence ? `${intelligence.lastKnownValue} (${intelligence.roundsSinceUpdated})` : 'unknown' },
      { label: 'Aggression', value: aggression ? `${aggression.lastKnownValue} (${aggression.roundsSinceUpdated})` : 'unknown' },
      { label: 'Manager', value: manager ? `${manager.lastKnownValue ? manager.lastKnownValue : 'none'} (${manager.roundsSinceUpdated})` : 'unknown' }
    ]
  }


  
  let contractInfo: InfoBoxListItem[]
  
  if(isYourFighter)
    contractInfo = [
      {label: 'Weeks remaining', value: fighter.activeContract.weeksRemaining},
      {label: 'Cost per week', value: fighter.activeContract.weeklyCost}
    ]


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
                    (${fighter.numberOfFights.roundsSinceUpdated})`
                    : '?'
                  }
                />
                <Wins 
                  numberOfWins={
                    fighter.numberOfWins ?
                    `${fighter.numberOfWins.lastKnownValue} 
                    (${fighter.numberOfWins.roundsSinceUpdated})`
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
          {abilitiesFighterCanBeTheTargetOf.map(
            (clientAbility: ClientAbility) => (
              <AbilityBlock
                key={clientAbility.name}
                abilityData={{
                  name: clientAbility.name,
                  target: {
                    name: fighter.name,
                    type: fighter ?
                      'fighter owned by manager' :
                      'fighter not owned by manager'
                  },
                  source: undefined
                }}
              />
            )
          )}
        </div>

      </div >
    </Modal>
  )
}



const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {
      jobSeekers, managerInfo: {knownFighters, fighters}
    },
    
  }},
  clientUIState: {
    clientPreGameUIState: {clientName},
    clientGameUIState: {
      clientManagerUIState: {activeModal: {data}}
    }
  }
}: FrontEndState): FighterCardProps => ({
  jobSeekers, thisPlayersName: clientName, fighterName: data, allFighters: [...knownFighters, ...fighters]
})


const x = connect(mapStateToProps)
(FighterCard)

export default x

