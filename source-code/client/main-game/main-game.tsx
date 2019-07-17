
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import C_PreGame from './pre-game';
import ClientWebsocketService from './client-websocket-service';
import IGameFacade from '../../classes/game-facade/game-facade';


export default class C_ClientUI extends React.Component{
  gameFacade: ClientWebsocketService
  constructor(props){
    super(props)
    this.gameFacade = new ClientWebsocketService()
  }
  render(){
    return <C_PreGame gameFacade={this.gameFacade}/>
  }
}
ReactDOM.render(<C_ClientUI/>, document.getElementById('react-rendering-div'))

