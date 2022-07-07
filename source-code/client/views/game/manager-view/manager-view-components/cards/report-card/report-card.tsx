import * as React from "react"
import { ActivityLogItem } from "../../../../../../../types/game/activity-log-item"
import { frontEndService } from "../../../../../../front-end-service/front-end-service"
import { connect, ConnectedProps } from "react-redux"
import { hot } from "react-hot-loader/root"
import { FrontEndState } from "../../../../../../../interfaces/front-end-state-interface"


const {getSortedActivityLogs} = frontEndService


const mapDispatchToProps = {
  closeModal: () => ({type: 'closeModal'})
}
const connector = connect(null, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export const ReportCard = connector(hot(
  ({closeModal}: PropsFromRedux) =>   
  <div className='report-card-modal' onClick={closeModal}>
    <div className='background'></div>
    <div className="report-card-container">
      <div className="report-card">
        <div className="report-card__content">
          <div className='heading'>Last Week Report</div>
          <div className='list'>
            {getSortedActivityLogs().map((logItem, i) => 
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


