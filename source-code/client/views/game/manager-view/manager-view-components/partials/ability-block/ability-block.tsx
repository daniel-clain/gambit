
import * as React from 'react';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';
import { abilityServiceClient } from '../../../../../../../game-components/abilities-reformed/ability-service-client';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import './ability-block.scss'
import {connect} from 'react-redux'
import { frontEndService } from '../../../../../../front-end-service/front-end-service';


interface AbilityBlockProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  managerInfo: ManagerInfo
}
const AbilityBlock = ({abilityData, managerInfo, delayedExecutionAbilities}:AbilityBlockProps) => {
  const {showAbility} = frontEndService().setClientState
  let disabled = !abilityServiceClient.isPossibleToPerformAbility(abilityData, managerInfo, delayedExecutionAbilities)
  
  const {shortDescription} = abilityServiceClient.abilities.find(ability => ability.name == abilityData.name)
  return (
    <div 
      className={`ability-block ${disabled ? 'ability-block--disabled':''} `}
      onClick={() => showAbility(abilityData)}
    >
      <div className='ability-block__name'>{abilityData.name}</div>
      <div className={`ability-block__image ${'ability-block__image__'+abilityData.name.toLocaleLowerCase().split(' ').join('-')}`}></div>
      
    </div>
  )
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {managerInfo}
  }}
}: FrontEndState) => ({managerInfo})
export default connect(mapStateToProps)(AbilityBlock)