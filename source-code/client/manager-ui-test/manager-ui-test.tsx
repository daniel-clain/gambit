
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './global.scss'
import { ManagerUiState } from '../../interfaces/game-ui-state.interface';
import { ManagerUi } from '../components/manager-ui';

class ManagerUiTest extends React.Component{


    
  managerUiState: ManagerUiState = null/* {
    money: 500,
    actionPoints: 5,
    timeUntilNextFight: 47,
    knownFighters: [
      {name: 'Steve', inNextFight: true, isPlayersFighter: false, strength: 3, speed: 2, injured: false, intelligence: 2, aggression:2, publicityRating: 3, healthRating: 5, manager: null, numberOfWins: 6, numberOfFights: 16, endurance: 5, doping: false, happyness: 5},
      {name: 'Allan', inNextFight: true, isPlayersFighter: true, strength: 3, speed: 2, injured: false, intelligence: 2, aggression:2, publicityRating: 3, healthRating: 5, manager: null, numberOfWins: 2, numberOfFights: 5, endurance: 5, doping: false, happyness: 5},
      {name: 'Larry', inNextFight: false, isPlayersFighter: false, strength: 3, speed: 2, injured: false, intelligence: 2, aggression:2, publicityRating: 3, healthRating: 5, manager: null, numberOfWins: 4, numberOfFights: 8, endurance: 5, doping: false, happyness: 5},
      {name: 'Arnold', inNextFight: false, isPlayersFighter: false, strength: 3, speed: 2, injured: false, intelligence: 2, aggression:2, publicityRating: 3, healthRating: 5, manager: null, numberOfWins: 4, numberOfFights: 8, endurance: 5, doping: false, happyness: 5},
      {name: 'Kevin', inNextFight: false, isPlayersFighter: false, strength: 3, speed: 2, injured: false, intelligence: 2, aggression:2, publicityRating: 3, healthRating: 5, manager: null, numberOfWins: 4, numberOfFights: 8, endurance: 5, doping: false, happyness: 5},
      {name: 'Bruce', inNextFight: false, isPlayersFighter: true, strength: 3, speed: 2, injured: false, intelligence: 2, aggression:2, publicityRating: 3, healthRating: 5, manager: null, numberOfWins: 1, numberOfFights: 1, endurance: 5, doping: false, happyness: 5}
    ],
    yourEmployees: [
      {name: 'Harriet', type: 'Personal Trainer', skillRating: 1, actionPoints: 2, contract:{costPerWeek: 50, weeksRemaining: 1}},
      {name: 'Marcel', type: 'Talent Scout', skillRating: 1, actionPoints: 2, contract:{costPerWeek: 50, weeksRemaining: 1}}        
    ],
    jobSeekers: [
      {name: 'Gunter', type: 'Private Investigator', skillRating: 1, offeredTerms: {costPerWeek: 200, weeks: 2}},
    ],
    loanSharkData: {
      debt: 327,
      weeksOverdue: 0
    },
    nextFightBet: null
  } */
  
  render(){
    if(window.innerWidth >window.innerHeight ){
      alert("Please adjust the orientation on your viewport to Portrait! view, thank you for your cooperation");
    }
    
    return <ManagerUi managerUiState={this.managerUiState} sendPlayerAction={null}/>
  }
}
ReactDOM.render(<ManagerUiTest/>, document.getElementById('react-rendering-div'))

