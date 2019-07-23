import { Socket } from 'socket.io';
import ClientName from '../types/client-name.type';
import ClientId from '../types/client-id.type';
import ClientUIState, { GameHostState, GameState } from '../interfaces/client-ui-state.interface';
import ClientAction from '../interfaces/client-action';
import GameHost from './game-host';
import GameLobbyClient from '../interfaces/game-lobby-client.interface';
import GameLobby from './game-lobby';

export type GameHostUpdateNames = 'Connected Clients Update' | 'Games Lobbies Update'


export default class ConnectedClient{

  private clientUiState: ClientUIState = {
    gameHost: {
      connectedPlayers: [],
      gameLobbies: [],
      globalChat: []
    },
    game: null
  }


  constructor(private _socket: Socket, private _id: ClientId, private _name: ClientName, private gameHost: GameHost){
    this._socket.on('Action From Client', (actionFromClient: ClientAction) => this.handleActionFromClient(actionFromClient))
    this._socket.on('disconnect', (reason) => gameHost.clientDisconnected(this, reason))
  }

  get id(){
    return this._id
  }
  get name(){
    return this._name
  }


  private handleActionFromClient(action: ClientAction){
    switch(action.name){
      case 'Create Game' : this.createGame(); break
      case 'Cancel Game' : this.cancelGame(action.data.gameId); break
      case 'Start Game' : this.startGame(action.data.gameId); break
      case 'Join Game' : this.joinGame(action.data.gameId); break
      case 'Ready To Start Game' : this.readyToStartGameToggled(action.data.gameId, action.data.readyValue); break
      case 'Leave Game' : this.leaveGame(action.data.gameId); break 
      case 'Submit Global Chat' : this.submitGlobalMessage(action.data.message); break 
    }
  }
  private createGame(){

    const gameLobbyClient: GameLobbyClient = {
      name: this.name,
      id: this.id,
      ready: false
    }

    const createdGame: GameLobby = {
      id: new Date().getTime().toString(),
      creator: gameLobbyClient,
      clients: [gameLobbyClient],
      gameChat: []
    }
    this.gameHost.clientCreatedGameLobby(createdGame)
  }

  private joinGame(gameId){
    this.gameHost.clientJoinedGameLobby(this, gameId)
  }

  private cancelGame(gameId){
    this.gameHost.clientCanceledGameLobby(gameId)
  }

  private leaveGame(gameId){
    this.gameHost.clientLeftGameLobby(this, gameId)
  }

  private readyToStartGameToggled(gameId, readyValue){
    this.gameHost.clientToggledReadyInGameLobby(this, gameId, readyValue)
  }

  private startGame(gameId){
    this.gameHost.clientStartedGameLobby(gameId)
  }

  private submitGlobalMessage(message: string){
    this.gameHost.clientSubmittedGlobalMessage(this, message)
  }

  gameHostUiUpdate(gameHostState: GameHostState){ 
    this.clientUiState.gameHost = gameHostState
    this.sendUIStateToClient()
  }

  gameUiUpdate(gameState: GameState){ 
    this.clientUiState.game = gameState
    this.sendUIStateToClient()
  }

  private sendUIStateToClient(){
    this._socket.emit('UI State Update', this.clientUiState)
  }

}