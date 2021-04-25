
import * as React from 'react';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import './ability-block.scss'
import {connect, ConnectedProps} from 'react-redux'
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { abilityService } from '../../../../../../front-end-service/ability-service-client';

interface AbilityBlockProps extends PropsFromRedux{
  abilityData: AbilityData
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {managerInfo, delayedExecutionAbilities}
  }}
}: FrontEndState) => ({managerInfo, delayedExecutionAbilities})
const mapDispatch = {
  showAbility: (abilityData: AbilityData) => ({type: 'showAbility', payload: abilityData})
}

 const connector = connect(mapStateToProps, mapDispatch)
 type PropsFromRedux = ConnectedProps<typeof connector>

 export const AbilityBlock = connector(({abilityData, managerInfo, delayedExecutionAbilities, showAbility}:AbilityBlockProps) => {
   
  let disabled = !abilityService.isPossibleToPerformAbility(abilityData, managerInfo, delayedExecutionAbilities)

  
  return (
    <div 
      className={`ability-block ${disabled ? 'ability-block--disabled':''} `}
      onClick={() => showAbility(abilityData)}
    >
      <div className='ability-block__name'>{abilityData.name}</div>
      <div className={`ability-block__image ${'ability-block__image__'+abilityData.name.toLocaleLowerCase().split(' ').join('-')}`}></div>
      
    </div>
  )
})
