
import * as React from 'react';
import { GameUiState } from '../../interfaces/game-ui-state.interface';
import ClientWebsocketService from '../main-game/client-websocket-service';
import ManagerUi from './manager-ui/manager-ui';
import FightUi from './fight-ui/fight-ui';

interface GameUiProps {
  websocketService: ClientWebsocketService
}

export default class GameUi extends React.Component<GameUiProps>{
  state: GameUiState
  constructor(props) {
    super(props)
    this.props.websocketService.gameUiStateUpdate.subscribe(
      (gameUiState: GameUiState) => this.setState(gameUiState)
    )
  }

  render() {
    if (!this.state)
      return <span>loading....</span>
    const { websocketService } = this.props
    const { fightUiState, managerUiState, roundStage } = this.state
    console.log('this.state :', this.state);

    switch (roundStage) {

      case 'Manager Options':
        return <ManagerUi
          managerUiState={managerUiState}
          sendPlayerAction={websocketService.sendPlayerAction.bind(websocketService)} />

      case 'Pre Fight News':
        return <div>Pre Fight News</div>

      case 'Fight Day':
        return <FightUi fightUiState={fightUiState} />

      case 'Post Fight Report':
        return <div>Post Fight Report</div>

      default:
        return <div>no round stage, something went wrong</div>

    }

  }
}