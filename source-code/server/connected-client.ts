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
import Game from '../game-components/game';
import { GameInfo } from '../interfaces/game/game-info';

export type GameHostUpdateNames = 'Connected Clients Update' | 'Games Lobbies Update'


export default class ConnectedClient{


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
      case 'Re-Join Game' : this.rejoinGame(data.gameId); break
      case 'Leave Game' : this.leaveGame(data.gameId); break 
      case 'Submit Global Chat' : this.submitGlobalMessage(data.message); break 
    }
  }


  private rejoinGame(gameId){
    this.gameHost.playerRejoinGame(gameId, {name: this.name, id: this.id}, this.socket)
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


  sendMainGameDataToClient(gameHostUiState: MainGameData){
    this.socket.emit('Main Game Data Update', gameHostUiState)
  }


  getPlayerInfo(): PlayerInfo{
    return {
      socket: this.socket,
      name: this.name,
      id: this.id
    }
  }


}