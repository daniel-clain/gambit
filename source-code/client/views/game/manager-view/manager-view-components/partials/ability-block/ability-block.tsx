
import * as React from 'react';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';
import { abilityServiceClient } from '../../../../../../../game-components/abilities-reformed/ability-service-client';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import './ability-block.scss'
import {connect, useDispatch} from 'react-redux'
import { Dispatch } from 'redux';
import { ClientManagerUIAction } from '../../../../../../front-end-state/reducers/manager-ui.reducer';


interface AbilityBlockProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  managerInfo: ManagerInfo
}
const AbilityBlock = ({abilityData, managerInfo, delayedExecutionAbilities}:AbilityBlockProps) => {
  const dispatch: Dispatch<ClientManagerUIAction> = useDispatch()
  let disabled = !abilityServiceClient.isPossibleToPerformAbility(abilityData, managerInfo, delayedExecutionAbilities)
  
  const {shortDescription} = abilityServiceClient.abilities.find(ability => ability.name == abilityData.name)
  return (
    <div 
      className={`ability-block ${disabled ? 'ability-block--disabled':''} `}
      onClick={() => dispatch({type: 'Ability Selected', payload: abilityData})}
    >
      <div className='ability-block__name'>{abilityData.name}</div>
      <div className={`ability-block__image ${'ability-block__image__'+abilityData.name.toLocaleLowerCase().split(' ').join('-')}`}></div>
      <div className='ability-block__short-description'>{shortDescription}</div>
      
    </div>
  )
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUiData: {managerInfo}
  }}
}: FrontEndState) => ({managerInfo})
export default connect(mapStateToProps)(AbilityBlock)