
import * as React from 'react';
import './manager-ui.scss'
import { FighterInfo, Employee, JobSeeker, ManagerUiState } from '../../../interfaces/game-ui-state.interface';
import { ManagerInfo } from '../../../game-components/manager/manager';
import { Bet } from '../../../interfaces/game/bet';
import AbilityService from './ability-service';
import { AbilityData } from '../../../interfaces/game/client-ability.interface';
import PlayerAction from '../../../interfaces/player-action';
import gameConfiguration from '../../../game-components/game-configuration';
import { FighterCard } from './fighter-card';
import { EmployeeCard } from './employee-card';
import { JobSeekerCard } from './job-seeker-card';
import LoanSharkCard from './loan-shark-card';
import AbilityCard from './ability-card';
import ActorList from './actor-list';


interface Card {
  type: ActorTypes,
  data: FighterInfo | Employee | JobSeeker | ManagerInfo

}

type ActiveModalTypes = 'Fighter Card' | 'Employee Card' | 'Job Seeker Card' | 'Loan Shark Card' | 'Ability Card'

interface ActiveModal {
  type: ActiveModalTypes
  props: any
}

interface ManagerComponentState {
  bet: Bet
  activeModal: ActiveModal
  activeSelectList: {

  }
}
export type ActorTypes = 'Manager' | 'Fighter' | 'Employee' | 'Job Seeker'


interface ManagerUiProps {
  managerUiState: ManagerUiState
  sendPlayerAction(playerAction: PlayerAction)
}

export default class ManagerUi extends React.Component<ManagerUiProps, ManagerComponentState>{
  state: ManagerComponentState = {
    activeModal: null,
    activeSelectList: null,
    bet: null
  }
  abilityService: AbilityService

  constructor(props) {
    super(props)
    this.abilityService = new AbilityService()
  }


  placeBet(bet: Bet) {
    console.log(`you have placed a ${bet.size} bet on ${bet.fighterName}`);
    this.setState({bet})
    
    const playerAction: PlayerAction = {
      name: 'Bet On Fighter',
      args: bet
    }
    this.props.sendPlayerAction(playerAction)
  }
  
  cancelBet(){
    
    this.setState({bet: null})
    
    const playerAction: PlayerAction = {
      name: 'Bet On Fighter',
      args: null
    }
    this.props.sendPlayerAction(playerAction)
  }


  showLoanSharkCard() {
    const loanSharkProps = this.props.managerUiState.managerInfo.loan
    this.setState({ activeModal: { type: 'Loan Shark Card', props: loanSharkProps } })
  }

  abilityBlockSelected(abilityData: AbilityData) {
    console.log('ability selected ', abilityData);
    this.setState({ activeModal: { type: 'Ability Card', props: abilityData } })
  }

  fighterSelected(fighterInfo: FighterInfo) {
    console.log('fighter selected ', fighterInfo);
    this.setState({ activeModal: { type: 'Fighter Card', props: fighterInfo } })
  }

  jobSeekerSelected(jobSeeker: JobSeeker) {
    console.log('jobSeeker selected ', jobSeeker);
    this.setState({ activeModal: { type: 'Job Seeker Card', props: jobSeeker } })
  }

  employeeSelected(employee: Employee) {
    console.log('emmployee selected ', employee);
    this.setState({ activeModal: { type: 'Employee Card', props: employee } })
  }


  borrowMoney(amount: number) {
    const playerAction: PlayerAction = {
      name: 'Borrow Money',
      args: { amount }
    }
    this.props.sendPlayerAction(playerAction)
  }

  paybackMoney(amount: number) {
    const playerAction: PlayerAction = {
      name: 'Payback Money',
      args: { amount }
    }
    this.props.sendPlayerAction(playerAction)
  }


  /*   abilityConfirmed(abilityInfo: SelectedAbilityInfo){
      const playerAction: PlayerAction = {
        name: 'Ability Confirmed',
        args: {abilityInfo}
      }
      this.props.sendPlayerAction(playerAction)
  
    } */


  handleReadyToggle(e) {
    let ready: boolean = e.target.checked
    const playerAction: PlayerAction = {
      name: 'Toggle Ready',
      args: { ready }
    }
    this.props.sendPlayerAction(playerAction)

  }



  render() {

    const { managerInfo, managerOptionsTimeLeft, jobSeekers, nextFightFighters } = this.props.managerUiState
    const { money, actionPoints, knownFighters, employees, readyForNextFight, fighters, name } = managerInfo
    const { activeModal, bet } = this.state

    const yourFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.isPlayersFighter)
    //const nextFightFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.inNextFight)

    const otherFighters: FighterInfo[] = knownFighters.filter(fighterInfo => !fighterInfo.isPlayersFighter && !fighterInfo.inNextFight)

    let betPercentage
    if(bet){
      betPercentage = gameConfiguration.betSizePercentages[bet.size]
    }


    return (
      <div id='manager-ui' >
        <div className='headbar' >
          <div className='headbar__left'>
            <div>Time left: {managerOptionsTimeLeft}</div>
          </div>
          <div className='headbar__right'>
            <span className=''>Finished Turn? <input type='checkbox' onChange={this.handleReadyToggle.bind(this)} /></span>
            <span className='money'>{money}</span>
            <span className='action-points'>{actionPoints}</span>
          </div>
        </div>
        <div className='main-content'>
          <div className="bet-status">
            {bet ? 
              <div>
                <p>
                  You have made a {bet.size} bet on {bet.fighterName}. <br/>
                  {betPercentage}% of your total money, aprox {money*betPercentage/100}
                </p>
                <button onClick={() => this.cancelBet()}>Cancel Bet</button>
              </div>
            :
              <p>Bet on the fighter you think will win to make money</p>
            }
          </div>
          <div className='next-fight group-panel'>
            <div className='heading'>Next Fight</div>
            <div className='list fighter-list'>
              {nextFightFighters.map(fighter =>
                <div 
                  className={`
                    next-fight__fighter 
                    list__row 
                    ${!!bet && bet.fighterName == fighter.name && 'next-fight__fighter--bet-active'}
                  `} 
                  key={`next-fight-fighters-${fighter.name}`} 
                  onClick={() => this.fighterSelected(fighter)}
                >
                  {fighter.isPlayersFighter && <span className='your-fighter-in-fight-icon'></span>}
                  <span className='list__row__image'></span>
                  <span className='list__row__name'>{fighter.name}</span>
                  <span className='fights'>
                    <span className='icon'>Fights</span>{fighter.numberOfFights}
                  </span>
                  <span className='wins'>
                    <span className='icon'>Wins</span>{fighter.numberOfWins}
                  </span>
                  <button className='place-bet-button standard-button'>Place Bet</button>
                </div>
              )}
            </div>
          </div>

          <div className='split-panel'>
            <div className='split-panel__left known-fighers'>
              <div className='heading'>Known Fighters</div>
              <ActorList list={knownFighters} onActorSelected={this.fighterSelected.bind(this)} />
            </div>
            <div className='split-panel__right your-fighters'>
              <div className='heading'>Your Fighters</div>
              <ActorList list={yourFighters} onActorSelected={this.fighterSelected.bind(this)} />
            </div>
          </div>

          <div className='split-panel'>
            <div className='split-panel__left job-seekers'>
              <div className='heading'>Job Seekers</div>
              <ActorList list={jobSeekers} onActorSelected={this.jobSeekerSelected.bind(this)} />
            </div>
            <div className='activity-log split-panel__right'>
              <div className='heading'>Employees</div>
              <ActorList list={employees} onActorSelected={this.employeeSelected.bind(this)} />
            </div>
          </div>

          <div className='split-panel'>
            <div className='loan-shark split-panel__left'>
              <div className='heading'>Loan Shark</div>
              <button className='standard-button' onClick={() => this.showLoanSharkCard()}>Borrow money</button>
            </div>
            <div className='activity-log split-panel__right'>
              <div className='heading'>Activity Log</div>
              <div className='activity-log__output'></div>
            </div>
          </div>
        </div>


        {activeModal &&
          <div className='action-modal'>
            <div className='action-modal__blackout'></div>
            <div className='action-modal__content'>

              {activeModal.type == 'Fighter Card' &&
                <FighterCard
                  fighterInfo={activeModal.props} 
                  managerInfo={managerInfo} 
                  placeBet={this.placeBet.bind(this)} 
                  onAbilityBlockSelected={this.abilityBlockSelected.bind(this)} 
                  abilityService={this.abilityService} />
              }

              {activeModal.type == 'Employee Card' &&
                <EmployeeCard employee={activeModal.props} onAbilityBlockSelected={this.abilityBlockSelected.bind(this)} managerInfo={managerInfo} abilityService={this.abilityService} />
              }

              {activeModal.type == 'Job Seeker Card' &&
                <JobSeekerCard jobSeeker={activeModal.props} onAbilityBlockSelected={this.abilityBlockSelected.bind(this)} managerInfo={managerInfo} abilityService={this.abilityService} />
              }
              {activeModal.type == 'Loan Shark Card' &&
                <LoanSharkCard
                  loan={activeModal.props}
                  borrowMoney={this.borrowMoney.bind(this)}
                  paybackMoney={this.paybackMoney.bind(this)}
                />
              }

              {activeModal.type == 'Ability Card' &&
                <AbilityCard
                  sendPlayerAction={this.props.sendPlayerAction}
                  abilityData={activeModal.props} abilityService={this.abilityService}
                />
              }


            </div>
            <button className='action-modal__close-button' onClick={() => this.setState({ activeModal: null })}>
              Close
            </button>
          </div>
        }
      </div>
    )
  }
}
