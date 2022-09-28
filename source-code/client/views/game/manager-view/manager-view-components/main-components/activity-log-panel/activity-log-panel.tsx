
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { LogList } from '../../partials/log-list/log-list';



export const ActivityLogPanel = hot(() =>   
  <div className='panel activity-logs'>
    <div className='heading'>ActivityLogs</div>
    <LogList/>
  </div>
)