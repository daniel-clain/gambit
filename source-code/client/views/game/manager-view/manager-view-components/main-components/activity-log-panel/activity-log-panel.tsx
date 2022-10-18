
import * as React from 'react';
import { LogList } from '../../partials/log-list/log-list';



export const ActivityLogPanel = () =>   
  <div className='panel activity-logs'>
    <div className='heading'>ActivityLogs</div>
    <LogList/>
  </div>