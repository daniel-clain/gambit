
import * as React from 'react';
import './manager-options-ui.scss'
import '../../global/styles/manager-options-ui/manager-options-ui-global.scss'
import { FighterCard, FighterCardProps } from './cards/fighter-card/fighter-card';
import { EmployeeCardProps, EmployeeCard } from './cards/employee-card/employee-card';
import { JobSeekerCard, JobSeekerCardProps } from './cards/job-seeker-card/job-seeker-card';
import  { LoanSharkCardProps } from './cards/loan-shark-card/loan-shark-card';
import AbilityCard, { AbilityCardProps } from './cards/ability-card/ability-card';
import Headbar from './main-components/headbar/headbar';
import NextFightPanel, { NextFightPanelProps } from './main-components/next-fight-panel/next-fight-panel';
import Modal, { ModalProps } from './main-components/modal/modal';
import  { YourFightersPanelProps } from './main-components/your-fighters-panel/your-fighters-panel';
import KnownFightersPanel, { KnownFightersPanelProps } from './main-components/known-fighters-panel/known-fighters-panel';
import { JobSeekersPanelProps } from './main-components/job-seekers-panel/job-seekers-panel';
import { EmployeesPanelProps } from './main-components/employees-panel/employees-panel';
import LoanSharkPanel, { LoanSharkPanelProps } from './main-components/loan-shark-panel/loan-shark-panel';
import ActivityLogPanel from './main-components/activity-log-panel/activity-log-panel';
import { JobSeeker, Employee } from '../../../../../interfaces/server-game-ui-state.interface';
import { AbilityData } from '../../../../../game-components/abilities-reformed/ability';
import { Bet } from '../../../../../interfaces/game/bet';
import { ManagerInfo } from '../../../../../game-components/manager';
import ClientGameAction from '../../../../../types/client-game-actions';


interface ManagerOptionsUiState {
  selectedFighter: string
  selectedJobSeeker: JobSeeker
  selectedEmployee: Employee
  selectedAbility: AbilityData
  bet: Bet
  showLoanSharkCard: boolean
}


export default class ManagerOptionsUi extends React.Component<ManagerOptionsUiProps, ManagerOptionsUiState>{
  state: ManagerOptionsUiState = {
    selectedFighter: null,
    selectedJobSeeker: null,
    selectedEmployee: null,
    selectedAbility: null,
    bet: null,
    showLoanSharkCard: false
  }

  showLoanSharkCard() {
    this.setState({ showLoanSharkCard: true })
  }

  abilitySelected(abilityData: AbilityData) {
    console.log('ability selected ', abilityData);
    this.closeModal()
    this.setState({selectedAbility: abilityData})
  }

  fighterSelected(fighterName: string) {
    console.log('fighter selected ', fighterName);
    this.setState({ selectedFighter: fighterName })
  }

  jobSeekerSelected(jobSeeker: JobSeeker) {
    console.log('jobSeeker selected ', jobSeeker);
    this.setState({selectedJobSeeker: jobSeeker })
  }

  employeeSelected(employee: Employee) {
    console.log('emmployee selected ', employee);
    this.setState({selectedEmployee: employee })
  }

  closeModal(){
    this.setState({
      selectedJobSeeker: null,
      selectedFighter: null,
      selectedEmployee: null,
      showLoanSharkCard: false,
      selectedAbility: null
    })
  }

  render() {

    const { managerInfo, managerOptionsTimeLeft, jobSeekers, nextFightFighters, delayedExecutionAbilities } = this.props
    const { money, actionPoints, knownFighters, employees, loan, fighters, nextFightBet} = managerInfo
    const { selectedAbility, selectedEmployee, selectedJobSeeker, selectedFighter, showLoanSharkCard } = this.state

    //const nextFightFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.inNextFight)

    const {headbarProps, nextFightPanelProps, knownFighterPanelProps, yourFighterPanelProps, jobSeekerPanelProps, employeesPanelProps, loanSharkPanelProps, fightCardProps, employeeCardProps, jobSeekerCardProps, loanSharkCardProps, abilityCardProps, modalProps, modalIsActive} = (() => {
      const headbarProps = {
        money,
        actionPoints,
        managerOptionsTimeLeft,
        nextFightBet
      }
      
      const nextFightPanelProps: NextFightPanelProps = {
        nextFightFighters,
        managerInfo,
        fighterSelected: this.fighterSelected.bind(this),
      }

      const knownFighterPanelProps: KnownFightersPanelProps = {
        fighters: knownFighters,
        fighterSelected: this.fighterSelected.bind(this)
      }
      const yourFighterPanelProps: YourFightersPanelProps = {
        fighters,
        fighterSelected: this.fighterSelected.bind(this)
      }
      const jobSeekerPanelProps: JobSeekersPanelProps = {
        jobSeekers,
        fighterSelected: this.fighterSelected.bind(this),
        jobSeekerSelected: this.jobSeekerSelected.bind(this)
      }
      const employeesPanelProps: EmployeesPanelProps = {
        employees,
        employeeSelected: this.employeeSelected.bind(this)
      }
      const loanSharkPanelProps: LoanSharkPanelProps = {
        showLoanSharkCard: this.showLoanSharkCard.bind(this)
      }

      let fightCardProps: FighterCardProps
      let employeeCardProps: EmployeeCardProps
      let jobSeekerCardProps: JobSeekerCardProps
      let loanSharkCardProps: LoanSharkCardProps
      let abilityCardProps: AbilityCardProps
      let modalProps: ModalProps


      const modalIsActive = 
        !!selectedAbility ||
        !!selectedEmployee ||
        !!selectedJobSeeker || 
        !!selectedFighter ||
        showLoanSharkCard

      if(modalIsActive){
        modalProps = {
          closeModal: this.closeModal.bind(this)
        }
        fightCardProps = {
          jobSeekers,
          delayedExecutionAbilities,
          selectedFighter,
          managerInfo,
          abilitySelected: this.abilitySelected.bind(this)
        }
        employeeCardProps = {
          delayedExecutionAbilities,
          managerInfo,
          employee: selectedEmployee,
          abilitySelected: this.abilitySelected.bind(this)
        }
        jobSeekerCardProps = {
          delayedExecutionAbilities,
          managerInfo,
          jobSeeker: selectedJobSeeker,
          abilitySelected: this.abilitySelected.bind(this)
        }
        loanSharkCardProps = {
          money,
          loan,
          sendGameAction: this.props.sendGameAction
        }
        abilityCardProps = {
          nextFightFighters,
          closeModal: this.closeModal.bind(this),          
          delayedExecutionAbilities,
          abilityData: selectedAbility,
          managerInfo,
          jobSeekers,
          fighterSelected: this.fighterSelected.bind(this),
          sendGameAction: this.props.sendGameAction
        }
      }
      return {headbarProps, nextFightPanelProps, knownFighterPanelProps, yourFighterPanelProps, jobSeekerPanelProps, employeesPanelProps, loanSharkPanelProps, fightCardProps, employeeCardProps, jobSeekerCardProps, loanSharkCardProps, abilityCardProps, modalProps, modalIsActive}
    })()

    return (
      <div className='manager-ui' >
        <div className="manager-ui__content">
          <Headbar {...headbarProps}/>

          <div className='main-content'>
            <NextFightPanel {...nextFightPanelProps}/>

            <div className="two-columns">
              <div className='left-column'>
                <YourFightersPanel {...yourFighterPanelProps}/>
                <EmployeesPanel {...employeesPanelProps}/>
                <ActivityLogPanel log={managerInfo.activityLogs}/>    
              </div>
              <div className="right-column">
                <JobSeekersPanel {...jobSeekerPanelProps}/>
                <KnownFightersPanel {...knownFighterPanelProps}/>    
                <LoanSharkPanel {...loanSharkPanelProps}/>   
              </div>
            </div>            
          </div>

          {modalIsActive &&
            <Modal {...modalProps}>
            {
              selectedFighter ?
              <FighterCard {...fightCardProps} />
              :
              selectedEmployee ?
              <EmployeeCard {...employeeCardProps} />
              :
              selectedJobSeeker ?
              <JobSeekerCard {...jobSeekerCardProps} />
              :
              showLoanSharkCard ?
              <LoanSharkCard {...loanSharkCardProps} />
              :
              selectedAbility ?
              <AbilityCard {...abilityCardProps} />
              : 
              <span>modal should not show if nothing selected</span>
            }
            </Modal>
          }
          
        </div>
        <div className="turn-phone-message">
          <div className="image">Turn your phone to portrait view</div> 
        </div>
      </div>
    )
  }
}
