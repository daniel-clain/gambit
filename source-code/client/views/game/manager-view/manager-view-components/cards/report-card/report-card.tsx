import * as React from "react"
import { connect, ConnectedProps } from "react-redux"
import { hot } from "react-hot-loader/root"
import './report-card.scss'
import { LogList } from "../../partials/log-list/log-list"


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
          <LogList/>
        </div>
      </div>
    </div>
  </div>
))


