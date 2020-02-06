import * as React from 'react';
import './info-box.scss'
import { InfoBoxListItem } from '../../../../../interfaces/game/info-box-list';
export default function InfoBox({heading, list}: {heading: string, list: InfoBoxListItem[]}){
  return (
    <div className="info-box">
      <div className="info-box__heading">{heading}</div>
      <div className="info-box__content">
        <div className="list">
          <div className="list__labels">
            {list.map(listItem => <div key={listItem.label}>{listItem.label}:</div>)}
          </div>
          <div className="list__values">
            {list.map(listItem => <div key={listItem.label}>{listItem.value}</div>)}
          </div>
        </div>
      </div>
    </div> 
  )
}