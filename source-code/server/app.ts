import {Socket} from 'socket.io';

import ServerWebsocketService from "./server-websocket.service";
import Player from "../interfaces/player";
import Game from "../classes/game/game";
import Manager from "../classes/game/manager/manager";
import IManagerOption from "../classes/game/manager/managerOptions/manager-option";
import PlayerAction from "../interfaces/player-action";
import defaultUiState from "./default-ui-state";
import { UIState } from '../client/main-game/main-game';


class GameLobby{

}
class ConnectedPlayer{
  private _uiState: UIState
  name: string
  constructor(private socket: Socket, private _id: string){
    this.socket.on('Action From Client', this.handleActionFromClient)
  }
  set uiState(uiState){
    this._uiState = uiState
    this.socket.emit('UI State Update', uiState)
  }
  get uiState(): UIState{
    return this._uiState
  }
  get id(): string{
    return this._id
  }
  private handleActionFromClient(actionFromClient){
    switch(actionFromClient.name){
      case ''
    }
  }

}

export default class GameHost{
  private connectedPlayers: ConnectedPlayer[] = []
  private activeGames: Game[] = []
  private gameLobby: GameLobby


  


  constructor(private websocketService: ServerWebsocketService){
    this.clientUIState = defaultUiState
    const {playerConnected, playerDisconnected, playerJoiningGame,
      actionFromPlayer,
      sendUIStateUpdate
    } = this.websocketService
    playerConnected.subscribe(this.handleConnectingPlayer)
    playerDisconnected.subscribe((clientId: string) => this.handlePlayerDisconnect(clientId))
    playerJoiningGame.subscribe((playerId: string) => this.handlePlayerJoiningGame(playerId))
    actionFromPlayer.subscribe((actionFromPlayer: PlayerAction) => this.handleActionFromPlayer(actionFromPlayer))
    
  }

  private handleConnectingPlayer(socket: Socket, id: string){
    if(this.connectedPlayers.some((player: ConnectedPlayer) => player.id == id)){
      console.log('error: connecting player id already exists');
      return
    }
    const player: ConnectedPlayer = new ConnectedPlayer(socket, id)
    this.connectedPlayers.push(player)
  }

  private addNewPlayer(player: Player){
    console.log('adding playerxx');    
    const foundPlayer: Player = this.connectedPlayers.find((connectedPlayer: Player) => connectedPlayer.id == player.id)    
    if(foundPlayer)
      throw 'added player should not already be in the players list'
    this.connectedPlayers.push(player)
    console.log(player.name + ' pushed to list of players');

    const newUIState: ClientUIState = {...this.clientUIState}
    newUIState.views.gameLobby.props.connected = true
    this.setUiState(player.id, newUIState)    
  }

  
  setUiState(playerId, state: ClientUIState){
    sendUIStateUpdate([playerId], state)
    console.log('ui state update sent');
  }



  private handlePlayerDisconnect(clientId: string){
    const foundDisconnectingPlayer: Player = this.connectedPlayers.find((player: Player) => player.id == clientId)
    if(foundDisconnectingPlayer == undefined)
      console.log('disconecting player is not in the player list')
    else{
      console.log(foundDisconnectingPlayer.name + ' has disconnected');
      this.connectedPlayers = this.connectedPlayers.filter((player: Player) => player.id != clientId)
    }
  }


  handlePlayerJoiningGame(playerId: string){
    console.log('action from client!');    
    this.activeGames.push(new Game('my game id', [playerId]))    
    const newUIState: ClientUIState = {...this.clientUIState}
    newUIState.views.gameLobby.props.isActive = false
    newUIState.views.managerOptions = {
      props: {
        isActive: true,
        money: 50000,
        actionPoints: 5
      }
    }
    this.setUiState(playerId, newUIState)          
  }



  handleActionFromPlayer(action: PlayerAction){
    let managerOption: IManagerOption
    console.log('action from client!', this.activeGames.length);
    for(let i = 0; this.activeGames.length; i++){
      const foundPlayersManager: Manager = this.activeGames[i].managers.find((manager: Manager) => manager.playerId == action.playerId)
      if(foundPlayersManager){
        managerOption = foundPlayersManager.options.find((option: IManagerOption) => option.name == action.name)
        break;
      }
    }
    const playerName = this.connectedPlayers.find(player => player.id = action.playerId).name
    console.log(playerName + 'is executing manager option ' + managerOption.name);
    managerOption.execute(...action.arguments)
    
  }
}

