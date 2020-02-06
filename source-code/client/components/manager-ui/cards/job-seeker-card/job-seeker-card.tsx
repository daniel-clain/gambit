
import * as React from 'react';
import { JobSeeker } from '../../../../../interfaces/game-ui-state.interface';
import { ManagerInfo } from '../../../../../game-components/manager/manager';
import AbilityBlock from '../ability-block/ability-block';
import './job-seeker-card.scss'
import './../modal-card.scss';
import InfoBox from '../../partials/info-box/info-box';
import { InfoBoxListItem } from '../../../../../interfaces/game/info-box-list';
import { AbilityData } from '../../../../../game-components/abilities-reformed/ability';


export interface JobSeekerCardProps{
  delayedExecutionAbilities: AbilityData[]
  jobSeeker: JobSeeker
  managerInfo: ManagerInfo
  abilitySelected(abilityData: AbilityData)
}

export class JobSeekerCard extends React.Component<JobSeekerCardProps>{

  render(){
    const {jobSeeker, abilitySelected, managerInfo, delayedExecutionAbilities} = this.props

    const abilityData: AbilityData = {      
      name: 'Offer Contract',
      source: undefined,
      target: {
        name: jobSeeker.name,
        type: 'job seeker'
      },
      additionalData: {
        contractDetails: jobSeeker.goalContract,
      }
    }

    const offerContractAbilityBlock = 
      <AbilityBlock 
        managerInfo={managerInfo}
        abilityData={abilityData} 
        delayedExecutionAbilities={delayedExecutionAbilities}
        onSelected={abilitySelected}
      />
        
    const {numberOfWeeks, weeklyCost} = jobSeeker.goalContract

    const infoBoxList: InfoBoxListItem[] = [
      {label: 'Number of weeks', value: numberOfWeeks},
      {label: 'Weekly cost', value: weeklyCost}
    ]


    return (
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
            <InfoBox heading={'Contract Goal'} list={infoBoxList}/>
          </div>
        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          {offerContractAbilityBlock}
        </div>
        
      </div>
    )
  }
}