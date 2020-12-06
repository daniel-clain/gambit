import * as React from 'react';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import './info-box.scss'

export interface InfoBoxProps{
  heading: string
  info?: string
  list?: InfoBoxListItem[]
  children?
}


export default function InfoBox(props: InfoBoxProps){
  const {heading, info, list, children} = props
  return (
    <div className="info-box">
      <div className="info-box__heading">{heading}</div>
      <div className="info-box__content">
        {info &&
          <div className='info'>{info}</div>
        }
        {list &&
          <div className="list">
            <div className="list__labels">
              {list.map(listItem => <div key={listItem.label}>{listItem.label}:</div>)}
            </div>
            <div className="list__values">
              {list.map(listItem => <div key={listItem.label}>{listItem.value}</div>)}
            </div>
          </div>
        }
        {children}
      </div>
    </div> 
  )
}