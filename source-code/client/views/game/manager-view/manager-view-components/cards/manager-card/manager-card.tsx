import * as React from "react"
import { hot } from "react-hot-loader/root"
import { connect, ConnectedProps } from "react-redux"
import { KnownManager } from "../../../../../../../game-components/manager"
import { FrontEndState } from "../../../../../../../interfaces/front-end-state-interface"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { Evidence } from "../../../../../../../types/game/evidence.type"
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
  },
  serverUIState:{serverGameUIState: {playerManagerUIState: {managerInfo}}}
}: FrontEndState) => ({manager: data, clientName, managerInfo})

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export const ManagerCard = connector(hot(({manager, clientName, managerInfo}: PropsFromRedux) => {

  const isYourManager = manager.name == clientName


  let abilitiesYourManagerCanDo, abilitiesManagerCanBeTheTargetOf, evidenceAgainstManager: Evidence[]

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
    abilitiesManagerCanBeTheTargetOf = abilityService.abilities.filter(a => a.validTargetIf.includes('opponent manager')).map(a => 
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

      evidenceAgainstManager = managerInfo.evidence.filter(e => e.managerName == manager.name)
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
  
  function getManagerInfoElems(manager: KnownManager){
    let infoBoxList: InfoBoxListItem[]
    const {money, loan, employees, fighters, evidence, name} = manager
    if(isYourManager){
      infoBoxList = [
        { label: 'Name', value: name },
        { label: 'Money', value: money.lastKnownValue },
        { label: 'Loan', value: loan.lastKnownValue.debt },
        { label: 'Fighters', value: fighters.lastKnownValue.map(f => f.name) },
        { label: 'Employees', value: employees.lastKnownValue.map(e => `${e.name}(${e.profession})`) },
        { label: 'Evidence', value: evidence.lastKnownValue.length }
      ]
    } else {
      infoBoxList = [
        { label: 'Name', value: name },
        { label: 'Money', value: money ? `${money.lastKnownValue} (${money.roundsSinceUpdated})` : 'unknown' },
        { label: 'Loan', value: loan ? `${loan.lastKnownValue.debt} (${loan.roundsSinceUpdated})` : 'unknown' },
        { label: 'Fighters', value: fighters?.lastKnownValue ? `${!fighters.lastKnownValue.length ? '0' : fighters.lastKnownValue.map(f => `\n${f.name}`)} (${fighters.roundsSinceUpdated})` : 'unknown' },
        { label: 'Employees', value: employees?.lastKnownValue ? `${!employees.lastKnownValue.length ? '0' : employees.lastKnownValue.map(e => `\n${e.name}(${e.profession})`)} (${employees.roundsSinceUpdated})` : 'unknown' },
        { label: 'Evidence', value: evidence?.lastKnownValue ? `${!evidence.lastKnownValue.length ? '0' : evidence.lastKnownValue.length} (${evidence.roundsSinceUpdated})` : 'unknown' }
      ]

    }

    return (
      <div className='manager-card__stats'>
        <InfoBox
          heading={`Manager Info`}
          list={infoBoxList}
        >
          {evidenceAgainstManager?.length ? 
          
            <div className="manager-card__evidence-container">
              {evidenceAgainstManager.map(e => 
                <div className="manager-card__evidence">
                  {`* ${e.evidenceDescription}`}
                </div>
              )}
            </div>  
            : ''
        }
        </InfoBox>
      </div>
    )
  }
}))
