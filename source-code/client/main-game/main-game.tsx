
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ClientWebsocketService from './client-websocket-service';
import C_GameUI from '../components/game-ui';
import C_PreGame, { PreGameUIProps } from './pre-game';

interface MainGameProps{
  websocketService: ClientWebsocketService
}
export interface UIState{
  isGameActive: boolean
  preGameProps: PreGameUIProps

}
export default class C_MainGame extends React.Component<MainGameProps>{
  state: UIState = {
    isGameActive: false,
    preGameProps: null
  }
  constructor(props){
    super(props)
    this.props.websocketService.appStateUpdates.subscribe(this.setState)
  }
  render(){
    const preGameProps = this.state.preGameProps
    return this.state.isGameActive ?
    <C_GameUI gameFacade={this.props.websocketService}/> :
    <C_PreGame {...preGameProps}/>
  }
}
ReactDOM.render(<C_MainGame websocketService={new ClientWebsocketService()}/>, document.getElementById('react-rendering-div'))

