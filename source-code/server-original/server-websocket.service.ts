import {Socket} from 'socket.io';
import {Server} from 'socket.io';
import * as socketio from 'socket.io'
import Player from '../interfaces/player';
import { ClientToServer } from '../interfaces/client-to-server.interface';
import { ServerToClient } from '../interfaces/server-to-client.interface';
import ServerPlayer from '../interfaces/server-player';

export default class ServerWebsocketService {
  websocketServer: Server
  connectedPlayers: ServerPlayer[] = []
  constructor(port: number){
    this.websocketServer = socketio.listen(port)
    this.websocketServer.on("connection", (socket: Socket) => {
      console.log('connection');
      socket.on('client to server', 
        (clientToServer) => this.event(clientToServer, socket)) 
      socket.on('disconnect', (reason) => {
        console.log('reason :', reason);
        const disconnectingPlayer = this.connectedPlayers.find((player: ServerPlayer) => 
        player.socket.id == socket.id)
        if(disconnectingPlayer){
          this.removePlayer(disconnectingPlayer)
        } else {
          console.log('now that does not make sense');
        }

      });
    });
    
  }

  event(clientToServer: ClientToServer, socket: Socket){
    switch(clientToServer.name){
      case 'connect' : {
        this.handleConnect(clientToServer, socket)
      }
    }
  }

  private removePlayer(disconnectingPlayer: ServerPlayer){
    this.connectedPlayers = this.connectedPlayers.filter(
      (connectedPlayer: ServerPlayer) => connectedPlayer.socket.id != disconnectingPlayer.socket.id)
    this.broadcastUpdatedConnectedPlayers()
  }


  private handleConnect(clientToServer: ClientToServer, socket: Socket){
    console.log('its bout time client connected to server');
    let player: ServerPlayer
    let clientPlayer: Player = clientToServer.data
    let foundPlayer: ServerPlayer = this.connectedPlayers.find(player => player.name == clientPlayer.name)
    if(foundPlayer){
      foundPlayer = {...foundPlayer, name: clientPlayer.name, socket:  socket, connected: true}
      player = foundPlayer
    }
    else {
      const newPlayer: ServerPlayer = { 
        name: clientPlayer.name, 
        socket:  socket, 
        connected: true, 
        clientId: clientToServer.clientId, 
        gameId: null
      }
      this.connectedPlayers.push(newPlayer)
      player = newPlayer
    }


    this.sendToClient(player, {name: 'player connected', transactionId: clientToServer.transactionId})
    this.broadcastUpdatedConnectedPlayers()
  }

  private sendToClient(player: ServerPlayer, serverToClient: ServerToClient): void {   
    player.socket.emit('server to client', serverToClient)
  }

  broadcastUpdatedConnectedPlayers(){
    const updateForAllClients: ServerToClient = {
      name: 'connected players update', 
      data: [...this.connectedPlayers].map(this.convertToClientPlayer)
    }
    this.updateAllClients(updateForAllClients)
  }

  updateAllClients(serverToClient: ServerToClient){
    this.connectedPlayers.forEach((player: ServerPlayer) => {
      player.socket.emit('server to client', serverToClient)
    })
  }

  convertToClientPlayer(serverPlayer: ServerPlayer): Player{
    const player: Player = {
      name: serverPlayer.name,
      connected: serverPlayer.connected,
      clientId: serverPlayer.clientId,
      gameId: serverPlayer.gameId
    }
    return player
  }
  

  
}