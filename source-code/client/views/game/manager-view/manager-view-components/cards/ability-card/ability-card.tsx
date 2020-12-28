
import * as React from 'react';
import { useState } from 'react';
import { AbilityData, ClientAbility } from '../../../../../../../game-components/abilities-reformed/ability';
import { abilityServiceClient } from '../../../../../../../game-components/abilities-reformed/ability-service-client';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { GoalContract, ContractOffer } from '../../../../../../../interfaces/game/contract.interface';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { FighterInfo, JobSeeker } from '../../../../../../../interfaces/server-game-ui-state.interface';
import { ListOption } from '../../../../../../../types/game/list-option';
import { frontEndService } from '../../../../../../front-end-service/front-end-service';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import '../modal-card.scss';
import SelectList from '../select-list/select-list';
import './ability-card.scss';
import {connect, useDispatch} from 'react-redux'
import { Modal } from '../../partials/modal/modal';
import { Dispatch } from 'redux';
import { InfoBox } from '../../partials/info-box/info-box';



export interface AbilityCardProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  nextFightFighters: FighterInfo[]
  managerInfo: ManagerInfo
  jobSeekers: JobSeeker[]
  
}

const AbilityCard = ({
  abilityData,
  managerInfo,
  jobSeekers,
  delayedExecutionAbilities,
  nextFightFighters
}: AbilityCardProps) => {


  const {closeModal, showFighter} = frontEndService().setClientState

  const [state, setState] = useState({
    listOptions: [] as ListOption[],
    selectListType: null as 'source' | 'target',
    activeAbility: abilityData
  })

  let {sendUpdate} = frontEndService()
  let {activeAbility} = state



  const clientAbility: ClientAbility = abilityServiceClient.abilities.find(ability => ability.name == activeAbility.name)
  if(!activeAbility.source)
    activeAbility.source = abilityServiceClient.getAppropriateSource(clientAbility, managerInfo)

  if(clientAbility.name == 'Offer Contract')
    setContractOffer(activeAbility)



  if(!clientAbility)
    return <div>....loading</div>
    const {longDescription, possibleTargets, name, cost} = clientAbility
    const {target, source, additionalData, } = activeAbility

    
  let warningMessage
  if(abilityServiceClient.canOnlyBeTargetedOnceConflict(clientAbility, activeAbility, delayedExecutionAbilities, managerInfo))
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

  if(clientAbility.name == 'Offer Contract' && activeAbility.target){
    let goalContract: GoalContract
    if(activeAbility.target.type == 'fighter owned by manager')
      goalContract = managerInfo.knownFighters.find(fighter => fighter.name == activeAbility.target.name).goalContract
    else
      goalContract = jobSeekers.find(jobSeeker => jobSeeker.name == activeAbility.target.name).goalContract
    const contractOffer: ContractOffer = activeAbility.additionalData.contractOffer
    offerContractBox = 
      <InfoBox 
        heading={'Contract Offer'}
        list={[                  
          {label: 'Goal money per week', value: goalContract.weeklyCost},
          {label: 'Number of weeks', value: goalContract.numberOfWeeks},
          {label: 'Your money offer per week', value: 
            <input className='money-offer' type="number" value={contractOffer.weeklyCost} onChange={setContractOfferValue.bind(this)} onKeyPress={handleEnterEvent.bind(this)}/>
          }
        ]}
      />
  }

  return (
    <Modal>
      <div className='ability-card card'>
        <div className=' card_heading heading'>{name}</div>
        <div className="card__two-columns">
          <div className={`card__two-columns__left ability-card__image ${'ability-card__image__'+activeAbility.name.toLocaleLowerCase().split(' ').join('-')}`}
          ></div>
          <div className='card__two-columns__right'>
            <InfoBox 
                heading={'Ability Info'}
                info={longDescription}
            />
            {clientAbility.cost.money > 0 && 
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
              onClick={() => showSelectList('target')}>Set Target</button>
            </div> : ''
          }
          <div className='source'>
            <label className='source__label'>Source:</label>
            {source ?
              <div className="source__value">{source.name}</div> :
              <div className="source__value source__value--required">source required</div>
            }
            <button className='standard-button source__set-button' 
            onClick={() => showSelectList('source')}>Set Source</button>
          </div>
        </div>

        <hr/>
        
        <button className='standard-button ability-card__button' onClick={confirmButtonClicked.bind(this)}>Confirm</button>
        
        {state.selectListType &&
          <Modal onClose={resetSelectList}>
            <SelectList 
              nextFightFighters={nextFightFighters.map(f => f.name)}
              list={state.listOptions} 
              type={state.selectListType}
              itemSelected={listItemSelected.bind(this)}
            />
          </Modal>
        }
      </div>
    </Modal>
  )
  
  function setContractOffer(activeAbility: AbilityData){


    if(activeAbility?.target){
      let goalContract: GoalContract
      if(activeAbility.target.type == 'fighter owned by manager')
        goalContract = managerInfo.knownFighters.find(fighter => fighter.name == activeAbility.target.name).goalContract
      else
        goalContract = jobSeekers.find(jobSeeker => jobSeeker.name == activeAbility.target.name).goalContract
      
      activeAbility.additionalData = {
        contractOffer: {
          numberOfWeeks: goalContract.numberOfWeeks,
          weeklyCost: goalContract.weeklyCost
        }
      }

    }
  }

  function showSelectList(type: 'source' | 'target'){
    if(type == 'source')
      setState({...state, listOptions: abilityServiceClient.getPossibleSources(clientAbility, managerInfo), selectListType: type})
    if(type == 'target')
      setState({...state, listOptions: abilityServiceClient.getPossibleTargets(clientAbility, managerInfo, jobSeekers), selectListType: type})
  }

  
  function confirmButtonClicked(){
    try{
      abilityServiceClient.validateAbilityConfirm(clientAbility, managerInfo, activeAbility, delayedExecutionAbilities)
      sendUpdate.abilityConfirmed(activeAbility)
    }
    catch(error){
      console.log(error)
      alert(error)
    }
    

    closeModal()

    if(activeAbility.name == 'Research Fighter'){
      let {knownFighters} = frontEndService().frontEndStore.getState().serverUIState.serverGameUIState.playerManagerUIState.managerInfo
      const fighter: FighterInfo = knownFighters.find(f => f.name == target.name)
      
      showFighter(fighter)
    }   
  }

  function resetSelectList(){
    setState({...state, listOptions: undefined, selectListType: undefined})
  }

  function listItemSelected(item: any, type: 'source' | 'target'){
    if(type == 'source')
      setState({
        ...state, activeAbility: {...state.activeAbility, source: item}
    })
    else if(type == 'target'){
      activeAbility.target = item
      if(clientAbility.name == 'Offer Contract')
        setContractOffer(activeAbility)

      setState({...state, activeAbility})
    }
    resetSelectList()
  }

  function setContractOfferValue(inputElement){
    let value: any = parseInt(inputElement.target.value)
    value = value >= 0 ? value : ''

    const contractOffer: ContractOffer = {  
      ...state.activeAbility.additionalData.contractOffer,        
      weeklyCost: value    
    }

    setState({
      ...state, 
      activeAbility: {
        ...state.activeAbility, 
        additionalData: {contractOffer}
      }
    })
  }

  function handleEnterEvent(event){
    if(event.key == 'Enter')
      event.target.blur()
  }
}

const mapStateToProps = ({
  clientUIState: {clientGameUIState: {
    clientManagerUIState: {activeCard}
  }},
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {
      managerInfo,
      delayedExecutionAbilities,
      jobSeekers,
      nextFightFighters
    }
  }}
}: FrontEndState): AbilityCardProps => ({
  managerInfo,
  delayedExecutionAbilities,
  jobSeekers,
  nextFightFighters,
  abilityData: activeCard.data
})
export default connect(mapStateToProps)(AbilityCard)