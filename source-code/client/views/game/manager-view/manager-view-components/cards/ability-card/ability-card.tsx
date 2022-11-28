
import * as React from 'react';
import { useState } from 'react';
import { AbilityData, ClientAbility, DataEvidence, ListOption, SourceTypes, TargetTypes } from '../../../../../../../game-components/abilities-general/ability';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { FighterInfo } from '../../../../../../../interfaces/front-end-state-interface';
import '../modal-card.scss';
import SelectList from '../select-list/select-list';
import './ability-card.scss';
import { Modal } from '../../partials/modal/modal';
import { InfoBox } from '../../partials/info-box/info-box';
import { OfferContractPartial } from './offer-contract-partial';
import { CheckboxItem } from '../../partials/checkbox-item/checkbox-item';
import { Evidence, IllegalActivityName_Set } from '../../../../../../../types/game/evidence.type';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { websocketService } from '../../../../../../front-end-service/websocket-service';
import { closeModal, showFighter, showManager } from '../../../../../../front-end-service/front-end-service';
import { observer } from 'mobx-react';
import { abilities } from '../../../../../../client-abilities/client-abilities';
import { canOnlyBeTargetedOnceConflict, getAppropriateSource, getPossibleSources, getPossibleTargets, validateAbilityConfirm } from '../../../../../../front-end-service/ability-service-client';
type AbilityCardState = {
  listOptions: ListOption[], 
  selectListType: 'source' | 'target' | undefined
}
export const AbilityCard = observer(() => {

  const {
    clientUIState: {clientGameUIState: {
      clientManagerUIState: {activeModal}
    }},
    serverUIState: {serverGameUIState}
  } = frontEndState

  const {
    enoughFightersForFinalTournament,
    playerManagerUIState
  } = serverGameUIState!

  const {
    managerInfo,
    delayedExecutionAbilities,
    jobSeekers,
    week
  } = playerManagerUIState!
  
  const abilityData = activeModal!.data as AbilityData



  const [state, setState] = useState<AbilityCardState>({
    listOptions: [],
    selectListType: undefined
  })

  const [activeAbility, setActiveAbility] = useState({...abilityData})


  const clientAbility: ClientAbility = abilities.find(ability => ability.name == activeAbility.name)!
  const possibleTargets = getPossibleTargets(clientAbility, managerInfo, jobSeekers)
  const possibleSources = getPossibleSources(clientAbility, managerInfo)


  if(!activeAbility.source){
    activeAbility.source = getAppropriateSource(clientAbility, managerInfo)
  }





  const {longDescription, name, cost} = clientAbility
  const {target, source } = activeAbility
  

    
  let warningMessage
  
  if(canOnlyBeTargetedOnceConflict(clientAbility, activeAbility, delayedExecutionAbilities, managerInfo)){
    warningMessage = `${name} can only target the same target once`
  }

  const abilityRequirementsInfo: InfoBoxListItem[] = [
      {label: 'Money Cost', value: cost.money},
      {label: 'Action Points', value: cost.actionPoints,}
  ]
  if(name == 'Dope Fighter' || name == 'Poison Fighter'){
    abilityRequirementsInfo.push({
      label: 'Requires:', value: 'Must have a drug dealer working for you'
    })
  }

  const noNeedForTargetSelect: boolean = clientAbility.isValidTarget == undefined

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
            
            <InfoBox 
              heading={'Ability Requirements'}
              list={abilityRequirementsInfo}
            />
            {warningMessage ? 
              <div className="warning-message">{warningMessage}</div> : ''
            }
          </div>
        </div>

        <>
          <hr/>
              
          <div className='ability-card__variables'>
            {noNeedForTargetSelect ? '' : 
              <div className='target'>
                <label className='target__label'>Target:</label>
                {target ?
                  <div className="target__value">{target.name}</div> :
                  <div className="target__value target__value--required">target required</div>
                }
                <button 
                  disabled={!possibleTargets.length}
                  className='standard-button target__set-button' 
                  onClick={() => showSelectList('target')}
                >Set Target</button>
              </div>
            }
            <div className='source'>
              <label className='source__label'>Source:</label>
              {source ?
                <div className="source__value">{source.name}</div> :
                <div className="source__value source__value--required">source required</div>
              }
              <button 
                disabled={!possibleSources.length}
                className='standard-button source__set-button' 
                onClick={() => showSelectList('source')}
              >Set Source</button>
            </div>

            {abilityData.name == 'Prosecute Manager' &&
            activeAbility.target ? 
              <div className="evidence-items-container">
                {Array.from(IllegalActivityName_Set).map(illegalActivity => {
                  return <div className="illegal-activity" key={illegalActivity}>
                    <div className="illegal-activity__name">{illegalActivity}</div>                  
                    <div className="illegal-activity__evidence-items">
                      {managerInfo.evidence
                      .filter(e => e.managerName == activeAbility.target?.name)
                      .filter(e => e.illegalActivity == illegalActivity)
                      .map((evidence, index) => 
                        <CheckboxItem 
                          key={evidence.illegalActivity+index}
                          onSelected={() => onEvidenceToggle(evidence, index)}
                          selected={isEvidenceSelected(evidence, index)}>
                            {evidence.evidenceDescription}
                        </CheckboxItem>
                      )}
                    </div>
                  </div>
                })}
              </div> : ''}
          </div>
        </>

        {activeAbility.name == 'Offer Contract' ?
          <OfferContractPartial {...{activeAbility, setActiveAbility, jobSeekers, managerInfo}}/> : ''
        }

        <hr/>
        
        <button className='standard-button ability-card__button' onClick={confirmButtonClicked.bind(this)}>Confirm</button>
        
        {state.selectListType &&
          <Modal onClose={resetSelectList}>
            <SelectList 
              playerManagerUIState={playerManagerUIState!}
              list={state.listOptions} 
              type={state.selectListType}
              itemSelected={listItemSelected.bind(this)}
            />
          </Modal>
        }
      </div>
    </Modal>
  )
  
  function isEvidenceSelected(evidence: Evidence, index: number){
    const evidenceItems = activeAbility.additionalData as DataEvidence[]
    return !!evidenceItems?.find(e => 
      e.id == evidence.illegalActivity + evidence.managerName + index
    )
  }

  function showSelectList(type: 'source' | 'target'){
    if(type == 'source')
      setState({...state, listOptions: possibleSources, selectListType: type})
    if(type == 'target')
      setState({...state, listOptions: possibleTargets, selectListType: type})
  }

  
  function confirmButtonClicked(){
    try{
      validateAbilityConfirm(clientAbility, managerInfo, activeAbility, delayedExecutionAbilities, week, enoughFightersForFinalTournament)
      websocketService.sendUpdate.abilityConfirmed(activeAbility)
    }
    catch(error){
      console.log(error)
      alert(error)
      return
    }
    

    closeModal()

    if(activeAbility.name == 'Research Fighter'){
      let {knownFighters} = managerInfo
      const fighter: FighterInfo = knownFighters.find(f => f.name == target!.name)!
      
      showFighter(fighter.name)
    }   
    if(activeAbility.name == 'Investigate Manager'){
      let knownManager = managerInfo.otherManagers.find(m => m.name == target!.name)!
      
      showManager(knownManager.name)
    } 
  }

  function onEvidenceToggle(evidence: Evidence, index: number){
    const evidenceId = evidence.illegalActivity+evidence.managerName+index
    const evidenceItems = activeAbility.additionalData as DataEvidence[]
    const evidenceAlreadyChecked = evidenceItems?.find(e => e.id == evidenceId)
    if(evidenceAlreadyChecked){
      setActiveAbility({...activeAbility, additionalData: [...evidenceItems?.filter(e => e.id != evidenceId)]})
    } else {
      const evidenceObj: DataEvidence = {
        id: evidenceId,
        evidence
      }
      const checkedEvidence: DataEvidence[] = activeAbility.additionalData ? [...evidenceItems, evidenceObj] : [evidenceObj]
      setActiveAbility({...activeAbility, additionalData: checkedEvidence})
    }

  }

  function resetSelectList(){
    setState({...state, listOptions: [], selectListType: undefined})
  }

  function listItemSelected(item: TargetTypes | SourceTypes, type: 'source' | 'target'){
    console.log('item :>> ', item);
    if(type == 'source'){
      const source = item as SourceTypes
      setActiveAbility({...activeAbility, source})
    }
    else if(type == 'target'){
      const target = item as TargetTypes
      setActiveAbility({...activeAbility, target})
    }
    resetSelectList()
  }

  
})