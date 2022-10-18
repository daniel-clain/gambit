import * as React from "react"
import './report-card.scss'
import { LogList } from "../../partials/log-list/log-list"
import { closeModal } from "../../../../../../front-end-service/front-end-service"

export const ReportCard = () =>   
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


