
import * as React from 'react';
import { JobSeeker } from '../../../interfaces/game-ui-state.interface';
import { ManagerInfo } from '../../../classes/game/manager/manager';
import AbilityBlock from './ability-block';
import AbilityService from './ability-service';
import OfferContract from '../../../classes/game/abilities/offer-contract';
import { Contract } from '../../../interfaces/game/contract.interface';
import IClientAbility, { AbilityData } from './client-abilities/client-ability.interface';
import { OfferContractClient } from './client-abilities/offer-contract-client';

interface JobSeekerCardProps{
  jobSeeker: JobSeeker
  managerInfo: ManagerInfo
  onAbilityBlockSelected(abilityData: AbilityData)
  abilityService: AbilityService

}

export class JobSeekerCard extends React.Component<JobSeekerCardProps>{

  render(){
    const {jobSeeker, onAbilityBlockSelected, managerInfo, abilityService} = this.props

    const offerContractAbility: OfferContractClient = abilityService.allAbilities.find(
      (ability: IClientAbility) => ability.name == 'Offer contract'
    ) as OfferContractClient

    const abilityData: AbilityData = {      
      name: 'Offer contract',
      source: {
        name: managerInfo.name,
        type: 'Manager',
      },
      target: jobSeeker,
      additionalData: {
        contractDetails: jobSeeker.goalContract,
      }
    }
    const offerContractAbilityBlock = (
      <AbilityBlock 
        abilityData={abilityData} 
        onSelected={onAbilityBlockSelected}
        abilityService={abilityService}
      />
    )
    


    return (
      <div className='card'>
        <div className='card__name'>{jobSeeker.name}</div>
        <div className='card__left'></div>
        <div className='card__right'>    
          <div>
            Type: {jobSeeker.type} <br/>
            Skill level: {jobSeeker.skillLevel}
          </div>     
          <div className='job-seeker-terms'>
            <div className='heading'>Contract Goal</div>
            numberOfWeeks: {jobSeeker.goalContract.numberOfWeeks} <br/>
            weeklyCost: {jobSeeker.goalContract.weeklyCost} 
          </div>
        </div>
        <div className='card__abilities'>
          <div className='heading'>abilities</div>
          {offerContractAbilityBlock}    
        </div>
        
      </div>
    )
  }
}