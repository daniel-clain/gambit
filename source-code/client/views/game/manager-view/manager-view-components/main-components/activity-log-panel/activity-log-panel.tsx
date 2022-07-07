
import * as React from 'react';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { hot } from 'react-hot-loader/root';
import './activity-log-panel.scss';


const {getSortedActivityLogs} = frontEndService

export const ActivityLogPanel = hot(() =>   
  <div className='panel activity-logs'>
    <div className='heading'>ActivityLogs</div>
    <div className='list'>
      {getSortedActivityLogs().reverse().map((logItem, i) => 
        <div
          className={`list__row ${logItem.type == 'critical' ? 'list__row--critical' : logItem.type == 'new round' ? 'list__row--new-round' : ''}`} 
          key={i}
        >
          <div className='color-bar' style={{background: `linear-gradient(${logItem.color1}, ${logItem.color2})`}}></div>
          <div className="list__row__name">{logItem.message}</div>
        </div>
        )}
    </div>
  </div>
)