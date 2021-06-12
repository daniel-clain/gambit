import * as React from "react";
import { ManagerInfo } from "../../../../../../../game-components/manager";
import { ListOption } from "../../../../../../../types/game/list-option";
import './select-list.scss'

interface SelectListProps{
  list: ListOption[]
  type: 'source' | 'target'
  nextFightFighters: string[]
  managerInfo: ManagerInfo
  itemSelected(item: any, type: 'source' | 'target')
}
export default function SelectList(props: SelectListProps){
  const {type, itemSelected, list, nextFightFighters, managerInfo} = props
  return (
    <div className="select-list">
      {list.map(listItem => 
        <div 
          key={listItem.name} 
          className={`select-list__item`}
          onClick={() => itemSelected(listItem, type)}
        >
          <div className="item-name">
            {listItem.name}
          </div>
          {getType(listItem)}
             
        </div>
      )}
    </div>
  )

  function getType(listItem: ListOption){
    let returnElems: JSX.Element[] = []
    const managerImage = !['Manager', 'this manager', 'opponent manager'].includes(listItem.type) ? null : (
      managerInfo.name == listItem.name && managerInfo.image || 
      managerInfo.otherManagers.find(m => m.name = listItem.name).image
    )

    if(nextFightFighters.includes(listItem.name)){
      returnElems.push(<div className="fighter-in-next-fight"></div>)
    }      
    if(listItem.type == 'fighter owned by manager'){
      returnElems.push(<div className="your-fighter"></div>)
    }     
    if(managerImage){
      returnElems.push(<div className={`manager ${
        managerImage == 'Fat Man' && 'manager--fat-man' || 
        managerImage == 'Moustache Man' && 'manager--moustache-man'
      }`}></div>)
    } 
  }
};
