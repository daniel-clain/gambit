
import * as React from 'react';
import { getSortedActivityLogs } from '../../../../../../front-end-service/front-end-service';
import './log-list.scss';


export const LogList = () => 
  <div className='list'>
    {getSortedActivityLogs().map((logItem) => 
      <div
        className={`
          list__row 
          ${logItem.type == 'critical' ? 
            'list__row--critical' : ''
          }
          ${logItem.type == 'new week' ? 
            'list__row--new-week' : ''
          }
        `} 
        key={logItem.id}
      >
        <div className='color-bar' style={{background: `linear-gradient(${logItem.color1}, ${logItem.color2})`}}></div>
        <div className="list__row__name">{logItem.message}</div>
      </div>
    )}
  </div>