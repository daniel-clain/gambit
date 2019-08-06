
import * as React from 'react';
import { IOptionClient, OptionTarget, OptionSource, OptionNames, optionsInfoList } from '../../../classes/game/manager/manager-options/manager-option';
import { OptionData } from './option-card';

interface OptionBlockProps{
  optionData: OptionData
  onSelected(optionData: OptionData)
}
export default class OptionBlock extends React.Component<OptionBlockProps>{
  render(){
    const {onSelected, optionData} = this.props
    
    const {shortDescription} = optionsInfoList.find(optionInfo => optionInfo.name == optionData.name)
    return (
      <div className='option-block'>
        <div className='option-block__name'>{optionData.name}</div>
        <div className='option-block__short-description'>{shortDescription}</div>
        <button className='standard-button option-block__button' onClick={() => onSelected(optionData)}>Select Option</button>
      </div>
    )
  }
}