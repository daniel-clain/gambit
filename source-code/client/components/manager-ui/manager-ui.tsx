
import * as React from 'react';
import './manager-ui.scss'
import { FighterInfo, Loan, ManagerUiState, Employee, JobSeeker, ManagerInfo } from '../../../interfaces/game-ui-state.interface';
import PlayerAction from '../../../interfaces/player-action';
import LoanSharkCard from './loan-shark-card';
import gameConfiguration from '../../../classes/game/game-configuration';
import List from './actor-list';
import { IOptionClient, SelectedOptionInfo } from '../../../classes/game/manager/manager-options/manager-option';
import { FighterCard } from './fighter-card';
import { Bet } from '../../../interfaces/game/bet';
import { EmployeeJobSeekerCard } from './employee-job-seeker-card';
import OptionBlock from './option-block';
import OptionCard, { OptionData } from './option-card';

interface Card{
  type: ActorTypes,
  data: FighterInfo | Employee | JobSeeker | ManagerInfo

}

type ActiveModalTypes = 'Fighter Card' | 'Employee Card' | 'Job Seeker Card' | 'Loan Shark Card' | 'Option Card'

interface ActiveModal{
  type: ActiveModalTypes
  props: any
}

interface  ManagerComponentState{
  activeModal: ActiveModal
  activeSelectList: {

  }
}
export type ActorTypes = 'Manager' | 'Fighter' | 'Employee' | 'Job Seeker'


interface ManagerUiProps{
  managerUiState: ManagerUiState
  sendPlayerAction(playerAction: PlayerAction)
}

export class ManagerUi extends React.Component<ManagerUiProps, ManagerComponentState>{
  state: ManagerComponentState = {
    activeModal: null,
    activeSelectList: null
  }


  placeBet(bet: Bet){
    console.log(`you have placed a bet of ${bet.amount} on ${bet.fighterName}`);
  }


  showLoanSharkCard(){
    const loanSharkProps = this.props.managerUiState.loan
    this.setState({activeModal: {type: 'Loan Shark Card', props: loanSharkProps}})
  }

  optionBlockSelected(optionData: OptionData){
    console.log('option selected ', optionData);
    this.setState({activeModal: {type: 'Option Card', props: optionData}})
  }

  fighterSelected(fighterInfo: FighterInfo){
    console.log('fighter selected ', fighterInfo);
    this.setState({activeModal: {type: 'Fighter Card', props: fighterInfo}})
  }

  jobSeekerSelected(jobSeeker: JobSeeker){
    console.log('jobSeeker selected ', jobSeeker);
    this.setState({activeModal: {type: 'Job Seeker Card', props: jobSeeker}})
  }

  employeeSelected(employee: Employee){
    console.log('emmployee selected ', employee);
    this.setState({activeModal: {type: 'Employee Card', props: employee}})
  }


  borrowMoney(amount: number){
    const playerAction: PlayerAction = {
      name: 'Borrow Money',
      args: {amount}
    }
    this.props.sendPlayerAction(playerAction)
  }

  paybackMoney(amount: number){
    const playerAction: PlayerAction = {
      name: 'Payback Money',
      args: {amount}
    }
    this.props.sendPlayerAction(playerAction)
  }


  optionConfirmed(optionInfo: SelectedOptionInfo){
    const playerAction: PlayerAction = {
      name: 'Option Confirmed',
      args: {optionInfo}
    }
    this.props.sendPlayerAction(playerAction)

  }


  handleReadyToggle(e){
    let ready = e.target.checked
    const playerAction: PlayerAction = {
      name: 'Toggle Ready',
      args: {ready}
    }
    this.props.sendPlayerAction(playerAction)

  }

  
  render(){      

    const {money, actionPoints, managerOptionsTimeLeft, knownFighters, employees, jobSeekers, nextFightFighters, readyForNextFight, managersFighters, name} = this.props.managerUiState
    const {activeModal} = this.state
    
    const yourFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.isPlayersFighter)
    
    //const nextFightFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.inNextFight)
    
    const otherFighters: FighterInfo[] = knownFighters.filter(fighterInfo => !fighterInfo.isPlayersFighter && !fighterInfo.inNextFight)


    return (
      <div id='manager-ui' >
        <div className='headbar' >
          <div className='headbar__left'>
            <div>Time left: {managerOptionsTimeLeft}</div>
          </div>
          <div className='headbar__right'>
            <span className=''>Finished Turn? <input type='checkbox' onChange={this.handleReadyToggle.bind(this)}/></span>
            <span className='money'>{money}</span>
            <span className='action-points'>{actionPoints}</span>
          </div>
        </div>
        <div className='main-content'>
          <div className='next-fight group-panel'>
            <div className='heading'>Next Fight</div>
            <div className='list fighter-list'>
              {nextFightFighters.map(fighter => 
                <div  className='next-fight__fighter list__row' key={`next-fight-fighters-${fighter.name}`} onClick={() => this.fighterSelected(fighter)}>
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
              <List list={knownFighters} onActorSelected={this.fighterSelected.bind(this)} />   
            </div>
            <div className='split-panel__right your-fighters'>
              <div className='heading'>Your Fighters</div>   
              <List list={yourFighters} onActorSelected={this.fighterSelected.bind(this)} />   
            </div>
          </div>       

          <div className='split-panel'>
            <div className='split-panel__left job-seekers'>
              <div className='heading'>Job Seekers</div>   
              <List list={jobSeekers} onActorSelected={this.jobSeekerSelected.bind(this)} />   
            </div>
            <div className='activity-log split-panel__right'>
              <div className='heading'>Employees</div>   
              <List list={employees} onActorSelected={this.employeeSelected.bind(this)} />   
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
                <FighterCard fighterInfo={activeModal.props} money={money} placeBet={this.placeBet} onOptionBlockSelected={this.optionBlockSelected.bind(this)} managerName={name}/>
              }

              {(activeModal.type == 'Employee Card' || activeModal.type == 'Job Seeker Card') &&
                <EmployeeJobSeekerCard actorInfo={activeModal.props} onOptionBlockSelected={this.optionBlockSelected.bind(this)} managerName={name}/>
              }

              {activeModal.type == 'Loan Shark Card' && 
                <LoanSharkCard 
                  loan={activeModal.props}
                  borrowMoney={this.borrowMoney.bind(this)}  
                  paybackMoney={this.paybackMoney.bind(this)}
                />
              }

              {activeModal.type == 'Option Card' && 
                <OptionCard
                  sendPlayerAction={this.props.sendPlayerAction}
                  optionData={activeModal.props}
                />
              }

              
            </div>
            <button className='action-modal__close-button' onClick={() => this.setState({activeModal: null})}>
              Close
            </button>
          </div>
        }
      </div>
    )
  }
}
