import * as React from "react"
import { KnownManager } from "../../../../../../../game-components/manager"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { InfoBox } from "../../partials/info-box/info-box"

interface ManagerCardProps{
  manager: KnownManager
}

const ManagerCard = ({manager}: ManagerCardProps) => {



  return (
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
  )
  
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
}

export default ManagerCard