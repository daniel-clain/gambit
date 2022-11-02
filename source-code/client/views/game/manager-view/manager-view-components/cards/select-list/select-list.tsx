import * as React from "react";
import { ListOption, SourceTypes, TargetTypes } from "../../../../../../../game-components/abilities-general/ability";
import { ManagerUIState } from "../../../../../../../interfaces/front-end-state-interface";
import './select-list.scss'

interface SelectListProps{
  list: ListOption[]
  type: 'source' | 'target'
  playerManagerUIState: ManagerUIState
  itemSelected(item: TargetTypes | SourceTypes, type: 'source' | 'target')
}
export default function SelectList(props: SelectListProps){
  const {type, itemSelected, list, playerManagerUIState} = props

  const {managerInfo, nextFightFighters} = playerManagerUIState
  
  return (
    <div className="select-list">
      {list.map(listItem => 
        <div key={listItem.name}
          className={`select-list__item`}
          onClick={() => itemSelected(listItem, type)}
        >
          <div className="item-name">
            {listItem.name}
          </div>
          {getTypeIcon(listItem)}
             
        </div>
      )}
    </div>
  )

  function getTypeIcon(listItem: ListOption){
    let returnElems: JSX.Element[] = []
    const managerImage = listItem.characterType == 'Manager' && listItem.image
    if(type == 'target'){
      const target = listItem as TargetTypes
      if(target.characterType == 'Fighter'){

        returnElems.push(
          <div 
            key={'f'}
            className="icon fighter-icon"
          ></div>
        )

        const inNextFight = nextFightFighters.find(fighterName => fighterName == target.name)
        if(inNextFight){
          returnElems.push(
            <div 
              key={'n'}
              className="icon fighter-in-next-fight"
            ></div>
          )
        }
        const isYourFighter = managerInfo.fighters.find(f => f.name == target.name)
        if(isYourFighter){
          returnElems.push(
            <div 
              key={'y'}
              className="icon your-fighter"
            ></div>
          )
        }
      }

      if(target.characterType == 'Job Seeker'){
        returnElems.push(
          <div 
            key={'j'}
            className="icon job-seeker"
          ></div>
        )
      }
    }     
         
    if(managerImage){
      returnElems.push(
        <div 
          key={'m'}
          className={`manager ${
            managerImage == 'Fat Man' && 'manager--fat-man' || 
            managerImage == 'Moustache Man' && 'manager--moustache-man'
          }`}
        ></div>
      )
    } 
    return returnElems
  }
};
