
import * as React from 'react';
import { optionValidators, OptionValidator, optionsInfoList } from '../../../classes/game/manager/manager-options/manager-option';
import PlayerAction from '../../../interfaces/player-action';
interface Source{
  type: 'Manager' | 'Employee'
  name: string
}
interface Target{
  type: 'Manager' | 'Fighter' | 'Jobseeker'
  name: string
}
export interface OptionData{
  name: string
  source: Source
  target?: Target
  args?: any
}
interface OptionInfo{
  shortDescription: string
  longDescription: string
}

interface OptionCardProps{
  optionData: OptionData
  sendPlayerAction(playerAction: PlayerAction)
}
export default class OptionCard extends React.Component<OptionCardProps, OptionData>{

  state: OptionData
  optionValidator: OptionValidator  
  optionInfo: OptionInfo

  constructor(props: OptionCardProps){
    super(props)
    const {name} = this.props.optionData
    this.setState({...props.optionData})
    this.optionValidator = optionValidators.find(
      optionValidator => optionValidator.optionName == name)
    this.optionInfo = optionsInfoList.find(optionInfo => optionInfo.name == name)

  }

  
  confirmButtonClicked(){
    const error = this.optionValidator.validate(this.state)
    if(error){
      alert(error)
      return
    }
    const playerAction: PlayerAction = {
      name: 'Option Confirmed',
      args: this.state
    }
    this.props.sendPlayerAction(playerAction)
  }
  render(){
    const {optionData} = this.props
    const {name, target, source, args} = optionData
    const {shortDescription} = this.optionInfo


    return (
      <div className='option-card'>
        <div className='option-card__name'>{name}</div>
        <div className='option-card__short-description'>{shortDescription}</div>

        {target &&
          <div className=''>Target: {target.name}</div>}
        {source &&
          <div className=''>Source: {source.name}</div>}

        <button>set target</button>
        <button>set sourcex</button>

        
        <button className='standard-button option-card__button' onClick={this.confirmButtonClicked}>Confirm</button>
      </div>
    )
  }
}