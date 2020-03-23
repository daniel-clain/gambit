import {PlayerInfo} from './../interfaces/player-info.interface';
import { Socket } from 'socket.io';
import { MainGameData } from '../interfaces/game-ui-state.interface';
import ClientAction from '../interfaces/client-action';
import GameHost from './game-host';
import GameLobbyClient from '../interfaces/game-lobby-client.interface';
import GameLobby from '../interfaces/game-lobby.interface';
import ChatMessage from '../interfaces/chat-message.interface';
import ClientNameAndId from '../interfaces/client-name-and-id.interface';
import { ClientPregameAction } from '../types/client-pre-game-actions';

export type GameHostUpdateNames = 'Connected Clients Update' | 'Games Lobbies Update'


export default class ConnectedClient{
  private gameHostUiState: MainGameData = {
    inGame: false,
    connectedPlayers: [],
    gameLobbies: [],
    globalChat: []
  }


  constructor(public id, public name, private socket: Socket, private gameHost: GameHost){

    this.socket.on('Action From Client', (clientPregameAction: ClientPregameAction) => this.handleActionFromClient(clientPregameAction))

    this.socket.on('disconnect', (reason) => gameHost.clientDisconnected(this, reason))
  }




  private handleActionFromClient(clientPregameAction: ClientPregameAction){
    const {name, data} = clientPregameAction
    switch(name){
      case 'Create Game' : this.createGame(); break
      case 'Cancel Game' : this.cancelGame(data.gameId); break
      case 'Start Game' : this.startGame(data.gameId); break
      case 'Join Game' : this.joinGame(data.gameId); break
      case 'Ready To Start Game' : this.readyToStartGameToggled(data.gameId,data.readyValue); break
      case 'Leave Game' : this.leaveGame(data.gameId); break 
      case 'Submit Global Chat' : this.submitGlobalMessage(data.message); break 
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