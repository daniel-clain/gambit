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
import LogsCard from './manager-view-components/cards/logs-card/logs-card'
import { FrontEndState } from "../../../front-end-state/front-end-state"
import {connect} from 'react-redux'
import { Employee, FighterInfo, JobSeeker, Loan } from "../../../../interfaces/server-game-ui-state.interface"
import { ActivityLogItem } from "../../../../types/game/activity-log-item"
import { frontEndService } from "../../../front-end-service/front-end-service"
import { Bet } from "../../../../interfaces/game/bet"

import './manager-view-style/manager-view.scss'
import { ActiveCard } from "../../../front-end-state/reducers/manager-ui.reducer"
import FighterCard from "./manager-view-components/cards/fighter-card/fighter-card"


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
  nextFightFighters: FighterInfo[]
  fighters: FighterInfo[]
  employees: Employee[]
  activeCard: ActiveCard
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
  activeCard
}: ManagerViewProps) => {

  const {
    showActivityLog, 
    showLoanShark,
    showKnownFighters,
    showOtherManagers
  } = frontEndService().setClientState


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
              <button onClick={showActivityLog}>Logs</button>
              <button onClick={showLoanShark}>Loan Shark</button>
              <button onClick={showKnownFighters}>Known Fighters</button>
              <button onClick={showOtherManagers}>Other Managers</button>
            </div>
          </div>

        </div>

      </div>

      {(() => {
        if(activeCard)
          switch(activeCard.name){
            case 'Fighter': return <FighterCard />
            case 'Job Seeker': return <JobSeekerCard/>
            case 'Employee': return <EmployeeCard/>
            case 'Activity Log': return <LogsCard {...{activityLogs}}  />
            case 'Loan Shark': return <LoanSharkCard {...{loan, money}} />
            case 'Known Fighters': return <KnownFightersCard fighters={knownFighters}  />
            case 'Known Managers': return <ManagersCard {...{otherManagers}} />
            case 'Ability': return <AbilityCard />
          }
        })()}
    </div>      
  )

}

const mapStateToProps = ({
  clientUIState: { clientGameUIState: {
    clientManagerUIState: {activeCard}
  }},
  serverUIState: { serverGameUIState: {
    playerManagerUIState: {
      managerInfo: {
        money, activityLogs, actionPoints, nextFightBet, 
        otherManagers, loan, employees, knownFighters, fighters
      },
      managerOptionsTimeLeft,
      jobSeekers,
      nextFightFighters
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
  activeCard,
  knownFighters,
  fighters
})


export default connect(mapStateToProps)(Manager_View)

