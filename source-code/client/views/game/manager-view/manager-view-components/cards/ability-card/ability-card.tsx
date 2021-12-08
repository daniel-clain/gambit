
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
import { CheckboxItem } from '../../partials/checkbox-item/checkbox-item';
import { Evidence, IllegalActivityName, IllegalActivityName_Set } from '../../../../../../../types/game/evidence.type';



export interface AbilityCardProps{
  delayedExecutionAbilities: AbilityData[]
  abilityData: AbilityData
  nextFightFighters: string[]
  managerInfo: ManagerInfo
  jobSeekers: JobSeeker[]
  round: number
  enoughFightersForFinalTournament: boolean
}



const mapState = ({
  clientUIState: {clientGameUIState: {
    clientManagerUIState: {activeModal}
  }},
  serverUIState: {serverGameUIState: {
    enoughFightersForFinalTournament,
    playerManagerUIState: {
      managerInfo,
      delayedExecutionAbilities,
      jobSeekers,
      nextFightFighters,
      round
    }
  }}
}: FrontEndState): AbilityCardProps => ({
  managerInfo,
  delayedExecutionAbilities,
  jobSeekers,
  nextFightFighters,
  abilityData: activeModal.data,
  round,
  enoughFightersForFinalTournament
})

const mapDispatch = {
  showFighter: name => ({type: 'showFighter', payload: name}),
  showManager: name => ({type: 'showManager', payload: name}),
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
  closeModal,
  round,
  enoughFightersForFinalTournament
}: PropsFromRedux) => {


  let {sendUpdate, abilityService} = frontEndService 

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
    const {longDescription, validTargetIf, name, cost, possibleSources} = clientAbility
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

  const noNeedForSourceSelect: boolean = possibleSources.length == 1 && possibleSources[0] == 'Manager'

  const noNeedForTargetSelect: boolean = !validTargetIf.length


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

        {noNeedForSourceSelect && noNeedForTargetSelect ? '' : <>
          <hr/>
              
          <div className='ability-card__variables'>
            {noNeedForTargetSelect ? '' : 
              <div className='target'>
                <label className='target__label'>Target:</label>
                {target ?
                  <div className="target__value">{target.name}</div> :
                  <div className="target__value target__value--required">target required</div>
                }
                <button className='standard-button target__set-button' 
                onClick={() => showSelectList('target')}>Set Target</button>
              </div>
            }
            {noNeedForSourceSelect ? '' :
              <div className='source'>
                <label className='source__label'>Source:</label>
                {source ?
                  <div className="source__value">{source.name}</div> :
                  <div className="source__value source__value--required">source required</div>
                }
                <button className='standard-button source__set-button' 
                onClick={() => showSelectList('source')}>Set Source</button>
              </div>
            }

            {abilityData.name == 'Prosecute Manager' &&
            activeAbility.target ? 
              <div className="evidence-items-container">
                {Array.from(IllegalActivityName_Set).map(illegalActivity => {
                  return <div className="illegal-activity" key={illegalActivity}>
                    <div className="illegal-activity__name">{illegalActivity}</div>                  
                    <div className="illegal-activity__evidence-items">
                      {managerInfo.evidence
                      .filter(e => e.managerName == activeAbility.target.name)
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
        </>}

        {activeAbility.name == 'Offer Contract' ?
          <OfferContractPartial {...{activeAbility, setActiveAbility, jobSeekers, managerInfo}}/> : ''
        }

        <hr/>
        
        <button className='standard-button ability-card__button' onClick={confirmButtonClicked.bind(this)}>Confirm</button>
        
        {state.selectListType &&
          <Modal onClose={resetSelectList}>
            <SelectList 
              managerInfo={managerInfo}
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
  
  function isEvidenceSelected(evidence, index){
    return !!activeAbility.additionalData?.find(e => e.id == evidence.illegalActivity+evidence.managerName+index)
  }

  function showSelectList(type: 'source' | 'target'){
    if(type == 'source')
      setState({...state, listOptions: abilityService.getPossibleSources(clientAbility, managerInfo), selectListType: type})
    if(type == 'target')
      setState({...state, listOptions: abilityService.getPossibleTargets(clientAbility, managerInfo, jobSeekers, nextFightFighters), selectListType: type})
  }

  
  function confirmButtonClicked(){
    try{
      abilityService.validateAbilityConfirm(clientAbility, managerInfo, activeAbility, delayedExecutionAbilities, round, enoughFightersForFinalTournament)

      sendUpdate.abilityConfirmed(activeAbility)
    }
    catch(error){
      console.log(error)
      alert(error)
      return
    }
    

    closeModal()

    if(activeAbility.name == 'Research Fighter'){
      let {knownFighters} = frontEndService.frontEndStore.getState().serverUIState.serverGameUIState.playerManagerUIState.managerInfo
      const fighter: FighterInfo = knownFighters.find(f => f.name == target.name)
      
      showFighter(fighter.name)
    }   
  }

  function onEvidenceToggle(evidence: Evidence, index: number){
    const evidenceId = evidence.illegalActivity+evidence.managerName+index
    const evidenceAlreadyChecked = activeAbility.additionalData?.find(e => e.id == evidenceId)
    if(evidenceAlreadyChecked){
      setActiveAbility({...activeAbility, additionalData: [...activeAbility.additionalData?.filter(e => e.id != evidenceId)]})
    } else {
      const evidenceObj = {
        id: evidenceId,
        evidence
      }
      const checkedEvidence = activeAbility.additionalData ? [...activeAbility.additionalData, evidenceObj] : [evidenceObj]
      setActiveAbility({...activeAbility, additionalData: checkedEvidence})
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