import * as React from "react";
import { ListOption } from "../../../../../types/game/list-option";
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
          {nextFightFighters.includes(listItem.name) && 
            <div className="fighter-in-next-fight"></div>
          }      
          {listItem.type == 'fighter owned by manager' && 
            <div className="your-fighter"></div>
          }     
          {listItem.type == 'opponent manager' || listItem.type == 'Manager' && 
            <div className="manager"></div>
          }    
        </div>
      )}
    </div>
  )
};
