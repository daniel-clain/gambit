
import * as React from 'react';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { ActivityLogItem } from '../../../../../../../types/game/activity-log-item';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import './activity-log-panel.scss';

const {managerMap} = frontEndService

const map = managerMap<{activityLogs: ActivityLogItem[]}>(({managerInfo: {activityLogs}}) => ({activityLogs: activityLogs.map(l => l)}))

export const ActivityLogPanel = connect(map)(hot(({activityLogs}) =>   
    <div className='panel activity-logs'>
      <div className='heading'>ActivityLogs</div>
      <div className='list'>
        {[...activityLogs].reverse().map((logItem, i) => 
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
))