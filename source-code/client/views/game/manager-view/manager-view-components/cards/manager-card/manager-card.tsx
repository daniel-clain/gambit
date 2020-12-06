import React from "react"
import { Manager } from "socket.io-client"
import { KnownManager, ManagerInfo } from "../../../../../../../game-components/manager"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import InfoBox from "../../partials/info-box/info-box"

interface ManagerCardProps<T extends KnownManager>{
  manager: T
  isPlayersManager: boolean
}

const ManagerCard = ({manager, isPlayersManager}: ManagerCardProps<ManagerInfo | KnownManager>) => {

  manager = isPlayersManager ? manager as ManagerInfo : manager


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
    if(isPlayersManager){
      const playersManager = manager as ManagerInfo
      infoBoxList.push(
        {label: 'Money', value: playersManager.money},
        {label: 'Action Points', value: playersManager.actionPoints},
        {label: 'Abilities', value: playersManager.abilities.join()},
        {label: 'Employees', value: playersManager.employees.length},
        {label: 'Fighters', value: playersManager.yourFighters.length},
      )
    }
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