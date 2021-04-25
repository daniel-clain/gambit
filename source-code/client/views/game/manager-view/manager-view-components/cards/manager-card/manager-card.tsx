import * as React from "react"
import { hot } from "react-hot-loader/root"
import { connect } from "react-redux"
import { KnownManager } from "../../../../../../../game-components/manager"
import { FrontEndState } from "../../../../../../../interfaces/front-end-state-interface"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { abilityService } from "../../../../../../front-end-service/ability-service-client"
import {AbilityBlock} from '../../partials/ability-block/ability-block';
import { InfoBox } from "../../partials/info-box/info-box"
import { Modal } from "../../partials/modal/modal"


const mapStateToProps = ({
  clientUIState: {
    clientPreGameUIState: {clientName},
    clientGameUIState: {
      clientManagerUIState: {activeModal: {data}}
    }
  }
}: FrontEndState) => ({manager: data, clientName})


export const ManagerCard = connect(mapStateToProps)(hot(({manager, clientName}) => {

  const isYourManager = manager.name == clientName


  let abilitiesYourManagerCanDo, abilitiesManagerCanBeTheTargetOf

  if(isYourManager){
    abilitiesYourManagerCanDo = abilityService.abilities.filter(a => a.possibleSources.includes('Manager')).map(a => 
    <AbilityBlock 
      key={a.name}
      abilityData={{
        name: a.name,
        source: {
          name: manager.name,
          type: 'Manager'
        },
        target: undefined
      }}
    />)
      
  } else {
    abilitiesManagerCanBeTheTargetOf = abilityService.abilities.filter(a => a.possibleTargets.includes('opponent manager')).map(a => 
      <AbilityBlock 
        key={a.name}
        abilityData={{
          name: a.name,
          source: undefined,
          target: {
            name: manager.name,
            type: 'opponent manager'
          }
        }}
      />)

  }


    
  return (
    <Modal>
      <div className='card manager-card'>
        <div className='card__heading heading'>{manager.name}</div>
        <div className="card__two-columns">
          <div className={`card__two-columns__left manager-card__image manager-card__image--${manager.image.toLowerCase().split(' ').join('-')}`}></div>
          <div className='card__two-columns__right'>
            {getManagerInfoElems(manager)}
          </div>
        </div>

        <div className='heading'>Options</div>
        <div className='card__options'> 
          {isYourManager ? abilitiesYourManagerCanDo : abilitiesManagerCanBeTheTargetOf}       
        </div>
      </div >
    </Modal>
  )
}))

function getManagerInfoElems(manager: KnownManager){
  const infoBoxList: InfoBoxListItem[] = [
    { label: 'Name', value: manager.name }
  ]
  return (
    <div className='manager-card__stats'>
      <InfoBox
        heading={`Manager Info`}
        list={infoBoxList}
      />
    </div>
  )
}