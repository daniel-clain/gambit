import * as React from "react"
import { ActivityLogItem } from "../../../../../../../types/game/activity-log-item"
import { frontEndService } from "../../../../../../front-end-service/front-end-service"
import { connect } from "react-redux"
import { hot } from "react-hot-loader/root"
import { LogItemTypes } from "../../../../../../../types/game/log-item-type"
import './report-card.scss'

const {managerMap} = frontEndService

const map = managerMap<{activityLogs: ActivityLogItem[]}>(({managerInfo: {activityLogs}}) => ({activityLogs}))
export const ReportCard = connect(map)(hot(({activityLogs, dispatch}) =>   
  <div className='report-card-modal'>
    <div className='background' onClick={() => dispatch({type: 'closeModal'})}></div>
    <div className="report-card">
      <div className='heading'>Last Week Report</div>
      <div className='list'>
        {getReportLogs(activityLogs).map((logItem, i) => 
          <div
            className={`
              list__row 
              ${
                logItem.type == 'critical' ? 'list__row--critical' :
                logItem.type == 'new round' ? 'list__row--new-round' : ''
              }
            `} 
            key={i}
          >
            <div className='color-bar' style={{background: `linear-gradient(${logItem.color1}, ${logItem.color2})`}}></div>
            <div className="list__row__name">{logItem.message}</div>
          </div>
        )}
      </div>
    </div>
  </div>
))

const getReportLogs = (logItems: ActivityLogItem[]) => {
  const types: LogItemTypes[] = ['employee outcome', 'betting', 'critical', 'report']
  const reduced = logItems.reverse().reduce((obj, logItem) => {
    if(!obj.first && logItem.type == 'new round') return {...obj, first: true}
    else if(obj.second) return obj
    else if(logItem.type == 'new round') return {...obj, second: true}
    else if(types.some(t => t == logItem.type)) return {...obj, returnArray: [...obj.returnArray, logItem]}
    else return obj
  },{first: null, second: null, returnArray: []})
  return reduced.returnArray
}


