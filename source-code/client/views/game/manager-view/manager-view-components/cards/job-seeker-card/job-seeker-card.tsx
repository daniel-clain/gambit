
import * as React from 'react';
import './job-seeker-card.scss'
import '../modal-card.scss';
import AbilityBlock from '../../partials/ability-block/ability-block';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { Modal } from '../../partials/modal/modal';
import { JobSeeker } from '../../../../../../../interfaces/front-end-state-interface';
import { InfoBox } from '../../partials/info-box/info-box';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';

const {managerMap} = frontEndService

const mapping = managerMap<JobSeeker>(({activeModal:{data}}) => data)

export const JobSeekerCard = connect(mapping)(hot(
  jobSeeker => {


  const abilityData: AbilityData = {      
    name: 'Offer Contract',
    source: undefined,
    target: {
      name: jobSeeker.name,
      type: 'job seeker'
    }
  }
   
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
            <div className="direction-box">
              <InfoBox heading={'Abilities'}>
                <ul>
                  {jobSeeker.abilities?.map(
                    ability => <li key={ability}>{ability}</li>
                  )}
                </ul>
              </InfoBox>
              <InfoBox heading={'Contract Goal'} list={infoBoxList}/>
            </div>  
          </div>
        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          <AbilityBlock 
            abilityData={abilityData}
          />
        </div>
        
      </div>
    </Modal>
  )
}))
