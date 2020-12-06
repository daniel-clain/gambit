
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Subject } from 'rxjs';
import './../main-game/global.scss'
import Game from '../../../game-components/game';
import UpdateCommunicatorGame from '../../../game-components/update-communicators/update-communicator-game';
import Manager from '../../../game-components/manager';
import UpdateCommunicatorUiLocal from '../single-player-test/update-communicator-ui-local';
import { RoundController } from '../../../game-components/round-controller/round-controller';

const mockGame = {
  roundController: {
    endOfRoundSubject: new Subject(),
    endOfManagerOptionsStageSubject: new Subject()
  } as RoundController
} as Game


const mockManager = {
  managerUpdatedSubject: new Subject()
}

class MockUpdateCommunicatorGame extends UpdateCommunicatorGame {
  constructor() {
    super(mockGame, null)
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
    activityLogs: [],
    fighters: [],
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
    employees: [],
    readyForNextFight: false,
    retired: false
  },
  managerOptionsTimeLeft: 500,
  jobSeekers: [],
  nextFightFighters: [],
  delayedExecutionAbilities: []
}

export default class ManagerUiTest extends React.Component {
  state = {
    fightState: null
  }


  render() {
    return <ManagerUi
      managerUiState={managerUiState}
      sendGameAction={updateCommunicatorUi.sendGameAction.bind(updateCommunicatorUi)} />
  }
}


ReactDOM.render(<ManagerUiTest />, document.getElementById('react-rendering-div'))