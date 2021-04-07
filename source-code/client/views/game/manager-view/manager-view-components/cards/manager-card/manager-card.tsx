import * as React from "react"
import { hot } from "react-hot-loader/root"
import { connect } from "react-redux"
import { KnownManager } from "../../../../../../../game-components/manager"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { frontEndService } from "../../../../../../front-end-service/front-end-service"
import { InfoBox } from "../../partials/info-box/info-box"
import { Modal } from "../../partials/modal/modal"

const {managerMap} = frontEndService
const map = managerMap<{manager: KnownManager}>(({activeModal:{data}}) => ({manager: data}))

export const ManagerCard = connect(map)(hot(({manager}) => 
    
    <Modal>
      <div className='card manager-card'>
        <div className='card__heading heading'>{manager.name}</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left manager-card__image'></div>
          <div className='card__two-columns__right'>
            {getManagerInfoElems(manager)}
          </div>
        </div>

        <div className='heading'>Options</div>
        <div className='card__options'>        
        </div>
      </div >
    </Modal>
))

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