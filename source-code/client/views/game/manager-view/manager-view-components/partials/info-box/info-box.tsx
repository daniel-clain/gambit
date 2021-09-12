import * as React from 'react';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import './info-box.scss'

export interface InfoBoxProps{
  heading?: string
  info?: string
  list?: InfoBoxListItem[]
  children?
}


export const InfoBox = ({heading, info, list, children}: InfoBoxProps) =>
  <div className="info-box">
    <div className="info-box__heading">{heading}</div>
    <div className="info-box__content">
      {info &&
        <div className='info'>{info}</div>
      }
      {list &&
        <div className="list">
          {list.map(listItem => ([
              <div className="list__label" key={listItem.label}>
                {listItem.label}:
              </div>,
              <div className="list__value" key={listItem.label+'value'}>
                {listItem.value}
              </div>
            ])
          )}          
        </div>
      }
      {children}
    </div>
  </div> 
