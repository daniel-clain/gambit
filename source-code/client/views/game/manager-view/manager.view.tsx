import React from "react"
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
import { FrontEndState, ModalName } from "../../../front-end-state/front-end-state"
import {connect} from 'react-redux'
import { Employee, FighterInfo, JobSeeker, Loan } from "../../../../interfaces/server-game-ui-state.interface"
import { ActivityLogItem } from "../../../../types/game/activity-log-item"
import { frontEndService } from "../../../front-end-service/front-end-service"
import { Bet } from "../../../../interfaces/game/bet"


interface ManagerViewProps{
  activeModal: ModalName
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
}


const Manager_View = ({
  money, 
  loan, 
  activityLogs, 
  knownFighters, 
  otherManagers, 
  activeModal,
  nextFightBet,
  managerOptionsTimeLeft,
  actionPoints,
  nextFightFighters,
  yourFighters,
  jobSeekers,
  employees
}: ManagerViewProps) => {

  let {openModal} = frontEndService


  return <>
    <Headbar {...{actionPoints, money, managerOptionsTimeLeft, nextFightBet}} />
    <NextFightPanel {...{yourFighters, nextFightBet, nextFightFighters}} />
    <JobSeekersPanel {...{jobSeekers}} />
    <div className="two-columns">
      <YourFightersPanel {...{yourFighters}} />
      <EmployeesPanel {...{employees}} />
      <button onClick={() => openModal('Logs')}>Logs</button>
      <button onClick={() => openModal('Loan Shark')}>Loan Shark</button>
      <button onClick={() => openModal('Known Fighters')}>Known Fighters</button>
      <button onClick={() => openModal('Managers')}>Other Managers</button>
    </div>

    {(() => {
      switch(activeModal){
        case 'Logs': return <LogsCard {...{activityLogs}}  />
        case 'Loan Shark': return <LoanSharkCard {...{loan, money}} />
        case 'Known Fighters': return <KnownFightersCard fighters={knownFighters}  />
        case 'Managers': return <ManagersCard {...{otherManagers}} />
        case 'Ability': return <AbilityCard />
      }
    })()}
        
  </>

}

const mapStateToProps = ({
  clientGameUIState: {activeModal},
  serverGameUIState: {
    playerManagerUiData: {
      managerInfo: {
        money, activityLogs, actionPoints, nextFightBet, 
        otherManagers, loan, employees, knownFighters, yourFighters
      },
      managerOptionsTimeLeft,
      jobSeekers,
      nextFightFighters
    }
  }
}: FrontEndState): ManagerViewProps => ({
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
  yourFighters
})

export default connect(mapStateToProps)(Manager_View)

