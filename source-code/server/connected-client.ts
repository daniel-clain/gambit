import {PlayerInfo} from './../interfaces/player-info.interface';
import { Socket } from 'socket.io';
import ClientName from '../types/client-name.type';
import ClientId from '../types/client-id.type';
import { MainGameData } from '../interfaces/game-ui-state.interface';
import ClientAction from '../interfaces/client-action';
import GameHost from './game-host';
import GameLobbyClient from '../interfaces/game-lobby-client.interface';
import GameLobby from '../interfaces/game-lobby.interface';
import ChatMessage from '../interfaces/chat-message.interface';
import ClientNameAndId from '../interfaces/client-name-and-id.interface';

export type GameHostUpdateNames = 'Connected Clients Update' | 'Games Lobbies Update'


export default class ConnectedClient{
  private gameHostUiState: MainGameData = {
    inGame: false,
    connectedPlayers: [],
    gameLobbies: [],
    globalChat: []
  }


  constructor(private socket: Socket, private _id: ClientId, private _name: ClientName, private gameHost: GameHost){
    this.socket.on('Action From Client', (actionFromClient: ClientAction) => this.handleActionFromClient(actionFromClient))
    this.socket.on('disconnect', (reason) => gameHost.clientDisconnected(this, reason))
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
      case 'Cancel Game' : this.cancelGame(action.args.gameId); break
      case 'Start Game' : this.startGame(action.args.gameId); break
      case 'Join Game' : this.joinGame(action.args.gameId); break
      case 'Ready To Start Game' : this.readyToStartGameToggled(action.args.gameId, action.args.readyValue); break
      case 'Leave Game' : this.leaveGame(action.args.gameId); break 
      case 'Submit Global Chat' : this.submitGlobalMessage(action.args.message); break 
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


  private sendMainGameDataToClient(){
    this.socket.emit('Main Game Data Update', this.gameHostUiState)
  }

  gameHostUiUpdate(connectedClients: ClientNameAndId[], gameLobbies: GameLobby[], globalChat: ChatMessage[]){
    this.gameHostUiState.connectedPlayers = connectedClients  
    this.gameHostUiState.gameLobbies = gameLobbies  
    this.gameHostUiState.globalChat = globalChat    
    this.sendMainGameDataToClient()
  }

  getPlayerInfo(): PlayerInfo{
    return {
      socket: this.socket,
      name: this.name,
      id: this.id
    }
  }
  gameStarted(){
    this.gameHostUiState.inGame = true     
    this.sendMainGameDataToClient()
  }

  gameFinished(){
    this.gameHostUiState.inGame = false    
    this.sendMainGameDataToClient()
  }

}