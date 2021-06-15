
import { ServerPreGameUIState } from "../interfaces/front-end-state-interface"
import { GameDisplay } from "../interfaces/game-display-interface"
import { Player } from "../game-components/player"
import { GameHostState, ConnectedClient, GameBeingCreated, JoinedClient } from "./game-host.types"

export class GameHost_Implementation{

  constructor(private gameHostState: GameHostState, private updateConnectedClients){}

  connectingClientIsValid(name, id){
    if(name == undefined)
      throw 'connecting client name undefined'
    if(id == undefined)
      throw 'connecting client id undefined'

    if(this.gameHostState.connectedClients?.some(
      (client: ConnectedClient) => client.id == id)){
      console.log('error: connecting player id already exists');
      return
    }
    return true
  }


  mapStateToUIState(): ServerPreGameUIState{
    return {
      ...this.gameHostState,        
      connectedClients: this.gameHostState.connectedClients.map(c => ({name: c.name, id: c.id})),
      activeGames: this.gameHostState.activeGames.map(g => g.functions.getInfo())
    }
  }


  isCreateGameValid(client: ConnectedClient){
    if(this.gameHostState.gamesBeingCreated.some(g => g.creator.id == client.id)){
      throw 'shouldnt be able to create game if already in one'
    }
    return true
  }

  getGameBeingCreated(gameId): GameBeingCreated {
    return this.gameHostState.gamesBeingCreated.find(g => g.id == gameId)
  }

  
  createGamePlayersArray(gameId): ConnectedClient[]{

    const gameBeingCreated: GameBeingCreated = this.getGameBeingCreated(gameId)
    const players: ConnectedClient[] = []

    let {creator, clients} = gameBeingCreated

    if(gameBeingCreated.creator.name != 'Game Display'){
      players.push({...creator, socket: this.gameHostState.connectedClients.find(c => c.id == creator.id).socket})
    }

    clients.forEach(gameClient => {
      if(gameClient.name != 'Game Display'){
        players.push({
          name: gameClient.name,
          id: gameClient.id,
          socket: this.gameHostState.connectedClients.find(c => c.id == gameClient.id).socket
        })
      }
    })

    return players

  }

  createGameDisplaysArray(gameId): ConnectedClient[]{

    const gameBeingCreated: GameBeingCreated = this.getGameBeingCreated(gameId)
    const gameDisplay: ConnectedClient[] = []

    let {creator, clients} = gameBeingCreated

    if(gameBeingCreated.creator.name == 'Game Display'){
      gameDisplay.push({
        name: creator.name,
        id: creator.id,
        socket: this.gameHostState.connectedClients.find(c => c.id == creator.id).socket
      })
    }

    clients.forEach(gameClient => {
      if(gameClient.name == 'Game Display'){
        gameDisplay.push({
          name: gameClient.name,
          id: gameClient.id,
          socket: this.gameHostState.connectedClients.find(c => c.id == gameClient.id).socket
        })
      }
    })

    return gameDisplay
  }

  gameHandlePlayerDisconnect(client){
    this.gameHostState.activeGames.find(game => {
      const {players, gameDisplays, connectionManager} = game.has
      if(
        (players.some(p => p.id == client.id) || 
        gameDisplays.some(d => d.id == client.id))
        && !connectionManager.disconnectedPlayerVotes
        .find(d => d.disconnectedPlayer.id == client.id)
      ) {
        connectionManager.handleClientDisconnect({
          name: client.name,
          id: client.id
        })
        return true
      }

    })  
  }

  tearDownGame = (gameId) =>{
    const index = this.gameHostState.activeGames.findIndex(g => g.has.id == gameId)
    this.gameHostState.activeGames.splice(index, 1)
    this.updateConnectedClients()
  }

  isJoinGameValid(client: ConnectedClient, gameBeingCreated: GameBeingCreated): boolean{
    if(gameBeingCreated == undefined)
      throw `${client.name} tried to join a game that could not be found`

    if(gameBeingCreated.creator.id == client.id)
      throw `${client.name} trying to join a game that he created`        

    if(gameBeingCreated.clients.some((joinedClient: JoinedClient) => joinedClient.id == client.id))
      throw `${client.name} was trying to join a game that he is already in`

    return true
  }


  isCancelGameValid(client: ConnectedClient, gameId){
    const gameBeingCreated = this.gameHostState.gamesBeingCreated.find(g => g.id == gameId)
    if(!gameBeingCreated)
      throw `${client.name} tried to cancel game ${gameId} but it wasnt found in the list of games being created`
    
    if(gameBeingCreated.creator.id != client.id)
      throw `${client.name} tried to cancel game ${gameId} but he is not the creator of the game`


    return true
  }
}
