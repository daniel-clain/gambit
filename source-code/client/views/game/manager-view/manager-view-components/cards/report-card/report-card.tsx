import React from "react"
import { hot } from "react-hot-loader/root"
import { ActivityLogItem } from "../../../../../../../types/game/activity-log-item"
import { Modal } from "../../partials/modal/modal"
import { connect } from 'react-redux'
import { FrontEndState } from "../../../../../../../interfaces/front-end-state-interface"

interface ReportCardProps {
  activityLogs: ActivityLogItem[]
}
//const typesIncludedInReport: LogItemTypes[] = ['report', 'critical', 'employee outcome', 'betting']
//const isReportOrCritical = log => typesIncludedInReport.some(type => log.type == type)

export const ReportCard = hotAndStateful(({ activityLogs }: ReportCardProps) => {
  const reversedLog = [...activityLogs].reverse()
  
  return <Modal>
    <div className='panel report-card'>
      <div className='heading'>Activity Log</div>
      <div className='list'>
        {reversedLog.map((logItem, i) => 
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
  </Modal>
})


function hotAndStateful(component) {
  const mapStateToProps = ({
    serverUIState: { serverGameUIState: { playerManagerUIState: { managerInfo: {
      activityLogs
    } } } }
  }: FrontEndState): ReportCardProps => ({ activityLogs })
  return connect(mapStateToProps)(hot(component))
}