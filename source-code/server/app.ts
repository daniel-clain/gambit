
import ServerWebsocketService, { Action } from "./server-websocket.service";
import Player from "../interfaces/player";
import Game from "../classes/game/game";
import Manager from "../classes/game/manager/manager";
import IManagerOption from "../classes/game/manager/managerOptions/manager-option";
import PlayerAction from "../interfaces/player-action";
import { ClientAction } from "../interfaces/client-action";
import { ClientUIState } from "../client/client";
import defaultUiState from "./default-ui-state";
import { Subject } from "rxjs";
import UIUpdateEvent from "./ui-update-event";

export default class App{
  connectedPlayers: Player[] = []
  activeGames: Game[] = []
  clientUIState: ClientUIState
  uiUpdateSubjects: Subject<UIUpdateEvent>[] = []
  


  constructor(private websocketService: ServerWebsocketService){
    this.clientUIState = defaultUiState
    const {playerConnected, playerDisconnected, playerJoiningGame,
      actionFromPlayer,
      sendUIStateUpdate
    } = this.websocketService
    playerConnected.subscribe((player: Player) => this.addNewPlayer(player))
    playerDisconnected.subscribe((clientId: string) => this.handlePlayerDisconnect(clientId))
    playerJoiningGame.subscribe((playerId: string) => this.handlePlayerJoiningGame(playerId))
    actionFromPlayer.subscribe((actionFromPlayer: PlayerAction) => this.handleActionFromPlayer(actionFromPlayer))
    
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

