
import { Subject } from 'rxjs';
import { Socket } from 'socket.io';
import ClientName from '../types/client-name.type';
import ClientId from '../types/client-id.type';
import CreatedGame from './game-lobby';
import ClientUIState, { GameLobbyState } from '../interfaces/client-ui-state.interface';
import { ClientAction } from '../interfaces/client-action';

export type GameLobbyUpdateNames = 'Connected Clients Update' | 'Available Games Update'


export interface GameLobbyUpdate{
  name: GameLobbyUpdateNames
  data: any
}


export default class xConnectedClient{
  private _socket: Socket
  private _id: ClientId
  private _name: ClientName

  private clientUiState: ClientUIState = {
    gameLobby: {
      connectedPlayers: [],
      availableGames: [],
      globalChat: []
    },
    game: null
  }

  createdGameSubject: Subject<CreatedGame> = new Subject()
  joinedGameSubject: Subject<string> = new Subject()
  disconnectedSubject: Subject<ClientId> = new Subject()
  gameUiFacade = {
    setState: (gameUiState) => {
      this._socket.emit('Game State Update', gameUiState)
    }
  }


  constructor(socket: Socket, id: ClientId, name: ClientName, gameLobbyUpdatesSubject: Subject<GameLobbyUpdate>){

    this._socket = socket
    this._id = id
    this._name = name
    this._socket.on('Action From Client', (actionFromClient: ClientAction) => this.handleActionFromClient(actionFromClient))
    //this._socket.on('Game Action From Client', this.gameActionFromClient.next)
    this._socket.on('disconnect', (reason) => this.handleDisconnectingClient(reason))
    gameLobbyUpdatesSubject.subscribe((gameLobbyUpdate: GameLobbyUpdate) => this.handleGameLobbyUpdates(gameLobbyUpdate))
    //this.sendInitialUiState()
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
      //case 'Cancel Game' : this.cancelGame(); break
      //case 'Start Game' : this.startGame(); break
      case 'Join Game' : this.joinGame(action.data.gameId); break
      case 'Ready To Start Game' : this.readyToStartGame(); break
      //case 'Leave Game' : this.leaveGame(); break 
    }
  }
  private createGame(){
    const createdGame: CreatedGame = {
      id: new Date().getTime().toString(),
      creator: {name: this._name, id: this._id, ready: false},
      joinedPlayers: [],
      gameChat: []
    }
    this.sendUIStateToClient()
    this.createdGameSubject.next(createdGame)
  }

  joinGame(gameId){
    this.joinedGameSubject.next(gameId)
  }

  joinGame(gameId){
    this.joinedGameSubject.next(gameId)
  }

  private handleDisconnectingClient(reason){
    console.log(`${this._name} disconnected due to ${reason}`);
    this.disconnectedSubject.next(this._id)
  }

  private handleGameLobbyUpdates(gameLobbyUpdate: GameLobbyUpdate){
    console.log('game lobby update: ', gameLobbyUpdate.name);
    switch(gameLobbyUpdate.name){
      case 'Connected Clients Update' : 
        this.clientUiState.gameLobby.connectedPlayers = gameLobbyUpdate.data; break;
      case 'Available Games Update' : 
        this.clientUiState.gameLobby.availableGames = gameLobbyUpdate.data
    }
    this.sendUIStateToClient()
  }

  sendUIStateToClient(){
    this._socket.emit('UI State Update', this.clientUiState)
  }

}