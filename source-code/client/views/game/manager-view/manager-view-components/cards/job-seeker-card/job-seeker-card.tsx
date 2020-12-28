
import * as React from 'react';
import './job-seeker-card.scss'
import '../modal-card.scss';
import {connect} from 'react-redux'
import AbilityBlock from '../../partials/ability-block/ability-block';
import { AbilityData, AbilityName } from '../../../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { JobSeeker } from '../../../../../../../interfaces/server-game-ui-state.interface';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { Modal } from '../../partials/modal/modal';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import { InfoBox } from '../../partials/info-box/info-box';

export interface JobSeekerCardProps{
  delayedExecutionAbilities: AbilityData[]
  jobSeeker: JobSeeker
  managerInfo: ManagerInfo
}

const JobSeekerCard = ({delayedExecutionAbilities, jobSeeker, managerInfo}:JobSeekerCardProps) => {

  console.log('blerg')

  const abilityData: AbilityData = {      
    name: 'Offer Contract',
    source: undefined,
    target: {
      name: jobSeeker.name,
      type: 'job seeker'
    }
  }

  const offerContractAbilityBlock = 
    <AbilityBlock 
      managerInfo={managerInfo}
      abilityData={abilityData} 
      delayedExecutionAbilities={delayedExecutionAbilities}
    />
      
  const {numberOfWeeks, weeklyCost} = jobSeeker.goalContract

  const infoBoxList: InfoBoxListItem[] = [
    {label: 'Number of weeks', value: numberOfWeeks},
    {label: 'Weekly cost', value: weeklyCost}
  ]


  return (
    <Modal>
      <div className='card job-seeker-card'>
        <div className='heading'>{jobSeeker.name}</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left job-seeker-card__image'></div>
          <div className='card__two-columns__right'>    
            <div className='job-seeker-card__profession'>
              Profession: {jobSeeker.profession}
            </div>     
            <div className='job-seeker-card__skill-level'>
              Skill level: {jobSeeker.skillLevel}
            </div>     
            <InfoBox heading={'Abilities'}>
              <ul>
                {jobSeeker.abilities?.map(
                  ability => <li>{ability}</li>
                )}
              </ul>
            </InfoBox>
            <InfoBox heading={'Contract Goal'} list={infoBoxList}/>
          </div>
        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          {offerContractAbilityBlock}
        </div>
        
      </div>
    </Modal>
  )
}

export default connect(({
  clientUIState: {clientGameUIState: {
    clientManagerUIState: {activeCard}
  }},
  serverUIState: {serverGameUIState: {playerManagerUIState: {
    delayedExecutionAbilities, managerInfo
  }}}
}: FrontEndState): JobSeekerCardProps => ({
  delayedExecutionAbilities, managerInfo, jobSeeker: activeCard.data
}))
(JobSeekerCard)