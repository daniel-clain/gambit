
import * as socketio from 'socket.io'
import Player from '../interfaces/player';
import { Server, Socket } from 'socket.io';
import { Subject } from 'rxjs';
import ActionFromClient from '../interfaces/player-action';
import IWebsocketService from '../interfaces/websocket-service.interface';
import ActionFromPlayer from '../interfaces/player-action';
import PlayerAction from '../interfaces/player-action';
import { ClientAction } from '../interfaces/client-action';
import { ClientUIState } from '../client/client';
import { PreGameState } from '../client/pre-game';

export interface Action extends Function{}
const action: Action = () => (console.log('action'))

interface ConnectedClient{
  socket: Socket
  id?: string
}

export default class ServerWebsocketService implements IWebsocketService{
  port = 33
  websocketServer: Server

  connectedClients: ConnectedClient[] = []

  playerConnected: Subject<Player> = new Subject()
  actionFromPlayer: Subject<PlayerAction> = new Subject()
  playerJoiningGame: Subject<string> = new Subject()
  playerDisconnected: Subject<string> = new Subject()

  constructor(){
    this.setUpWebsockets()
  }

  private setUpWebsockets(){
    this.websocketServer = socketio.listen(this.port)
    this.websocketServer.on("connection", (socket: Socket) => { 
      this.addConnectedClient(socket)
      socket.on('Action From Client', (actionFromClient: ClientAction) => this.handleActionFromClient(socket, actionFromClient)) 
      socket.on('Action From Player', (actionFromPlayer: PlayerAction) => this.handleActionFromPlayer(actionFromPlayer)) 
      socket.on('disconnect', (reason) => this.handleDisconnectingClient(socket, reason))
    });
  }

  private addConnectedClient(socket: Socket){    
    if(this.connectedClients.some((connectedClient: ConnectedClient) => connectedClient.socket.id == socket.id))
      throw 'trying to push client with existing socket id'
    console.log('pushing client connection');
    this.connectedClients.push({socket: socket})
  }

  private handleConnectingPlayer(socket: Socket, player: Player){
    console.log('connecting player ', player);
    const foundConnectedClient: ConnectedClient = this.connectedClients.find((connectedClient: ConnectedClient) => connectedClient.socket.id == socket.id)
    
    if(foundConnectedClient == undefined)
      throw 'connecting client should have an existing connectedClient record'
    if(foundConnectedClient.id != null)
      throw 'connecting client should not already have its id set'

    foundConnectedClient.id = player.id

    this.playerConnected.next(player)
    
  }

  private handleDisconnectingClient(socket: Socket, reason){
    const disconnectingClient: ConnectedClient = this.connectedClients.find((connectedClient: ConnectedClient) => connectedClient.socket.id == socket.id)
    if(!!disconnectingClient == false){
      console.log('trying to disconect client that is not in the list');
      return
    }
    this.playerDisconnected.next(disconnectingClient.id)
    this.connectedClients = this.connectedClients.filter((connectedClient: ConnectedClient) => connectedClient.id != disconnectingClient.id)


  }
  
  private handleActionFromClient(socket, actionFromClient: ClientAction){
    console.log('action from client: ', actionFromClient);

    if(actionFromClient.name == 'Connect'){
      const player: Player = {...actionFromClient.arguments, id: actionFromClient.playerId}
      
      this.handleConnectingPlayer(socket, player)
    }

    if(actionFromClient.name == 'Join Game'){
      const {playerId} = actionFromClient
      this.playerJoiningGame.next(playerId)
      
    }
  }

  private handleActionFromPlayer(actionFromPlayer: ActionFromPlayer){
    console.log('action from player: ', actionFromPlayer);
    this.actionFromPlayer.next(actionFromPlayer)
  }

  sendPreGameStateUpdate(clientId: string, preGameState: PreGameState){
    const clientsSocket: Socket = this.getSocketClientById(clientId)
    clientsSocket.emit('PreGame State Update', preGameState) 
  }


  sendGameStateUpdate(clientId: string, gameStateUpdate: ClientUIState){  
    const clientsSocket: Socket = this.getSocketClientById(clientId)
    clientsSocket.emit('Game State Update', gameStateUpdate) 
  }

  private getSocketClientById(clientId: string): Socket{
    return this.connectedClients.find(
      (connectedClient: ConnectedClient) => clientId == connectedClient.id
    ).socket

  }

  

}