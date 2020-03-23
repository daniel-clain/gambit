
import * as React from 'react';
import './activity-log-panel.scss'
import { ActivityLogItem } from '../../../../../../types/game/activity-log-item';

export interface ActivityLogPanelProps{
  log: ActivityLogItem[]
}

export default class ActivityLogPanel extends React.Component<ActivityLogPanelProps> {
    
  render(){
    const reversedLog = [...this.props.log].reverse()
    return (
      <div className='group-panel activity-log'>
        <div className='heading'>Activity Log</div>
        <div className='list'>
          {reversedLog.map((logItem, index) => 
            <div 
            className={`list__row 
              list__row--${
                logItem.type == 'critical' ? 'critical' : 
                logItem.type == 'new round' ? 'new-round' :
                index % 2 == 1 ? 'main-color' : 'alternate-color'
              }`} 
            key={index}>{logItem.message}</div>
          )}
        </div>
      </div>
    )
  }
};
