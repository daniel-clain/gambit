
import * as React from 'react';
import { useState } from 'react';
import { AbilityData, ClientAbility } from '../../../../../../../game-components/abilities-general/ability';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { ListOption } from '../../../../../../../types/game/list-option';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { FighterInfo, FrontEndState, JobSeeker } from '../../../../../../../interfaces/front-end-state-interface';
import '../modal-card.scss';
import SelectList from '../select-list/select-list';
import './ability-card.scss';
import {connect, ConnectedProps} from 'react-redux'
import { Modal } from '../../partials/modal/modal';
import { InfoBox } from '../../partials/info-box/info-box';
import { OfferContractPartial } from './offer-contract-partial';
import { hot } from 'react-hot-loader/root';



export interface AbilityCardProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  nextFightFighters: string[]
  managerInfo: ManagerInfo
  jobSeekers: JobSeeker[]
  
}



const mapState = ({
  clientUIState: {clientGameUIState: {
    clientManagerUIState: {activeModal}
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
  abilityData: activeModal.data
})

const mapDispatch = {
  showFighter: name => ({type: 'showFighter', payload: name}),
  closeModal: () => ({type: 'closeModal'})
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

export const AbilityCard = connector(hot(({
  abilityData,
  managerInfo,
  jobSeekers,
  delayedExecutionAbilities,
  nextFightFighters,
  showFighter,
  closeModal
}: PropsFromRedux) => {


  let {sendUpdate, setClientState, abilityService} = frontEndService 

  const [state, setState] = useState({
    listOptions: [] as ListOption[],
    selectListType: null as 'source' | 'target',
  })

  let [activeAbility, setActiveAbility] = useState({...abilityData})


  const clientAbility: ClientAbility = abilityService.abilities.find(ability => ability.name == activeAbility.name)
  if(!activeAbility.source)
    activeAbility.source = abilityService.getAppropriateSource(clientAbility, managerInfo)




  if(!clientAbility)
    return <div>....loading</div>
    const {longDescription, possibleTargets, name, cost} = clientAbility
    const {target, source } = activeAbility

    
  let warningMessage
  if(abilityService.canOnlyBeTargetedOnceConflict(clientAbility, activeAbility, delayedExecutionAbilities, managerInfo))
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
        {}

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

        {activeAbility.name == 'Offer Contract' ?
          <OfferContractPartial {...{activeAbility, setActiveAbility, jobSeekers, managerInfo}}/> : ''
        }

        <hr/>
        
        <button className='standard-button ability-card__button' onClick={confirmButtonClicked.bind(this)}>Confirm</button>
        
        {state.selectListType &&
          <Modal onClose={resetSelectList}>
            <SelectList 
              nextFightFighters={nextFightFighters}
              list={state.listOptions} 
              type={state.selectListType}
              itemSelected={listItemSelected.bind(this)}
            />
          </Modal>
        }
      </div>
    </Modal>
  )
  

  function showSelectList(type: 'source' | 'target'){
    if(type == 'source')
      setState({...state, listOptions: abilityService.getPossibleSources(clientAbility, managerInfo), selectListType: type})
    if(type == 'target')
      setState({...state, listOptions: abilityService.getPossibleTargets(clientAbility, managerInfo, jobSeekers), selectListType: type})
  }

  
  function confirmButtonClicked(){
    try{
      abilityService.validateAbilityConfirm(clientAbility, managerInfo, activeAbility, delayedExecutionAbilities)
      sendUpdate.abilityConfirmed(activeAbility)
    }
    catch(error){
      console.log(error)
      alert(error)
    }
    

    closeModal()

    if(activeAbility.name == 'Research Fighter'){
      let {knownFighters} = frontEndService .frontEndStore.getState().serverUIState.serverGameUIState.playerManagerUIState.managerInfo
      const fighter: FighterInfo = knownFighters.find(f => f.name == target.name)
      
      showFighter(fighter.name)
    }   
  }

  function resetSelectList(){
    setState({...state, listOptions: undefined, selectListType: undefined})
  }

  function listItemSelected(item: any, type: 'source' | 'target'){
    if(type == 'source'){
      setActiveAbility({...activeAbility, source: item})
    }
    else if(type == 'target'){
      setActiveAbility({...activeAbility, target: item})
    }
    resetSelectList()
  }

  
}))