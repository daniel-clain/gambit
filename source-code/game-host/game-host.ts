import { Game } from '../game-components/game';
import {GameHost_Implementation} from './game-host.implementation'
import { GameHostState, ConnectedClient, FromClientToHost, JoinedClient } from './game-host.types';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { randomNumber } from '../helper-functions/helper-functions';



export class GameHost{
  state = new GameHostState()
  private i: GameHost_Implementation

  constructor(webSocketServer: Server){
    webSocketServer.on("connection", (socket: Socket) => {
      console.log('A client connected to the websocket server');
      socket.on('connectToHost', ({name, id}) => {  
        if(this.i.connectingClientIsValid(name, id)){
          const connectedClient: ConnectedClient = {name, id, socket}
          this.state.connectedClients.push(connectedClient)
          console.log(`${name} has connected to the game host`)
          this.handleEventsFromClient(connectedClient)
          this.updateConnectedClients()
        }
      })
    })

    this.i = new GameHost_Implementation(this.state, this.updateConnectedClients)

  }


  updateConnectedClients = () => {
    try{
      this.state.connectedClients.forEach(c => 
        c.socket.emit(
          'To Client From Server - Lobby Ui', 
          this.i.mapStateToUIState()
        )
      )
    }catch(e){
      console.log('e :>> ', e);
    }
  }


  private handleEventsFromClient(client: ConnectedClient){
    const messagesFromClientToHost: FromClientToHost = {
      connectToHost(){},
      create: () => {
        if(this.i.isCreateGameValid(client)){
          this.state.gamesBeingCreated.push({
            id: randomNumber({digits: 6}).toString(),
            creator: new JoinedClient(
              client.name,
              client.id
            ),
            clients: []
          })        
          console.log(`${client.name} created a game lobby`)        
        }
      },      
      testConnection: () => {
        this.state.testConnection = new Date().getTime()
        this.updateConnectedClients()
      },
      cancel: gameId => {
        if(this.i.isCancelGameValid(client, gameId)){
          this.state.gamesBeingCreated = this.state.gamesBeingCreated.filter(g => g.id != gameId)
          console.log(`${client.name} has canceled his game lobby`);
        }
      },
      start: gameId => {
        let {gamesBeingCreated, activeGames} = this.state
        const players = this.i.createGamePlayersArray(gameId)
        const displays = this.i.createGameDisplaysArray(gameId)
  
        activeGames.push(new Game(players, 'Websockets', this, displays))
        
        console.log(`${client.name} has started his game lobby!`);
        this.state.gamesBeingCreated = gamesBeingCreated.filter(g => g.id != gameId)
      },
      join: gameId => {
        const gameBeingCreated = this.state.gamesBeingCreated
        .find(g => g.id == gameId)
        if(this.i.isJoinGameValid(client, gameBeingCreated)){     
          gameBeingCreated.clients.push(new JoinedClient(client.name, client.id))
          console.log(`${client.name} joined ${gameBeingCreated.creator.name}'s game`); 
        }
      },
      readyToStart: ({gameId, ready}) => {
        this.state.gamesBeingCreated.find(g => {
          if(g.id == gameId){
            if(g.creator.id == client.id){
              g.creator.ready = !g.creator.ready
            }
            g.clients.find(c => {
              if(c.id == client.id){
                c.ready = !c.ready
                return true
              }
              console.log(`${client.name} set his ready state to ${c.ready} for ${g.creator.name}'s game lobby`);    
            })
                  
            return true
          }
        })
      },
      leave: gameId => {
        this.state.gamesBeingCreated.find(g => {
          if(g.id == gameId){
            g.clients = g.clients.filter(c => c.id != client.id)
            console.log(`${client.name} has left ${g.creator.name}'s game lobby`);
          }
        })
      },
      reJoin: gameId => {
        const reconnectingGameFound = this.state.activeGames.find(g => {
            if(g.has.id == gameId){
              if(client.name == 'Game Display'){
                g.has.connectionManager.gameDisplayReconnected(client)
              }
              else{
                g.has.connectionManager.playerReconnected(client)
              }
              return true
            }
          })
        
        if(!reconnectingGameFound)  
          throw `${client.name} tried to reconnect to game ${gameId} but couldn't find it`
      
      },
      submitGlobalChat: message => {
        this.state.globalChat.push({player: client.name,  message})
      },
      reset: client => {        
        let {connectedClients} = this.state   

        console.log(`${client.name} has reset, removing ${client.name} from the connected clients list`);

        connectedClients.splice(
          connectedClients.findIndex(c => c.id == client.id), 1
        )
      },
      disconnect: reason => {
        let {connectedClients, gamesBeingCreated, activeGames} = this.state
        
        console.log(`${client.name} disconnected due to ${reason}, removing ${client.name} from the connected clients list`);
  
        connectedClients.splice(
          connectedClients.findIndex(c => c.id == client.id), 1
        )
  
        gamesBeingCreated.find(g => {
          if(g.creator.id == client.id) messagesFromClientToHost.cancel(g.id)        
          if(g.clients.some(c => c.id == client.id)) messagesFromClientToHost.leave(g.id)
        })
  
        try{
          this.i.gameHandlePlayerDisconnect(client)
        }catch(e){
          console.log('e :>> ', e);
        }
      },
    }

    
    Object.keys(messagesFromClientToHost)
    .forEach(functionName => 
      client.socket.on(functionName, data => {
        messagesFromClientToHost[functionName](data)
        this.updateConnectedClients()
      })
    )
    
      
  }

  tearDownGame = gameId => this.i.tearDownGame(gameId)

}
