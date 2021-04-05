import * as React from "react"
import Headbar from './manager-view-components/main-components/headbar/headbar'
import NextFightPanel from './manager-view-components/main-components/next-fight-panel/next-fight-panel'
import EmployeesPanel from './manager-view-components/main-components/employees-panel/employees-panel'
import { LoanSharkCard } from "./manager-view-components/cards/loan-shark-card/loan-shark-card"
import AbilityCard from "./manager-view-components/cards/ability-card/ability-card"
import JobSeekerCard from "./manager-view-components/cards/job-seeker-card/job-seeker-card"
import EmployeeCard from "./manager-view-components/cards/employee-card/employee-card"
import { KnownManager } from "../../../../game-components/manager"
import { KnownFightersCard } from "./manager-view-components/cards/known-fighters-card/known-fighters-card"
import ManagersCard from './manager-view-components/cards/managers-card/managers-card'
import JobSeekersPanel from './manager-view-components/main-components/job-seekers-panel/job-seekers-panel'
import YourFightersPanel from './manager-view-components/main-components/your-fighters-panel/your-fighters-panel'
import { ActiveModal, Employee, FighterInfo, FrontEndState, JobSeeker, Loan } from "../../../../interfaces/front-end-state-interface"
import {connect} from 'react-redux'
import { ActivityLogItem } from "../../../../types/game/activity-log-item"
import {frontEndService} from "../../../front-end-service/front-end-service"
import { Bet } from "../../../../interfaces/game/bet"

import './manager-view-style/manager-view.scss'
import {  } from "../../../front-end-state/reducers/manager-ui.reducer"
import FighterCard from "./manager-view-components/cards/fighter-card/fighter-card"
import { ButtonPanel } from "./manager-view-components/main-components/button-panel/button-panel"
import { hot } from "react-hot-loader/root"
import { ReportCard } from "./manager-view-components/cards/report-card/report-card"
import { useEffect, useState } from "react"


interface ManagerViewProps{
  money: number
  loan: Loan
  activityLogs: ActivityLogItem[]
  knownFighters: FighterInfo[]
  otherManagers: KnownManager[]
  nextFightBet: Bet
  managerOptionsTimeLeft: number
  actionPoints: number
  jobSeekers: JobSeeker[]
  nextFightFighters: string[]
  fighters: FighterInfo[]
  employees: Employee[]
  activeModal: ActiveModal
  round: number
}


const Manager_View = ({
  money, 
  loan, 
  activityLogs, 
  knownFighters, 
  otherManagers, 
  nextFightBet,
  managerOptionsTimeLeft,
  actionPoints,
  nextFightFighters,
  fighters,
  jobSeekers,
  employees,
  activeModal,
  round
}: ManagerViewProps) => {

  const {
    showActivityLog, 
    showLoanShark,
    showKnownFighters,
    showOtherManagers,
    showReport
  } = frontEndService.setClientState

  useEffect(showReport,[round])




  return (
  
    <div className='manager-ui' >
      <div className="manager-ui__content">
        <Headbar {...{actionPoints, money, managerOptionsTimeLeft, nextFightBet}} />
        <div className='main-content'>
          <NextFightPanel {...{fighters, nextFightBet, nextFightFighters}} />

          <div className="two-columns">
            <div className='left-column'>
              <YourFightersPanel {...{fighters}} />
              <EmployeesPanel {...{employees}} />
            </div>
            <div className="right-column">
              <JobSeekersPanel {...{jobSeekers}} />
              <ButtonPanel>
                <button onClick={showActivityLog}>Logs</button>
                <button onClick={showLoanShark}>Loan Shark</button>
                <button onClick={showKnownFighters}>Known Fighters</button>
                <button onClick={showOtherManagers}>Other Managers</button>
              </ButtonPanel>
            </div>
          </div>

        </div>

      </div>

      {(() => {
        if(activeModal)
          switch(activeModal.name){
            case 'Fighter': return <FighterCard />
            case 'Job Seeker': return <JobSeekerCard/>
            case 'Employee': return <EmployeeCard/>
            case 'Activity Log': return <ReportCard/>
            case 'Loan Shark': return <LoanSharkCard {...{loan, money}} />
            case 'Known Fighters': return <KnownFightersCard fighters={knownFighters}  />
            case 'Known Managers': return <ManagersCard {...{otherManagers}} />
            case 'Ability': return <AbilityCard />
            case 'Manager Report': return <ReportCard />
          }
        })()}
    </div>      
  )

}

const mapStateToProps = ({
  clientUIState: { clientGameUIState: {
    clientManagerUIState: {activeModal}
  }},
  serverUIState: { serverGameUIState: {
    playerManagerUIState: {
      managerInfo: {
        money, activityLogs, actionPoints, nextFightBet, 
        otherManagers, loan, employees, knownFighters, fighters
      },
      managerOptionsTimeLeft,
      jobSeekers,
      nextFightFighters, 
      round
    }
  }}
}: FrontEndState): 
ManagerViewProps => ({
  money,
  actionPoints,
  activityLogs,
  nextFightBet,
  otherManagers,
  loan,
  managerOptionsTimeLeft,
  jobSeekers,
  nextFightFighters,
  employees,
  activeModal,
  knownFighters,
  fighters,
  round
})


export default connect(mapStateToProps)(hot(Manager_View))

