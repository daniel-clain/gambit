
import * as React from 'react';
import AbilityService from './ability-service';
import { AbilityData } from './client-abilities/client-ability.interface';

interface AbilityBlockProps{
  abilityData: AbilityData
  onSelected(abilityData: AbilityData)
  abilityService: AbilityService
}
export default class AbilityBlock extends React.Component<AbilityBlockProps>{
  render(){
    const {onSelected, abilityData, abilityService} = this.props
    
    const {shortDescription} = abilityService.allAbilities.find(abilityInfo => abilityInfo.name == abilityData.name)
    return (
      <div className='ability-block'>
        <div className='ability-block__name'>{abilityData.name}</div>
        <div className='ability-block__short-description'>{shortDescription}</div>
        <button className='standard-button ability-block__button' onClick={() => onSelected(abilityData)}>Select Ability</button>
      </div>
    )
  }
}