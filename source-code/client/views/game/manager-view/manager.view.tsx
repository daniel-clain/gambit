import * as React from "react"
import Headbar from './manager-view-components/main-components/headbar/headbar'
import NextFightPanel from './manager-view-components/main-components/next-fight-panel/next-fight-panel'
import EmployeesPanel from './manager-view-components/main-components/employees-panel/employees-panel'
import { LoanSharkCard } from "./manager-view-components/cards/loan-shark-card/loan-shark-card"
import AbilityCard from "./manager-view-components/cards/ability-card/ability-card"
import { KnownManager } from "../../../../game-components/manager"
import { KnownFightersCard } from "./manager-view-components/cards/known-fighters-card/known-fighters-card"
import ManagersCard from './manager-view-components/cards/managers-card/managers-card'
import JobSeekersPanel from './manager-view-components/main-components/job-seekers-panel/job-seekers-panel'
import YourFightersPanel from './manager-view-components/main-components/your-fighters-panel/your-fighters-panel'
import LogsCard from './manager-view-components/cards/logs-card/logs-card'
import { FrontEndState } from "../../../front-end-state/front-end-state"
import {connect, useDispatch} from 'react-redux'
import { Employee, FighterInfo, JobSeeker, Loan } from "../../../../interfaces/server-game-ui-state.interface"
import { ActivityLogItem } from "../../../../types/game/activity-log-item"
import { frontEndService } from "../../../front-end-service/front-end-service"
import { Bet } from "../../../../interfaces/game/bet"

import './manager-view-style/manager-view.scss'
import { ActiveCard, ClientManagerUIAction } from "../../../front-end-state/reducers/manager-ui.reducer"
import { Dispatch } from "redux"
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
  yourFighters: FighterInfo[]
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
  yourFighters,
  jobSeekers,
  employees,
  activeCard
}: ManagerViewProps) => {

  const dispatch: Dispatch<ClientManagerUIAction> = useDispatch()


  return (
  
    <div className='manager-ui' >
      <div className="manager-ui__content">
        <Headbar {...{actionPoints, money, managerOptionsTimeLeft, nextFightBet}} />
        <div className='main-content'>
          <NextFightPanel {...{yourFighters, nextFightBet, nextFightFighters}} />

          <div className="two-columns">
            <div className='left-column'>
              <YourFightersPanel {...{yourFighters}} />
              <EmployeesPanel {...{employees}} />
            </div>
            <div className="right-column">
              <JobSeekersPanel {...{jobSeekers}} />
              <button onClick={() => dispatch({type: 'Show Activity Log'})}>Logs</button>
            </div>
          </div>

          <button onClick={() => dispatch({type: 'Show Loan Shark Card'})}>Loan Shark</button>
          <button onClick={() => dispatch({type: 'Show Known Fighters'})}>Known Fighters</button>
          <button onClick={() => dispatch({type: 'Show Known Managers'})}>Other Managers</button>
        </div>

      </div>

      {(() => {
        switch(activeCard?.name){
          case 'Fighter': return <FighterCard />
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
    playerManagerUiData: {
      managerInfo: {
        money, activityLogs, actionPoints, nextFightBet, 
        otherManagers, loan, employees, knownFighters, yourFighters
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
  yourFighters
})


export default connect(mapStateToProps)(Manager_View)

