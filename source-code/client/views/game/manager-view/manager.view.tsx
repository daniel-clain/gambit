import * as React from "react"
import Headbar from './manager-view-components/main-components/headbar/headbar'
import {NextFightPanel} from './manager-view-components/main-components/next-fight-panel/next-fight-panel'
import {EmployeesPanel} from './manager-view-components/main-components/employees-panel/employees-panel'
import { LoanSharkCard } from "./manager-view-components/cards/loan-shark-card/loan-shark-card"
import {AbilityCard} from "./manager-view-components/cards/ability-card/ability-card"
import {JobSeekerCard} from "./manager-view-components/cards/job-seeker-card/job-seeker-card"
import { KnownManager } from "../../../../game-components/manager"
import { KnownFightersCard } from "./manager-view-components/cards/known-fighters-card/known-fighters-card"
import {ManagersCard} from './manager-view-components/cards/managers-card/managers-card'
import {JobSeekersPanel} from './manager-view-components/main-components/job-seekers-panel/job-seekers-panel'
import {YourFightersPanel} from './manager-view-components/main-components/your-fighters-panel/your-fighters-panel'
import { AllManagerUIState,  CardName} from "../../../../interfaces/front-end-state-interface"
import {connect, ConnectedProps} from 'react-redux'
import {frontEndService} from "../../../front-end-service/front-end-service"

import './manager-view-style/manager-view.scss'
import FighterCard from "./manager-view-components/cards/fighter-card/fighter-card"
import { ButtonPanel } from "./manager-view-components/main-components/button-panel/button-panel"
import { hot } from "react-hot-loader/root"
import { ReportCard } from "./manager-view-components/cards/report-card/report-card"
import { useEffect } from "react"
import { ActivityLogPanel } from "./manager-view-components/main-components/activity-log-panel/activity-log-panel"
import { ManagerCard } from "./manager-view-components/cards/manager-card/manager-card"
import { EmployeeCard } from "./manager-view-components/cards/employee-card/employee-card"
import { outOfTimeSound } from "../../../sound-effects/sound-effects"
import { WinOptionsCard } from "./manager-view-components/cards/win-options-card/win-options-card"


const {toManagerState, getReportItems} = frontEndService


const mapState = toManagerState(({activeModal, round, managerInfo, managerOptionsTimeLeft}: AllManagerUIState) => ({activeModal, round, managerInfo, managerOptionsTimeLeft}))

const mapDispatch = {
  showLoanShark: () => ({type: 'showLoanShark'}),
  showKnownFighters: () => ({type: 'showKnownFighters'}),
  showOtherManagers: () => ({type: 'showOtherManagers'}),
  showManager: (m: KnownManager) => ({type: 'showManager', payload: m}),
  showReport: () => ({type: 'showReport'}),
  showWinOptions: () => ({type: 'showWinOptions'})
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>



export const Manager_View = connector(hot( 
  ({activeModal, round, managerInfo, showLoanShark, showKnownFighters, showOtherManagers, showManager, showReport, showWinOptions, managerOptionsTimeLeft}: PropsFromRedux) => {

  useEffect(() => {
    getReportItems().length && showReport()
  },[round])

  useEffect(() => {
    if(managerOptionsTimeLeft == 5){
      outOfTimeSound.play().catch(() => null)
    }
  },[managerOptionsTimeLeft])

  

  return (
  
    <div className='manager-ui' >
      <div className="manager-ui__content">
        <Headbar/>
        <div className='main-content'>
          <NextFightPanel/>

          <div className="two-columns">
            <div className='left-column'>
              <YourFightersPanel/>
              <EmployeesPanel/>
              <ButtonPanel>
                <button onClick={showLoanShark}>Loan Shark</button>
                <button onClick={showKnownFighters}>Known Fighters</button>
                <button onClick={() => showManager(convertThisManagerToKnownManager())}>Manager Options</button>
                <button onClick={showOtherManagers}>Other Managers</button>
                <button onClick={showWinOptions}>Try To Win</button>
              </ButtonPanel>
            </div>
            <div className="right-column">
              <JobSeekersPanel/>
              <ActivityLogPanel/>
              
            </div>
          </div>

        </div>

      </div>

      {activeModal ? showModal(activeModal.name) : ''}
    </div>      
  )

  function showModal(name: CardName){
    switch(name){
      case 'Fighter': return <FighterCard/>
      case 'Job Seeker': return <JobSeekerCard/>
      case 'Employee': return <EmployeeCard/>
      case 'Manager': return <ManagerCard/>
      case 'Loan Shark': return <LoanSharkCard/>
      case 'Known Fighters': return <KnownFightersCard/>
      case 'Known Managers': return <ManagersCard/>
      case 'Ability': return <AbilityCard/>
      case 'Manager Report': return <ReportCard/>
      case 'Win Options': return <WinOptionsCard/>
    }
  }

  function convertThisManagerToKnownManager(): KnownManager{
    const {name, image, money, loan, employees, fighters, evidence} = managerInfo
    return {
      name, image,
      money: {roundsSinceUpdated: null, lastKnownValue: money},
      loan: {roundsSinceUpdated: null, lastKnownValue: loan},
      employees: {roundsSinceUpdated: null, lastKnownValue: employees},
      fighters: {roundsSinceUpdated: null, lastKnownValue: fighters},
      evidence: {roundsSinceUpdated: null, lastKnownValue: evidence},
    }
  }

}))
