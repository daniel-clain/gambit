
import * as React from 'react';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';
import { abilityServiceClient } from '../../../../../../../game-components/abilities-reformed/ability-service-client';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import './ability-block.scss'


interface AbilityBlockProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  managerInfo: ManagerInfo
  onSelected(abilityData: AbilityData)
}
export default class AbilityBlock extends React.Component<AbilityBlockProps>{
  render(){
    const {onSelected, abilityData, managerInfo, delayedExecutionAbilities} = this.props
    let disabled = !abilityServiceClient.isPossibleToPerformAbility(abilityData, managerInfo, delayedExecutionAbilities)
    
    const {shortDescription} = abilityServiceClient.abilities.find(ability => ability.name == abilityData.name)
    return (
      <div 
        className={`ability-block ${disabled ? 'ability-block--disabled':''} `}
        onClick={() => onSelected(abilityData)}
      >
        <div className='ability-block__name'>{abilityData.name}</div>
        <div className={`ability-block__image ${'ability-block__image__'+abilityData.name.toLocaleLowerCase().split(' ').join('-')}`}></div>
        <div className='ability-block__short-description'>{shortDescription}</div>
        
      </div>
    )
  }
}