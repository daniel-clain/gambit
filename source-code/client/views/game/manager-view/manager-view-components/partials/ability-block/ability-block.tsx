
import * as React from 'react';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import './ability-block.scss'
import {connect} from 'react-redux'
import {frontEndService} from '../../../../../../front-end-service/front-end-service';


interface AbilityBlockProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  managerInfo: ManagerInfo
}
const AbilityBlock = ({abilityData, managerInfo, delayedExecutionAbilities}:AbilityBlockProps) => {
  const {setClientState, abilityService} = frontEndService
  const {showAbility} = setClientState
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
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {managerInfo, delayedExecutionAbilities}
  }}
}: FrontEndState) => ({managerInfo, delayedExecutionAbilities})
export default connect(mapStateToProps)(AbilityBlock)