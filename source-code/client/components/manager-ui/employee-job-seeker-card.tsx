
import * as React from 'react';
import { FighterInfo, Employee, JobSeeker } from '../../../interfaces/game-ui-state.interface';
import gameConfiguration from '../../../classes/game/game-configuration';
import { Bet } from '../../../interfaces/game/bet';
import { IOptionClient, OfferContractClient } from '../../../classes/game/manager/manager-options/manager-option';
import OptionBlock from './option-block';
import { OptionData } from './option-card';

interface EmployeeJobSeekerCardProps{
  actorInfo: Employee | JobSeeker
  onOptionBlockSelected(optionData: OptionData)

}

export class EmployeeJobSeekerCard extends React.Component<EmployeeJobSeekerCardProps>{

  render(){
    const {actorInfo, onOptionBlockSelected, managerName} = this.props
    const jobSeeker = actorInfo as JobSeeker
    const employee = actorInfo as Employee
    const employeeOptions: IOptionClient[] = allClientOptions.filter((option: IOptionClient) => option.isValidSource(actorInfo as Employee))
    const offerJobSeekerContractOption: OfferContractClient = allClientOptions.find((option: IOptionClient) => option.name == 'Offer contract') as OfferContractClient


    return (
      <div className='card'>
        <div className='card__name'>{actorInfo.name}</div>
        <div className='card__left'></div>
        <div className='card__right'>    
          <div>
            Type: {actorInfo.type} <br/>
            Skill level: {actorInfo.skillLevel}
          </div>     
          {jobSeeker.offeredContract && 
            <div className='job-seeker-terms'>
              <div className='heading'>Contract Goal</div>
              numberOfWeeks: {jobSeeker.offeredContract.numberOfWeeks} <br/>
              weeklyCost: {jobSeeker.offeredContract.weeklyCost} 
            </div>
          }

          {employee.contract && 
            <div className='job-seeker-terms'>
              <div className='heading'>Contract Details</div>
              Weeks remaining: {employee.contract.weeksRemaining} <br/>
              Cost per week: {employee.contract.costPerWeek} 
            </div>
          }
        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          {employeeOptions.map((option: IOptionClient) => (
            <OptionBlock key={option.name} option={option} onSelected={onOptionBlockSelected} source={{name: actorInfo.name, type: 'Employee'}}/>
          ))}       
          {offerJobSeekerContractOption &&
            <OptionBlock option={offerJobSeekerContractOption} onSelected={onOptionBlockSelected} target={{name: actorInfo.name, type: 'Job Seeker'}}
            source={{type: 'Manager', name: managerName}}/>
          }        
        </div>
        
      </div>
    )
  }
}