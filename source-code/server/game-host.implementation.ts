
import { ServerPreGameUIState } from "../client/front-end-state/front-end-state"
import { GameDisplay } from "../interfaces/game-display-interface"
import { Player } from "../interfaces/player-info.interface"
import { ConnectedClient, GameBeingCreated, GameHostState } from "./game-host"

export const GameHost_Implementation = (gameHostState: GameHostState) => {
  return {


    connectingClientIsValid(name, id){
      if(name == undefined)
        throw 'connecting client name undefined'
      if(id == undefined)
        throw 'connecting client id undefined'

      if(gameHostState.connectedClients?.some(
        (client: ConnectedClient) => client.id == id)){
        console.log('error: connecting player id already exists');
        return
      }
      return true
    },


    mapStateToUIState(): ServerPreGameUIState{
      return {
        ...gameHostState,        
        connectedClients: gameHostState.connectedClients.map(c => ({name: c.name, id: c.id})),
        activeGames: gameHostState.activeGames.map(g => g.getInfo())
      }
    },


    isCreateGameValid(client: ConnectedClient){
      if(gameHostState.gamesBeingCreated.some(g => g.creator.id == client.id)){
        throw 'shouldnt be able to create game if already in one'
      }
      return true
    },

    getGameBeingCreated: (gameId): GameBeingCreated =>{
      return gameHostState.gamesBeingCreated.find(g => g.id == gameId)
    },

    
    createGamePlayersArray(gameId): Player[]{

      const gameBeingCreated: GameBeingCreated = this.getGameBeingCreated(gameId)
      const players: Player[] = []

      let {creator, clients} = gameBeingCreated

      if(gameBeingCreated.creator.name != 'Game Display'){
        players.push({
          name: creator.name,
          id: creator.id,
          socket: gameHostState.connectedClients.find(c => c.id == creator.id).socket
        })
      }

      clients.forEach(gameClient => {
        if(gameClient.name != 'Game Display'){
          players.push({
            name: gameClient.name,
            id: gameClient.id,
            socket: gameHostState.connectedClients.find(c => c.id == gameClient.id).socket
          })
        }
      })

      return players

    },

    createGameDisplaysArray(gameId): GameDisplay[]{

      const gameBeingCreated: GameBeingCreated = this.getGameBeingCreated(gameId)
      const gameDisplay: GameDisplay[] = []

      let {creator, clients} = gameBeingCreated

      if(gameBeingCreated.creator.name == 'Game Display'){
        gameDisplay.push({
          name: creator.name,
          id: creator.id,
          socket: gameHostState.connectedClients.find(c => c.id == creator.id).socket
        })
      }

      clients.forEach(gameClient => {
        if(gameClient.name == 'Game Display'){
          gameDisplay.push({
            name: gameClient.name,
            id: gameClient.id,
            socket: gameHostState.connectedClients.find(c => c.id == gameClient.id).socket
          })
        }
      })

      return gameDisplay
    },

    disconnectClientFromAnyActiveGame(){

    },


  }
}
