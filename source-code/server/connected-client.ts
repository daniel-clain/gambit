import {Player} from './../interfaces/player-info.interface';
import { Socket } from 'socket.io';
import GameHost from './game-host';
import GameLobbyClient from '../interfaces/game-candidate-client.interface';
import { ClientPregameAction } from '../types/client-pre-game-actions';
import GameCandidate from '../interfaces/game-candidate.interface';
import { LobbyUiState } from '../client/front-end-state/front-end-state';

export type GameHostUpdateNames = 'Connected Clients Update' | 'Games Lobbies Update'


export default class ConnectedClient{


  constructor(public id, public name, private socketObject: Socket, private gameHost: GameHost){

    this.socketObject.on('To Server From Client', (clientPregameAction: ClientPregameAction) => this.handleActionFromClient(clientPregameAction))

    this.socketObject.on('disconnect', (reason) => gameHost.clientDisconnected(this, reason))
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
    this.gameHost.playerRejoinGame(gameId, {name: this.name, id: this.id}, this.socketObject)
  }

  private createGame(){

    const gameLobbyClient: GameLobbyClient = {
      name: this.name,
      id: this.id,
      ready: false
    }

    const createdGame: GameCandidate = {
      id: new Date().getTime().toString(),
      creator: gameLobbyClient,
      clients: [gameLobbyClient],
      gameChat: []
    }
    this.gameHost.clientCreatedGameCandidate(createdGame)
  }

  private joinGame(gameId){
    this.gameHost.clientJoinedGameCandidate(this, gameId)
  }

  private cancelGame(gameId){
    this.gameHost.clientCanceledGameCandidate(gameId)
  }

  private leaveGame(gameId){
    this.gameHost.clientLeftGameCandidate(this, gameId)
  }

  private readyToStartGameToggled(gameId, readyValue){
    this.gameHost.clientToggledReadyInGameCandidate(this, gameId, readyValue)
  }

  private startGame(gameId){
    this.gameHost.clientStartedGameCandidate(gameId)
  }

  private submitGlobalMessage(message: string){
    this.gameHost.clientSubmittedGlobalMessage(this, message)
  }


  sendLobbyUiStateToClient(lobbyUiState: LobbyUiState){


    this.socketObject.emit('To Client From Server - Lobby Ui', lobbyUiState)
  }


  getPlayerInfo(): Player{
    return {
      socketObj: this.socketObject,
      name: this.name,
      id: this.id
    }
  }
  


}