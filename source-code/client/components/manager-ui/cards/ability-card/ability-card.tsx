
import * as React from 'react';
import PlayerAction from '../../../../../interfaces/player-action';

import './../modal-card.scss';
import './ability-card.scss';
import { abilityServiceClient } from '../../../../../game-components/abilities-reformed/ability-service-client';
import { ClientAbility, AbilityData } from '../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../game-components/manager/manager';
import Modal from '../../main-components/modal/modal';
import SelectList from '../select-list/select-list';
import { ListOption } from '../../../../../types/game/list-option';
import { JobSeeker } from '../../../../../interfaces/game-ui-state.interface';



export interface AbilityCardProps{
  closeModal(): void
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  nextFightFighters: string[]
  managerInfo: ManagerInfo
  jobSeekers: JobSeeker[]
  sendPlayerAction(playerAction: PlayerAction): void
  fighterSelected(fighterName: string)
}

interface AbilityCardState{
  abilityData: AbilityData
  listOptions: ListOption[]
  selectListType: 'source' | 'target'
}

export default class AbilityCard extends React.Component<AbilityCardProps, AbilityCardState>{

  state: AbilityCardState = {
    abilityData: undefined,
    listOptions: undefined,
    selectListType: undefined
  }
  
  clientAbility: ClientAbility


  componentDidMount(){
    const {abilityData, managerInfo} = this.props
    this.clientAbility = abilityServiceClient.abilities.find(ability => ability.name == abilityData.name)
    if(!abilityData.source)
      abilityData.source = abilityServiceClient.getAppropriateSource(this.clientAbility, managerInfo)

    this.setState({
      abilityData: abilityData
    })
  }

  showSelectList(type: 'source' | 'target'){
    if(type == 'source')
      this.setState({listOptions: abilityServiceClient.getPossibleSources(this.clientAbility, this.props.managerInfo), selectListType: type})
    if(type == 'target')
      this.setState({listOptions: abilityServiceClient.getPossibleTargets(this.clientAbility, this.props.managerInfo, this.props.jobSeekers), selectListType: type})
  }

  
  confirmButtonClicked(){
    const {abilityData} = this.state
    try{
      abilityServiceClient.validateAbilityConfirm(this.clientAbility, this.props.managerInfo, abilityData, this.props.delayedExecutionAbilities)
    }
    catch(error){
      alert(error)
      return
    }
    const playerAction: PlayerAction = {
      name: 'Ability Confirmed',
      args: abilityData
    }
    this.props.sendPlayerAction(playerAction)

    this.props.closeModal()
    if(abilityData.name == 'Research Fighter')
      this.props.fighterSelected(abilityData.target.name)
    
  }

  closeSelectList(){
    this.setState({listOptions: undefined, selectListType: undefined})
  }
  listItemSelected(item: any, type: 'source' | 'target'){
    if(type == 'source')
      this.setState(prev => ({
        abilityData: {...prev.abilityData, source: item}
      }))
    else if(type == 'target')
      this.setState(prev => ({
        abilityData: {...prev.abilityData, target: item}
      }))
    this.closeSelectList()
  }

  render(){
    if(!this.clientAbility)
      return <div>....loading</div>
      const {longDescription, possibleTargets} = this.clientAbility
      const {delayedExecutionAbilities, nextFightFighters} = this.props
      const { listOptions, selectListType, abilityData} = this.state
      const {name, target, source, additionalData} = abilityData

      
    let warningMessage
    if(abilityServiceClient.canOnlyBeTargetedOnceConflict(this.clientAbility, abilityData.target, delayedExecutionAbilities))
      warningMessage = `${name} can only target the same target once`


    return (
      <div className='ability-card card'>
        <div className=' card_heading heading'>{name}</div>
        <div className="card__two-columns">
          <div className={`card__two-columns__left ability-card__image ${'ability-card__image__'+abilityData.name.toLocaleLowerCase().split(' ').join('-')}`}
          ></div>
          <div className='card__two-columns__right'>
            <div className='ability-card__description'>{longDescription}</div>
            
            {warningMessage ? 
              <div className="warning-message">{warningMessage}</div> : ''
            }
          </div>
        </div>

        <hr/>
      
        <div className='ability-card__variables'>
          {possibleTargets.length ?
            <div className='target'>
              <label className='target__label'>Target:</label>
              {target ?
                <div className="target__value">{target.name}</div> :
                <div className="target__value target__value--required">target required</div>
              }
              <button className='standard-button target__set-button' 
              onClick={() => this.showSelectList('target')}>Set Target</button>
            </div> : ''
          }
          <div className='source'>
            <label className='source__label'>Source:</label>
            {source ?
              <div className="source__value">{source.name}</div> :
              <div className="source__value source__value--required">source required</div>
            }
            <button className='standard-button source__set-button' 
            onClick={() => this.showSelectList('source')}>Set Source</button>
          </div>
        </div>

        <hr/>
        
        <button className='standard-button ability-card__button' onClick={this.confirmButtonClicked.bind(this)}>Confirm</button>
        
        {this.state.listOptions &&
          <Modal closeModal={this.closeSelectList.bind(this)}>
            <SelectList 
              nextFightFighters={nextFightFighters}
              list={listOptions} 
              type={selectListType}
              itemSelected={this.listItemSelected.bind(this)}
            />
          </Modal>
        }
      </div>
      
    )
  }
}