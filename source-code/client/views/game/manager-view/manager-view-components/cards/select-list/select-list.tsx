import * as React from "react";
import { ListOption } from "../../../../../../../types/game/list-option";
import './select-list.scss'

interface SelectListProps{
  list: ListOption[]
  type: 'source' | 'target'
  nextFightFighters: string[]
  itemSelected(item: any, type: 'source' | 'target')
}
export default function SelectList(props: SelectListProps){
  const {type, itemSelected, list, nextFightFighters} = props
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

  function getType(listItem){
    let returnElems: JSX.Element[] = []
    if(nextFightFighters.includes(listItem.name)){
      returnElems.push(<div className="fighter-in-next-fight"></div>)
    }      
    if(listItem.type == 'fighter owned by manager'){
      returnElems.push(<div className="your-fighter"></div>)
    }     
    if(listItem.type == 'opponent manager' || listItem.type == 'Manager'){
      returnElems.push(<div className="manager"></div>)
    } 
  }
};
