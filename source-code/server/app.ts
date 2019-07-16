
import ServerWebsocketService, { Action } from "./server-websocket.service";
import Player from "../interfaces/player";
import Game from "../classes/game/game";
import Manager from "../classes/game/manager/manager";
import IManagerOption from "../classes/game/manager/managerOptions/manager-option";
import PlayerAction from "../interfaces/player-action";
import { ClientAction } from "../interfaces/client-action";
import { ClientUIState } from "../client/client";

export default class App{

  websocketService = new ServerWebsocketService()
  connectedPlayers: Player[] = []
  activeGames: Game[] = []

  constructor(){
    this.websocketService.playerConnected.subscribe((player: Player) => this.addNewPlayer(player))
    this.websocketService.playerDisconnected.subscribe((clientId: string) => this.handlePlayerDisconnect(clientId))
    this.websocketService.playerJoiningGame.subscribe((playerId: string) => this.handlePlayerJoiningGame(playerId))
    this.websocketService.actionFromPlayer.subscribe((actionFromPlayer: PlayerAction) => this.handleActionFromPlayer(actionFromPlayer))
  }

  private addNewPlayer(player: Player){
    console.log('adding player');    
    const foundPlayer: Player = this.connectedPlayers.find((connectedPlayer: Player) => connectedPlayer.id == player.id)    
    if(foundPlayer)
      throw 'added player should not already be in the players list'
    this.connectedPlayers.push(player)
    console.log(player.name + ' pushed to list of players');

    const state: ClientUIState = {
      views: {
        gameLobby: {
          props: {
            isActive: true,
            connected: true
          }
        },
        managerOptions: null,
        fightEvent: null
      }
    }
    this.websocketService.sendUIStateUpdate([player.id], state)
  }

  private handlePlayerDisconnect(clientId: string){
    console.log('disconnecting player');
    const foundDisconnectingPlayer: Player = this.connectedPlayers.find((player: Player) => player.id == clientId)
    if(foundDisconnectingPlayer == undefined)
      console.log('disconecting player is not in the player list')
    else{
      console.log(foundDisconnectingPlayer.name + ' has disconnected');
      this.connectedPlayers = this.connectedPlayers.filter((player: Player) => player.id == clientId)
    }

  }

  handlePlayerJoiningGame(id: string){
    console.log('action from client!');
    
    this.activeGames.push(new Game('my game id', [id]))
    
    const state: ClientUIState = {
      views: {
        gameLobby: {
          props: {
            isActive: false,
            connected: true
          }
        },
        managerOptions: {
          props: {
            isActive: true,
            money: 50000,
            actionPoints: 5
          }
        },
        fightEvent: null
      }
    }
    this.websocketService.sendUIStateUpdate([id], state)
      
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

