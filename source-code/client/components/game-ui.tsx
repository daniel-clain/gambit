
import * as React from 'react';
import FightUi from "./fight-ui";
import { GameUiState } from '../../interfaces/game-ui-state.interface';
import ClientWebsocketService from '../main-game/client-websocket-service';
import { ManagerUi } from './manager-ui/manager-ui';

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
    const {websocketService} = this.props
    const {fightUiState, managerUiState} = this.state
    if(managerUiState.managerOptionsTimeLeft)
      return <ManagerUi 
        managerUiState={managerUiState} 
        sendPlayerAction={websocketService.sendPlayerAction.bind(websocketService)} />
    else
      return <FightUi fightUiState={fightUiState}/>
  }

}