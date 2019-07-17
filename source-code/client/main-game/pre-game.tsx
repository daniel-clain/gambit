
import * as React from 'react';
import ClientWebsocketService from './client-websocket-service';
import C_GameUI, { GameUIProps } from '../components/game-ui';
import C_GameLobby, { GameLobbyUIProps } from './game-lobby';
import C_EnterYourName from './enter-your-name';
import C_ConnectionError from './connection-error';
import IGameFacade from '../../classes/game-facade/game-facade';


interface No_Yes{
  no()
  yes()
}


export interface PreGameUIProps{
  gameFacade: ClientWebsocketService
}

export interface PreGameUIState{
  name: string
  gameActive: boolean
  gameLobbyProps: GameLobbyUIProps
  gameProps: GameUIProps

}
export default class C_PreGame extends React.Component<PreGameUIProps>{
  state: PreGameUIState = {
    name: 'kevin',
    gameActive: true,
    gameLobbyProps: null,
    gameProps: {
      fightEventActive: true,
      managerUiProps: null,
      fightUiProps: null
    }
  }
  
  constructor(props: PreGameUIProps){
    super(props)
    this.props.gameFacade.preGameStateUpdates.subscribe(this.setState)
    this.props.gameFacade.gameStateUpdates.subscribe((updatedGameProps: GameUIProps) => this.setState({gameProps: updatedGameProps}))
  }

  render(){

    const connectedToWebsockets = this.props.gameFacade.isConnected
    const {gameActive, name} = this.state



    const isConnected = ({no, yes}: No_Yes) => connectedToWebsockets ? yes() : no()
    const isNameEntered = ({no, yes}: No_Yes) => name ? yes() : no()
    const isGameActive = ({no, yes}: No_Yes) => gameActive ? yes() : no()


    const gameLobbyProps: GameLobbyUIProps = this.state.gameLobbyProps
    const gameProps: GameUIProps = this.state.gameProps


    const determineViewToRender = () => {
      return (
        isConnected({
          no: () => <C_ConnectionError/>,
          yes: () =>  isNameEntered({
            no: () => <C_EnterYourName/>,
            yes: () => isGameActive({
              no: () => <C_GameLobby {...gameLobbyProps}/>,
              yes: () => <C_GameUI {...gameProps}/>
            }),        
          }),      
        })
      )
    }
    return determineViewToRender()
  }
}

