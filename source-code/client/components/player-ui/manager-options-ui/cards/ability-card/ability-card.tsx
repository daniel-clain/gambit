
import * as React from 'react';
import '../modal-card.scss';
import './ability-card.scss';
import { AbilityData, ClientAbility } from '../../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../../game-components/manager';
import { JobSeeker } from '../../../../../../interfaces/game-ui-state.interface';
import PlayerAction from '../../../../../../interfaces/player-action';
import { GoalContract, ContractOffer } from '../../../../../../interfaces/game/contract.interface';
import InfoBox from '../../partials/info-box/info-box';
import Modal from '../../main-components/modal/modal';
import { ListOption } from '../../../../../../types/game/list-option';
import { abilityServiceClient } from '../../../../../../game-components/abilities-reformed/ability-service-client';
import { InfoBoxListItem } from '../../../../../../interfaces/game/info-box-list';
import SelectList from '../select-list/select-list';



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

    if(this.clientAbility.name == 'Offer Contract')
      this.setContractOffer(abilityData)

    
    this.setState({
      abilityData: this.props.abilityData
    })
  }

  setContractOffer(abilityData: AbilityData){

    const {managerInfo, jobSeekers} = this.props


    if(abilityData && abilityData.target){
      let goalContract: GoalContract
      if(abilityData.target.type == 'fighter owned by manager')
        goalContract = managerInfo.fighters.find(fighter => fighter.name == abilityData.target.name).goalContract
      else
        goalContract = jobSeekers.find(jobSeeker => jobSeeker.name == abilityData.target.name).goalContract
      
      abilityData.additionalData = {
        contractOffer: {
          numberOfWeeks: goalContract.numberOfWeeks,
          weeklyCost: goalContract.weeklyCost
        }
      }

    }
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
    else if(type == 'target'){
      let abilityData = this.state.abilityData
      abilityData.target = item
      if(this.clientAbility.name == 'Offer Contract')
        this.setContractOffer(abilityData)

      this.setState({abilityData})
    }
    this.closeSelectList()
  }

  setContractOfferValue(inputElement){
    let value: any = parseInt(inputElement.target.value)
    value = value >= 0 ? value : ''

    const contractOffer: ContractOffer = {  
      ...this.state.abilityData.additionalData.contractOffer,        
      weeklyCost: value    
    }

    this.setState({
      abilityData: {
        ...this.state.abilityData, 
        additionalData: {contractOffer}
      }
    })
  }

  handleEnterEvent(event){
    if(event.key == 'Enter')
      event.target.blur()
  }

  render(){
    if(!this.clientAbility)
      return <div>....loading</div>
      const {longDescription, possibleTargets, name, cost} = this.clientAbility
      const {delayedExecutionAbilities, nextFightFighters, jobSeekers, managerInfo} = this.props
      const { listOptions, selectListType, abilityData} = this.state
      const {target, source, additionalData} = abilityData

      
    let warningMessage
    if(abilityServiceClient.canOnlyBeTargetedOnceConflict(this.clientAbility, abilityData, delayedExecutionAbilities, managerInfo))
      warningMessage = `${name} can only target the same target once`

    const abilityRequirementsInfo: InfoBoxListItem[] = [
        {label: 'Money Cost', value: cost.money},
        {label: 'Action Points', value: cost.actionPoints,}
    ]
    if(name == 'Dope Fighter' || name == 'Poison Fighter'){
      abilityRequirementsInfo.push({
        label: 'Requires:', value: 'Must have a drug dealer working for you'
      })
    }

    let offerContractBox: JSX.Element

    if(this.clientAbility.name == 'Offer Contract' && abilityData.target){
      let goalContract: GoalContract
      if(abilityData.target.type == 'fighter owned by manager')
        goalContract = managerInfo.fighters.find(fighter => fighter.name == abilityData.target.name).goalContract
      else
        goalContract = jobSeekers.find(jobSeeker => jobSeeker.name == abilityData.target.name).goalContract
      const contractOffer: ContractOffer = abilityData.additionalData.contractOffer
      offerContractBox = 
        <InfoBox 
          heading={'Contract Offer'}
          list={[                  
            {label: 'Goal money per week', value: goalContract.weeklyCost},
            {label: 'Number of weeks', value: goalContract.numberOfWeeks},
            {label: 'Your money offer per week', value: 
              <input className='money-offer' type="number" value={contractOffer.weeklyCost} onChange={this.setContractOfferValue.bind(this)} onKeyPress={this.handleEnterEvent.bind(this)}/>
            }
          ]}
        />
    }

    return (
      <div className='ability-card card'>
        <div className=' card_heading heading'>{name}</div>
        <div className="card__two-columns">
          <div className={`card__two-columns__left ability-card__image ${'ability-card__image__'+abilityData.name.toLocaleLowerCase().split(' ').join('-')}`}
          ></div>
          <div className='card__two-columns__right'>
            <InfoBox 
                heading={'Ability Info'}
                info={longDescription}
            />
            {this.clientAbility.cost.money > 0 && 
              <InfoBox 
                heading={'Ability Requirements'}
                list={abilityRequirementsInfo}
              />
            }
            {warningMessage ? 
              <div className="warning-message">{warningMessage}</div> : ''
            }
          </div>
        </div>
        {offerContractBox}

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