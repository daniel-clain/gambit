
import * as React from 'react';
import FightUi from "./fight-ui";
import { GameUiState } from '../../interfaces/game-ui-state.interface';
import { ManagerUi } from './manager-ui';
import ClientWebsocketService from '../main-game/client-websocket-service';

interface GameUiProps{
  websocketService: ClientWebsocketService
}

export default class GameUi extends React.Component<GameUiProps>{
  state: GameUiState
  constructor(props){
    super(props)
    this.props.websocketService.gameUiStateUpdate.subscribe(
      (gameUiState: GameUiState) => this.setState(gameUiState)
    )
  }

  render(){
    if(!this.state)
      return <span>loading....</span>
    const {fightUiState, managerUiState} = this.state
    if(fightUiState)
      return <FightUi fightUiState={fightUiState}/>
    else
      return <ManagerUi managerUiState={managerUiState} sendPlayerAction={this.props.websocketService.sendPlayerAction} />
  }

}