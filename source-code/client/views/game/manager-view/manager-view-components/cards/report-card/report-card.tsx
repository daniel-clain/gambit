import * as React from "react"
import { ActivityLogItem } from "../../../../../../../types/game/activity-log-item"
import { frontEndService } from "../../../../../../front-end-service/front-end-service"
import { connect } from "react-redux"
import { hot } from "react-hot-loader/root"
import { LogItemTypes } from "../../../../../../../types/game/log-item-type"
import './report-card.scss'

const {managerMap, getReportItems} = frontEndService

const map = managerMap<{activityLogs: ActivityLogItem[]}>(({managerInfo: {activityLogs}}) => ({activityLogs}))
export const ReportCard = connect(map)(hot(({activityLogs, dispatch}) =>   
  <div className='report-card-modal' onClick={() => dispatch({type: 'closeModal'})}>
    <div className='background'></div>
    <div className="report-card-container">
      <div className="report-card">
        <div className="report-card__content">
          <div className='heading'>Last Week Report</div>
          <div className='list'>
            {getReportItems().reverse().map((logItem, i) => 
              <div
                className={`
                  list__row 
                  ${
                    logItem.type == 'critical' ? 'list__row--critical' : ''
                  }
                `} 
                key={i}
              >
                <div className='color-bar' style={{background: `linear-gradient(${logItem.color2}, ${logItem.color1})`}}></div>
                <div className="list__row__name">{logItem.message}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
))


