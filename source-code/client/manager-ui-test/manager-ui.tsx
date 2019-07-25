
import * as React from 'react';
import './manager-ui.scss'

interface  ManagerUiState{
  activeModal: {
    fighterCardProps: any
    actionBlockProps: any
  }
}

export class ManagerUi extends React.Component<any>{
  state: ManagerUiState = {
    activeModal: null
  }

  discoverFightersSelected(){}
  
  render(){  
    
    const manager = {
      money: 500,
      actionPoints: 5,
      timeUntilNextFight: 47,
      nextFight: {
        fighters: [
          {name: 'Bob'},
          {name: 'Fred'}
        ]
      },
      knownFighters: [
        {name: 'Steve'},
        {name: 'Allan'},
        {name: 'Larry'},
        {name: 'Arnold'},
        {name: 'Kevin'},
        {name: 'Bruce'}
      ],
      yourFighters: [
        {name: 'Joe'}
      ],
      yourEmployees: [
        {name: 'Harriet', type: 'trainer'},
        {name: 'Gunter', type: 'private investigator'},
        {name: 'Marcel', type: 'talent scout'}        
      ],
      actions: {
        discoverFighters: {          
          money: 10,
          actionPoints: 1
        }
      }
    }

    const {money, actionPoints, timeUntilNextFight, nextFight, knownFighters, yourFighters, yourEmployees} = manager


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
            <div>Fighters</div>
            <div className='list fighter-list'>
              {nextFight.fighters.map(fighter => 
                <div  className='next-fight__fighter list__row' key={fighter.name}>
                  <span className='list__row__image'></span>
                  <span className='list__row__name'>{fighter.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className='known-fighters group-panel'>
            <div className='heading'>Known Fighters</div>
            <div className='group-panel__left'>
              <div className='discover-fighters-box'>
                <button className='standard-button' onClick={() => this.setState({isActionModalActive: true})}>Discover Fighters</button>
              </div>
            </div>
            <div className='group-panel__right'>
              <div>Fighters <sup>({knownFighters.length})</sup></div>
              <div className='list fighter-list'>
                {knownFighters.map(fighter => 
                  <div  className='known-fighters__fighter list__row' key={fighter.name}>
                    <span className='list__row__image'></span>
                    <span className='list__row__name'>{fighter.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='your-fighters group-panel'>
            <div className='heading'>Your Fighters</div>   
              <div className='list fighter-list'>    
                {yourFighters.map(fighter => 
                  <div  className='your-fighters__fighter list__row' key={fighter.name}>
                    <span className='list__row__image'></span>
                    <span className='list__row__name'>{fighter.name}</span>
                  </div>
                )}
              </div>
          </div>
          <div className='employees group-panel'>
            <div className='heading'>Employees</div>
            <div className='group-panel__left'>
              <div className='discover-fighters-box'>
                <button className='standard-button' onClick={() => this.setState({isActionModalActive: true})}>View Job Seekers</button>
              </div>
            </div>
            <div className='group-panel__right'>
              <div>Your Employees</div>  
              <div className='list employee-list'>    
                {yourEmployees.map(fighter => 
                  <div  className='known-fighters__fighter list__row' key={fighter.name}>
                    <span className='list__row__image'></span>
                    <span className='list__row__name'>{fighter.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.state.activeModal &&
          <div className='action-modal'>
            <div className='action-modal__blackout'></div>
            <div className='action-modal__content'>
              {this.state.activeModal.fighterCardProps &&
                <FighterCard/>
              }
              {this.state.activeModal.actionBlockProps &&
                <ActionBlock/>
              }
            </div>
            <button className='action-modal__close-button' onClick={() => this.setState({isActionModalActive: false})}>
              Close
            </button>
          </div>
        }
      </div>
    )
  }
}

class FighterCard extends React.Component{
  render(){
    return <div>fighter card</div>
  }
}

class ActionBlock extends React.Component{
  render(){
    return <div>action block</div>
  }
}

