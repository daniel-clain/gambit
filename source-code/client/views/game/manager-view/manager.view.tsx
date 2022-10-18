import * as React from "react"
import {Headbar} from './manager-view-components/main-components/headbar/headbar'
import {NextFightPanel} from './manager-view-components/main-components/next-fight-panel/next-fight-panel'
import {EmployeesPanel} from './manager-view-components/main-components/employees-panel/employees-panel'
import {AbilityCard} from "./manager-view-components/cards/ability-card/ability-card"
import {JobSeekerCard} from "./manager-view-components/cards/job-seeker-card/job-seeker-card"
import { KnownFightersCard } from "./manager-view-components/cards/known-fighters-card/known-fighters-card"
import {ManagersCard} from './manager-view-components/cards/managers-card/managers-card'
import {JobSeekersPanel} from './manager-view-components/main-components/job-seekers-panel/job-seekers-panel'
import {YourFightersPanel} from './manager-view-components/main-components/your-fighters-panel/your-fighters-panel'
import { CardName} from "../../../../interfaces/front-end-state-interface"

import './manager-view-style/manager-view.scss'
import {FighterCard} from "./manager-view-components/cards/fighter-card/fighter-card"
import { ButtonPanel } from "./manager-view-components/main-components/button-panel/button-panel"
import { ReportCard } from "./manager-view-components/cards/report-card/report-card"
import { useEffect } from "react"
import { ActivityLogPanel } from "./manager-view-components/main-components/activity-log-panel/activity-log-panel"
import { ManagerCard } from "./manager-view-components/cards/manager-card/manager-card"
import { EmployeeCard } from "./manager-view-components/cards/employee-card/employee-card"
import { outOfTimeSound } from "../../../sound-effects/sound-effects"
import { WinOptionsCard } from "./manager-view-components/cards/win-options-card/win-options-card"
import { LoanSharkCard } from "./manager-view-components/cards/loan-shark-card/loan-shark-card"
import { frontEndState } from "../../../front-end-state/front-end-state"
import { observer } from "mobx-react"
import { showReport, showLoanShark, showKnownFighters, showOtherManagers, showWinOptions, showManager, showGameExplanation } from "../../../front-end-service/front-end-service"
import { toJS } from "mobx"

export const Manager_View = observer(() => {

  const {
    serverUIState: { serverGameUIState: {
      playerManagerUIState: {
        week, managerOptionsTimeLeft, managerInfo, nextFightFighters, jobSeekers, 
      }
    }},
    clientUIState: { clientGameUIState: {
        clientManagerUIState: {activeModal}
    }}
  } = frontEndState

  useEffect(() => {
    week != 1 && showReport()
  },[week])

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
                <button onClick={() => showManager(managerInfo.name)}>Manager Options</button>
                <button onClick={showOtherManagers}>Other Managers</button>
                <button onClick={showWinOptions}>Try To Win</button>
                <button onClick={showGameExplanation}>Game Explanation</button>
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
})
