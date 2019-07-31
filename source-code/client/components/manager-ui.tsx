
import * as React from 'react';
import './manager-ui.scss'
import gameConfiguration from '../../classes/game/game-configuration';
import { FighterInfo, LoanSharkData, ManagerUiState, Employee } from '../../interfaces/game-ui-state.interface';
import PlayerAction from '../../interfaces/player-action';
import LoanSharkCard from './loan-shark-card';

interface  ManagerComponentState{
  activeModal: {
    fighterInfo: FighterInfo
    employeeInfo: Employee
    actionCardData: ActionCardData
    loanSharkData: LoanSharkData
  }
}
interface ActionCardData{
  name: string
  shortDescription
  description
}


interface ManagerUiProps{
  managerUiState: ManagerUiState
  sendPlayerAction(playerAction: PlayerAction)
}

export class ManagerUi extends React.Component<ManagerUiProps>{
  state: ManagerComponentState = {
    activeModal: null
  }


  placeBet(betAmount, fighterName){
    console.log(`you have placed a bet of ${betAmount} on ${fighterName}`);
  }

  discoverFightersSelected(){}

  handleFighterSelected(fighter: FighterInfo){
    console.log('ding');
    this.setState({activeModal: {fighterInfo: fighter}})
  }
  handleEmployeeSelected(employee: Employee){
    console.log('dong');
    this.setState({activeModal: {employeeInfo: employee}})
  }

  showLoanSharkCard(){
    const loanSharkData= this.props.managerUiState.loanSharkData
    this.setState({activeModal: {loanSharkData}})

  }
  actionSelected(actionCardData: ActionCardData){
    console.log('action selected');
    this.setState({activeModal: {actionCardData}})
  }

  borrowMoney(ammount: number){
    const playerAction: PlayerAction = {
      name: 'Borrow Money',
      args: {ammount}
    }
    this.props.sendPlayerAction(playerAction)
  }

  paybackMoney(ammount: number){
    const playerAction: PlayerAction = {
      name: 'Payback Money',
      args: {ammount}
    }
    this.props.sendPlayerAction(playerAction)
  }

  
  render(){      

    const {money, actionPoints, timeUntilNextFight, knownFighters, yourEmployees, jobSeekers} = this.props.managerUiState
    const {activeModal} = this.state
    
    const yourFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.isPlayersFighter)
    
    const nextFightFighters: FighterInfo[] = knownFighters.filter(fighterInfo => fighterInfo.inNextFight)
    
    const otherFighters: FighterInfo[] = knownFighters.filter(fighterInfo => !fighterInfo.isPlayersFighter && !fighterInfo.inNextFight)


    return (
      <div id='manager-ui' >
        <div className='headbar' >
          <div className='headbar__left'>
            <div>Time until next fight: {timeUntilNextFight}</div>
          </div>
          <div className='headbar__right'>
            <span className='money'>{money}</span>
            <span className='action-points'>{actionPoints}</span>
          </div>
        </div>
        <div className='main-content'>
          <div className='next-fight group-panel'>
            <div className='heading'>Next Fight</div>
            <div className='list fighter-list'>
              {nextFightFighters.map(fighter => 
                <div  className='next-fight__fighter list__row' key={fighter.name} onClick={() => this.handleFighterSelected(fighter)}>
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
          <div className='your-fighters group-panel'>
            <div className='heading'>Your Fighters</div>   
              <div className='list fighter-list'>    
                {yourFighters.map(fighter => 
                  <div  className='your-fighters__fighter list__row' key={fighter.name} onClick={() => this.handleFighterSelected(fighter)}>
                    {fighter.inNextFight && <span className='your-fighter-in-fight-icon'></span>}
                    <span className='list__row__image'></span>
                    <span className='list__row__name'>{fighter.name}</span>
                    <span className='fights'>
                      <span className='icon'>Fights</span>{fighter.numberOfFights}
                    </span>
                    <span className='wins'>
                      <span className='icon'>Wins</span>{fighter.numberOfWins}
                    </span>
                  </div>
                )}
              </div>
          </div>
          <div className='known-fighters group-panel'>
            <div className='heading'>Other Known Fighters</div>
            <div className='group-panel__left'>

              <div className='your-fighter-options'>
                <ActionBlock
                  actionCardData={{
                    name: 'Discover Fighters',
                    shortDescription: 'Become aware of existing fighter and their public stats',
                    description: 'zzzyyyzzzyyyzzzyyy'
                  }}                  
                  actionSelected={this.actionSelected.bind(this)}
                />
              </div>
              {/* <div className='discover-fighters-box'>
                <button className='standard-button' onClick={() => this.setState({isActionModalActive: true})}>Discover Fighters</button>
              </div> */}
            </div>            
            <div className='group-panel__right'>
              <div className='list fighter-list'>
                {otherFighters.map(fighter => 
                  <div  className='known-fighters__fighter list__row' key={fighter.name} onClick={() => this.handleFighterSelected(fighter)}>
                    <span className='list__row__image'></span>
                    <span className='list__row__name'>{fighter.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>          
          <div className='employees group-panel'>
            <div className='heading'>Employees</div>
            <div className='group-panel__left'>
              <ActionBlock
                actionCardData={{
                  name: 'View Job Seekers',
                  shortDescription: 'Check which potential employees are making themselves available for hiring',
                  description: 'zzzyyyzzzyyyzzzyyy'
                }}                  
                actionSelected={this.actionSelected.bind(this)}
              />
                {/* <button className='standard-button' onClick={() => this.setState({isActionModalActive: true})}>View Job Seekers</button> */}
            </div>
            <div className='group-panel__right'>
              <div className='list employee-list'>    
                {yourEmployees.map(employee => 
                  <div  className='employees__employee list__row' key={employee.name} onClick={() => this.handleEmployeeSelected(employee)}>
                    <span className='list__row__image'></span>
                    <span className='list__row__name'>{employee.name}</span>
                  </div>
                )}
              </div>
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
        {this.state.activeModal &&
          <div className='action-modal'>
            <div className='action-modal__blackout'></div>
            <div className='action-modal__content'>
              {activeModal.fighterInfo &&
                <FighterCard fighterInfo={activeModal.fighterInfo} money={money} placeBet={this.placeBet} actionSelected={this.actionSelected.bind(this)}/>
              }

              {activeModal.employeeInfo &&
                <EmployeeCard {...activeModal.employeeInfo}/>
              }
              {activeModal.actionCardData &&
                <ActionCard {...activeModal.actionCardData}/>
              }
              {activeModal.loanSharkData &&
                <LoanSharkCard 
                  loanSharkData={activeModal.loanSharkData}
                  borrowMoney={this.borrowMoney.bind(this)}  
                  paybackMoney={this.paybackMoney.bind(this)}
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

class ActionCard extends React.Component<ActionCardData>{
  render() {
    const {name, description} = this.props
    return (
      <div className='action-card'>
        <div className='action-card__name'>{name}</div>
        <div className='action-card__description'>{description}</div>

      </div>
    )
  }
}



interface FighterCardProps{
  money: number
  placeBet: Function
  fighterInfo: FighterInfo
  actionSelected(data: ActionCardData)
}
class FighterCard extends React.Component<FighterCardProps>{
  render(){
    const {name, inNextFight, isPlayersFighter, strength, speed, intelligence, aggression, manager, publicityRating, endurance, numberOfFights, numberOfWins, injured, healthRating, doping, happyness} = this.props.fighterInfo
    const {money, placeBet, actionSelected} = this.props

    const {betSizePercentages} = gameConfiguration

    const smallBetAmount = Math.round(money * (betSizePercentages.small/100))
    const mediumBetAmount = Math.round(money * (betSizePercentages.medium/100))
    const largeBetAmount = Math.round(money * (betSizePercentages.large/100))

    return (
      <div className='fighter-card'>
        <div className='fighter-card__name'>{name}</div>

        <div className='fighter-card__image left'></div>

        <div className='right'>
          <div className='fight-experience'>
            <span className='fights'>
              <span className='icon'>Fights</span>{numberOfFights}
            </span>
            <span className='wins'>
              <span className='icon'>Wins</span>{numberOfWins}
            </span>
          </div>
          {inNextFight &&
            <div className='bet-options'>
              <div className='small-bet bet-option'>
                <div>Small Bet</div>
                <div className='bet-info'>({betSizePercentages.small}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{smallBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet(smallBetAmount, name)}>Place Bet</button>
              </div>

              <div className='medium-bet bet-option'>
                <div>Medium Bet</div>
                <div className='bet-info'>({betSizePercentages.medium}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{mediumBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet(mediumBetAmount, name)}>Place Bet</button>
              </div>

              <div className='large-bet bet-option'>
                <div>Large Bet</div>
                <div className='bet-info'>({betSizePercentages.large}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{largeBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet(largeBetAmount, name)}>Place Bet</button>
              </div>
            </div>
          }

          <div className='stats'>
            <div className='heading'>{isPlayersFighter && <span>Known </span>}Stats</div>
            <div className='basic-stats stats__group'>
              <div className='stats__heading'>Public Stats</div>
              <div className='stat'><label>Publicity Rating: </label>{publicityRating}</div>
              <div className='stat'><label>Health: </label>{healthRating}</div>
              <div className='stat'><label>Injured: </label>{injured ? 'yes':'no'}</div>
              <div className='stat'><label>Manager: </label>{manager}</div>
            </div>

            <div className='private-stats stats__group'>
              <div className='stats__heading'>Private Stats</div>
              <div className='stat'><label>Strength: </label>{strength}</div>
              <div className='stat'><label>Speed: </label>{speed}</div>
              <div className='stat'><label>Endurance: </label>{endurance}</div>
              <div className='stat'><label>Intelligence: </label>{intelligence}</div>
              <div className='stat'><label>Aggression: </label>{aggression}</div>
              <div className='stat'><label>Doping: </label>{doping ? 'yes':'no'}</div>
              <div className='stat'><label>Happiness: </label>{happyness}</div>
            </div>
          </div>


        </div>
        <div className='options'>
          <div className='heading'>Options</div>
          {isPlayersFighter && 
            <div className='your-fighter-options'>
              <ActionBlock
                actionCardData={{
                  name: 'Train Fighter',
                  shortDescription: 'Increase your fighters fighting stats',
                  description: 'xxxxxxxxxxx'
                }}                  
                actionSelected={actionSelected}
              />
              <ActionBlock
                actionCardData={{
                  name: 'Promote Fighter',
                  shortDescription: 'Fighter gets more prize money if he wins',
                  description: 'xxxxxxxxxxx'
                }}                  
                actionSelected={actionSelected}
              />
              <ActionBlock
                actionCardData={{
                  name: 'Guard Fighter',
                  shortDescription: 'Guards fighter against any malicious act',
                  description: 'xxxxxxxxxxx'
                }}                  
                actionSelected={actionSelected}
              />
              <ActionBlock
                actionCardData={{
                  name: 'Dope Fighter',
                  shortDescription: 'Fighter gains large increase to stats. Has a few downsides',
                  description: 'xxxxxxxxxxx'
                }}                  
                actionSelected={actionSelected}
              />
            </div>
          }

          {!isPlayersFighter && 
            <div className='other-fighter-options'>
              {!inNextFight &&
                <ActionBlock
                  actionCardData={{
                    name: 'Offer Contract',
                    shortDescription: 'Try to entice fighter to fight for you under contract',
                    description: 'xxxxxxxxxxx'
                  }}                  
                  actionSelected={actionSelected}
                />
              }
              <ActionBlock
                actionCardData={{
                  name: 'Assault Fighter',
                  shortDescription: 'Send heavies to rough up fighter',
                  description: 'xxxxxxxxxxx'
                }}                  
                actionSelected={actionSelected}       
              />
              <ActionBlock
                actionCardData={{
                  name: 'Investigate Fighter',
                  shortDescription: 'Attempt to uncover private information about fighter',
                  description: 'xxxxxxxxxxx'
                }}                  
                actionSelected={actionSelected}
              />
              <ActionBlock
                actionCardData={{
                  name: 'Poison Fighter',
                  shortDescription: 'Chance to seriously affect a fighters health',
                  description: '10% chance (times skil level) to make the fighter feel sick. 30% chance the fighter will be too  unheathy to fight, 5% chance to kill other fighter'
                }}                  
                actionSelected={actionSelected}
              />
            </div>
          }
        </div>
        
      </div>
    )
  }
}

class EmployeeCard extends React.Component<Employee>{
  render(){
    return <div>employee card</div>
  }
}

interface ActionBlockProps{
  actionCardData: ActionCardData
  actionSelected(data: ActionCardData)
}
class ActionBlock extends React.Component<ActionBlockProps>{
  render(){

    const {actionSelected, actionCardData} = this.props
    const {name, shortDescription, description} = actionCardData

    return (
      <div className='action-block'>
        <div className='action-block__name'>{name}</div>
        <div className='action-block__short-description'>{shortDescription}</div>
        <button className='standard-button action-block__button' onClick={()=>actionSelected(actionCardData)}>Do Action</button>
      </div>
    )
  }
}
