
import * as React from 'react';
import { GameUiState } from '../../interfaces/game-ui-state.interface';
import ManagerUi from './manager-ui/manager-ui';
import FightUi from './fight-ui/fight-ui';
import IUpdateCommunicatorUi from '../../interfaces/update-communicator-ui.interface';

interface GameUiProps {
  updateCommunicatorUi: IUpdateCommunicatorUi
}

export default class GameUi extends React.Component<GameUiProps>{
  state: GameUiState
  constructor(props) {
    super(props)
    this.props.updateCommunicatorUi.receiveGameUiStateUpdate.subscribe(
      (gameUiState: GameUiState) => this.setState(gameUiState)
    )
  }

  render() {
    if (!this.state)
      return <span>loading....</span>
    const { updateCommunicatorUi } = this.props
    const { fightState, managerUiState, roundStage } = this.state

    switch (roundStage) {

      case 'Manager Options':
        return <ManagerUi
          managerUiState={managerUiState}
          sendPlayerAction={updateCommunicatorUi.sendPlayerAction.bind(updateCommunicatorUi)} />

      case 'Pre Fight News':
        return <div>Pre Fight News</div>

      case 'Fight Day':
        return <FightUi fightState={fightState} />

      case 'Post Fight Report':
        return <div>Post Fight Report</div>

      default:
        return <div>no round stage, something went wrong</div>

    }

  }
}