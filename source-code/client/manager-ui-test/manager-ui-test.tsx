
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ManagerUi from '../components/manager-ui/manager-ui';
import { ManagerUiState } from '../../interfaces/game-ui-state.interface';
import UpdateCommunicatorUiLocal from '../single-player-test/update-communicator-ui-local';
import { Subject } from 'rxjs';
import './../main-game/global.scss'
import UpdateCommunicatorGame from '../../game-components/update-communicator-game';
import Game from '../../game-components/game';
import Manager from '../../game-components/manager/manager';

const mockGame = {
  roundController: {
    roundStateUpdateSubject: new Subject(),
    fightStateUpdatedSubject: new Subject(),
    endOfRoundSubject: new Subject(),
    endOfManagerOptionsStageSubject: new Subject()
  }
}
const mockManager = {
  managerUpdatedSubject: new Subject()
}

class MockUpdateCommunicatorGame extends UpdateCommunicatorGame {
  constructor() {
    super(mockGame as Game, mockManager as Manager)
  }
}

const updateCommunicatorGame: MockUpdateCommunicatorGame = new MockUpdateCommunicatorGame()

const updateCommunicatorUi = new UpdateCommunicatorUiLocal(updateCommunicatorGame)

const managerUiState: ManagerUiState = {

  managerInfo: {
    name: 'Manager Bob',
    abilities: ["Dope Fighter", "Train Fighter", "Research Fighter", "Offer Contract"],
    money: 500,
    actionPoints: 2,
    otherManagers: [{name: 'Manager Dave'}],
    activityLog: [],
    fighters: [
      {
        "name": "Suleman",
        "strength": 1,
        fitness: 1,
        "intelligence": 1,
        "aggression": 1,
        "numberOfFights": 0,
        manager: 'Manager Bob',
        "numberOfWins": 0
      },
      {
        "name": "Hassan",
        "strength": 1,
        fitness: 1,
        "intelligence": 1,
        "aggression": 1,
        "numberOfFights": 0,
        manager: 'Manager Bob',
        "numberOfWins": 0
      },
      {
        "name": "Angelo",
        "strength": 1,
        fitness: 1,
        "intelligence": 1,
        "aggression": 1,
        "numberOfFights": 0,
        manager: 'Manager Bob',
        "numberOfWins": 0
      }],
    knownFighters: [      
      {
        "name": "Mark",
        "knownStats": {
          strength: undefined,
          fitness: undefined,
          intelligence: undefined,
          aggression: undefined,
          manager: undefined,
          numberOfFights: undefined,
          numberOfWins: undefined
        }
      },      
      {
        "name": "Tomasz",
        "knownStats": {
          strength: undefined,
          fitness: undefined,
          intelligence: undefined,
          aggression: undefined,
          manager: undefined,
          numberOfFights: undefined,
          numberOfWins: undefined
        }
      },
      {
        "name": "Paul",
        "knownStats": {
          strength: undefined,
          fitness: undefined,
          intelligence: undefined,
          aggression: undefined,
          manager: undefined,
          numberOfFights: undefined,
          numberOfWins: undefined
        }
      }
    ],
    loan: { debt: null, weeksOverdue: null },
    nextFightBet: null,
    employees: [
      {
        "name": "Kevin",
        "profession": "Thug",
        "abilities": ["Guard Fighter",
          "Assault Fighter"],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "Steve",
        "profession": 'Hitman',
        "abilities": ['Murder Fighter', 'Poison Fighter'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "James",
        "profession": 'Private Agent',
        "abilities": ['Do Surveillance', 'Poison Fighter', 'Gather Evidence', 'Research Fighter'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "Jason",
        "profession": 'Drug Dealer',
        "abilities": ['Sell Drugs'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "Joe",
        "profession": 'Promoter',
        "abilities": ['Promote Fighter'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "Fred",
        "profession": 'Lawyer',
        "abilities": ['Sue Manager', 'Gather Evidence'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "George",
        "profession": 'Talent Scout',
        "abilities": ['Research Fighter', 'Offer Contract'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      },
      {
        "name": "Jake",
        "profession": 'Trainer',
        "abilities": ['Train Fighter'],
        "skillLevel": 3,
        "activeContract": {
          "costPerWeek": 30,
          "weeksRemaining": 7
        },
        "actionPoints": 1
      }
    ],
    readyForNextFight: false,
    retired: false
  },
  managerOptionsTimeLeft: 500,
  jobSeekers: [],
  nextFightFighters: [
    {name: 'Mark'},
    {name: 'Jake'},
    {name: 'Suleman'},
    {name: 'Hassan'}
  ],
  delayedExecutionAbilities: []
}

export default class ManagerUiTest extends React.Component {
  state = {
    fightState: null
  }


  render() {
    return <ManagerUi
      managerUiState={managerUiState}
      sendPlayerAction={updateCommunicatorUi.sendPlayerAction.bind(updateCommunicatorUi)} />
  }
}


ReactDOM.render(<ManagerUiTest />, document.getElementById('react-rendering-div'))