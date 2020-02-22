
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ManagerUi from '../components/manager-ui/manager-ui';
import { ManagerUiState } from '../../../interfaces/game-ui-state.interface';
import UpdateCommunicatorUiLocal from '../../single-player-test/update-communicator-ui-local';
import { Subject } from 'rxjs';
import './../main-game/global.scss'
import UpdateCommunicatorGame from '../../game-components/update-communicator-game';
import Game from '../../../game-components/game';
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
      sendPlayerAction={updateCommunicatorUi.sendPlayerAction.bind(updateCommunicatorUi)} />
  }
}


ReactDOM.render(<ManagerUiTest />, document.getElementById('react-rendering-div'))