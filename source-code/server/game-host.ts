
import ChatMessage from '../interfaces/chat-message.interface';

import { Socket } from 'socket.io';

import {GameHost_Implementation} from './game-host.implementation'
import { ClientPregameAction } from '../types/client-pre-game-actions';
import {UtilityFunctions as u} from '../utility-functions'
import Game from '../game-components/game';
import { Player } from '../interfaces/player-info.interface';
import { GameDisplay } from '../interfaces/game-display-interface';

export class ClientNameAndID{
  name: string
  id: string
}

export class ConnectedClient implements ClientNameAndID {
  constructor(    
    public name: string,
    public id: string,
    public socket: Socket
  ){}  
}

class JoinedClient implements ClientNameAndID {  
  ready: boolean = false
  constructor(    
    public name: string,
    public id: string
  ){} 
}

const x: JoinedClient = {
  name: 'bob',
  id: '123',
  ready: true
}

export type GameBeingCreated = {
  id: string
  creator: JoinedClient
  clients: JoinedClient[]
}

export class GameHostState {
  connectedClients: ConnectedClient[] = []
  gamesBeingCreated: GameBeingCreated[] = []
  globalChat: ChatMessage[] = []
  activeGames: Game[] = []
}

const gameHostState = new GameHostState()


const i = GameHost_Implementation(gameHostState)

const gameHostPrivate = {

  updateConnectedClients(){
    gameHostState.connectedClients.forEach(c => 
      c.socket.emit(
        'To Client From Server - Lobby Ui', 
        i.mapStateToUIState()
      )
    )
  },

  
  handleEventsFromClient(client: ConnectedClient){


    client.socket.on('disconnect', reason => {
      let {connectedClients, gamesBeingCreated, activeGames} = gameHostState
      
      console.log(`${client.name} disconnected due to ${reason}, removing ${client.name} from the connected clients list`);

      connectedClients.splice(
        connectedClients.findIndex(c => c.id == client.id), 1
      )

      gamesBeingCreated.forEach(g => {
        if(g.creator.id == client.id) cancelGame(g.id)        
        if(g.clients.some(c => c.id == client.id)) leaveGame(g.id)
      })

      activeGames.forEach(g => {
        if(
          g.players.some(p => p.id == client.id) || 
          g.displays.some(d => d.id == client.id)
        ) g.connectionManager.clientDisconnected(client)

      })

      this.updateConnectedClients()

    })



    client.socket.on('To Server From Client', ({name, data}: ClientPregameAction) => {
      switch(name){

        case 'Create Game': createGame()
        break
        case 'Cancel Game': cancelGame(data.gameId)
        break
        case 'Start Game': startGame(data.gameId)
        break
        case 'Join Game': joinGame(data.gameId)
        break
        case 'Ready To Start Game': readyToStartGameToggled(data.gameId,data.readyValue)
        break
        case 'Re-Join Game': rejoinGame(data.gameId)
        break
        case 'Leave Game': leaveGame(data.gameId)
        break
        case 'Submit Global Chat': submitGlobalMessage(data.message)
        break
      }
      this.updateConnectedClients()


    })

    

      
    function createGame(){
      if(i.isCreateGameValid(client)){
        gameHostState.gamesBeingCreated.push({
          id: u.randomNumber({digits: 6}),
          creator: new JoinedClient(
            client.name,
            client.id
          ),
          clients: []
        })
      }
    }
    function cancelGame(gameId){
      gameHostState.gamesBeingCreated = gameHostState.gamesBeingCreated.filter(g => g.id != gameId)

    }


    function startGame(gameId){
      let {gamesBeingCreated, activeGames} = gameHostState
      const players = i.createGamePlayersArray(gameId)
      const displays = i.createGameDisplaysArray(gameId)

      activeGames.push(new Game(players, 'Websockets', displays))
      gameHostState.gamesBeingCreated = gamesBeingCreated.filter(g => g.id != gameId)
    }


    function joinGame(gameId){
      gameHostState.gamesBeingCreated
      .find(g => g.id == gameId).clients
      .push(new JoinedClient(client.name, client.id))
    }


    function readyToStartGameToggled(gameId, readyValue){      
      gameHostState.gamesBeingCreated.find(g => {
        if(g.id == gameId){
          if(g.creator.id == client.id){
            g.creator.ready = !g.creator.ready
          }
          g.clients.find(c => {
            if(c.id == client.id){
              c.ready = !c.ready
              return true
            }
          })          
          return true
        }
      })
    }


    function rejoinGame(gameId){}
    function leaveGame(gameId){
      gameHostState.gamesBeingCreated.find(g => {
        if(g.id == gameId){
          g.clients = g.clients.filter(c => c.id != client.id)
        }
      })
    }
    function submitGlobalMessage(message){
      gameHostState.globalChat.push(message)
    }
  },
}

const gameHostPublic = {
  handleConnectingClient: (
    name, id, socket
  ) => {
    if(i.connectingClientIsValid(name, id)){

      const connectedClient: ConnectedClient = {name, id, socket}
      gameHostState.connectedClients.push(connectedClient)
      
      console.log(`${name} has connected to the game host`)

      gameHostPrivate.updateConnectedClients()

      gameHostPrivate.handleEventsFromClient(connectedClient)


    }
  }
}

export const GameHost = gameHostPublic









  clientDisconnected(disconnectingClient: ConnectedClient, reason){
      console.log(`${disconnectingClient.name} disconnected due to ${reason}, removing ${disconnectingClient.name} from the connected players list`);
      const clientIndex = this.connectedClients.findIndex((client: ConnectedClient) => client.id == disconnectingClient.id)
      this.connectedClients.splice(clientIndex, 1)

      this.cancelAnyGamesCreatedByClient(disconnectingClient)
      this.leaveAnyGameCandidateClientIsIn(disconnectingClient)
      this.disconnectFromGameClientIsIn(disconnectingClient)

      this.sendGameHostUiUpdateToClients()
  }

/*
  clientCreatedGameCandidate(createdGameCandidate: GameBeingCreated){    
    const isCreatorInGame = this.gameCandidates.some((GameBeingCreated: GameBeingCreated) => 
    GameBeingCreated.clients.some(client => client.id == createdGameCandidate.creator.id))

    if(isCreatorInGame)
      throw 'shouldnt be able to create game if already in one'

    this.gameCandidates.push(createdGameCandidate)
    console.log(`${createdGameCandidate.creator.name} created a game lobby`);
    this.sendGameHostUiUpdateToClients()
  }

  clientJoinedGameCandidate(joiningClient: ConnectedClient, GameCandidateId){
    const GameBeingCreated: GameBeingCreated = this.gameCandidates.find(GameBeingCreated => GameBeingCreated.id == GameCandidateId)
    if(GameBeingCreated == undefined)
      throw `${joiningClient.name} tried to join a game that could not be found`

    if(GameBeingCreated.creator.id == joiningClient.id)
      throw `${joiningClient.name} trying to join a game that he created`


    if(GameBeingCreated.clients.some((clientInLobby: GameCandidateClient) => clientInLobby.id == joiningClient.id))
      throw `${joiningClient.name} was trying to join a game that he is already in`
    
    const joiningClientInfo: GameCandidateClient = {
      name: joiningClient.name,
      id: joiningClient.id,
      ready: false
    }
    GameBeingCreated.clients.push(joiningClientInfo)

    console.log(`${joiningClient.name} joined ${GameBeingCreated.creator.name}'s game`);
    this.sendGameHostUiUpdateToClients()
  }

  clientLeftGameCandidate(leavingClient: ConnectedClient, GameCandidateId){    
    const GameBeingCreated = this.gameCandidates.find((GameBeingCreated: GameBeingCreated) => GameBeingCreated.id == GameCandidateId)
    const leavingClientIndex = GameBeingCreated.clients.findIndex(
      (GameCandidateClient: GameCandidateClient) => GameCandidateClient.id == leavingClient.id
    )
    GameBeingCreated.clients.splice(leavingClientIndex, 1)

    console.log(`${leavingClient.name} has left ${GameBeingCreated.creator.name}'s game lobby`);
    this.sendGameHostUiUpdateToClients()
  }


  clientCanceledGameCandidate(GameCandidateId){    

    const GameBeingCreated: GameBeingCreated = this.gameCandidates.find((GameBeingCreated: GameBeingCreated) => GameBeingCreated.id == GameCandidateId)

    const canceldGameCandidateIndex = this.gameCandidates.findIndex((GameBeingCreated: GameBeingCreated) => GameBeingCreated.id == GameCandidateId)

    if(canceldGameCandidateIndex == -1)
      throw `canceled game lobby could not be found in gameCandidates array`

    console.log(`${GameBeingCreated.creator.name} has canceled his game lobby`);

    this.gameCandidates.splice(canceldGameCandidateIndex, 1)

    this.sendGameHostUiUpdateToClients()
  }

  clientToggledReadyInGameCandidate(togglingClient: ConnectedClient, GameCandidateId, readyValue: boolean){  

    const GameBeingCreated: GameBeingCreated = this.gameCandidates.find((GameBeingCreated: GameBeingCreated) => GameBeingCreated.id == GameCandidateId)

    const clientIndex = GameBeingCreated.clients.findIndex((client: GameCandidateClient) => 
      client.id == togglingClient.id)

    GameBeingCreated.clients[clientIndex].ready = readyValue
    
    console.log(`${togglingClient.name} set his ready state to ${readyValue} for ${GameBeingCreated.creator.name}'s game lobby`);
    this.sendGameHostUiUpdateToClients()
  }

  

  clientStartedGameCandidate(GameCandidateId){  
    const startedGameCandidate: GameBeingCreated = this.gameCandidates.find((GameBeingCreated: GameBeingCreated) => GameBeingCreated.id == GameCandidateId)
    const gameClients: ConnectedClient[] = startedGameCandidate.clients.map(client => this.getClientById(client.id))
      
    const playerInfos: Player[] = gameClients.map(client => client.getPlayerInfo())
    console.log(`${startedGameCandidate.creator.name} has started his game lobby!`);
    const newGame: Game = createGame({gameType: 'Websockets', players: playerInfos, gameDisplays: []})
    console.log('pushing new game', newGame)

    this.activeGames.push(newGame)
    this.removeGameCandidate(startedGameCandidate)
    this.sendGameHostUiUpdateToClients()
  }

  private getClientById(id: string): ConnectedClient{
    return this.connectedClients.find(
      (client: ConnectedClient) => client.id == id
    )
  }


  private removeGameCandidate(removedGameCandidate: GameBeingCreated){
    const startedGameCandidateIndex = this.gameCandidates.findIndex((GameBeingCreated: GameBeingCreated) => GameBeingCreated.id == removedGameCandidate.id)
    this.gameCandidates.splice(startedGameCandidateIndex, 1)
  }

  clientSubmittedGlobalMessage(client: ConnectedClient, message: string){
    const chatMessage: ChatMessage = {
      player: {name: client.name, id: client.id},
      message
    }
    this.globalChat.unshift(chatMessage)
    this.sendGameHostUiUpdateToClients()
  }


  private cancelAnyGamesCreatedByClient(client: ConnectedClient){
    const GameCandidateCreatedByClient: GameBeingCreated = this.gameCandidates.find(
      (GameBeingCreated: GameBeingCreated) => GameBeingCreated.creator.id == client.id
    )
    if(GameCandidateCreatedByClient !== undefined)
      this.clientCanceledGameCandidate(GameCandidateCreatedByClient.id)
    
    this.sendGameHostUiUpdateToClients()
  }

  private leaveAnyGameCandidateClientIsIn(client: ConnectedClient){
    const GameCandidateClientIsIn: GameBeingCreated = this.gameCandidates.find(
      (GameBeingCreated: GameBeingCreated) => GameBeingCreated.clients.some((GameCandidateClient: GameCandidateClient) => GameCandidateClient.id == client.id)
    )
    if(GameCandidateClientIsIn != undefined)
      this.clientLeftGameCandidate(client, GameCandidateClientIsIn.id)

    this.sendGameHostUiUpdateToClients()
  }

  private disconnectFromGameClientIsIn(client: ConnectedClient){
    const gameClientIsIn: Game = this.activeGames.find(
      game => game.players.some(player => player.id == client.id)
    )
    if(gameClientIsIn != undefined)
      gameClientIsIn.connectionManager.playerDisconnected({id: client.id, name: client.name})

    this.sendGameHostUiUpdateToClients()
  }

  playerRejoinGame(gameId, player: PlayerNameAndId, socket: Socket){
    const game: Game = this.activeGames.find(game => game.id == gameId)
    game.connectionManager.playerReconnected(player, socket)
    this.sendGameHostUiUpdateToClients()
  }


  private sendGameHostUiUpdateToClients(){    

    const lobbyUiState: LobbyUiState = {
      gameCandidates: this.gameCandidates,
      globalChat: this.globalChat,
      activeGames: this.activeGames.map(g => g.getInfo()),
      connectedPlayers: this.connectedClients.map((c => ({id: c.id, name: c.name})))
    }

    this.connectedClients.forEach(client => {
      client.sendLobbyUiStateToClient(lobbyUiState)
    })
  }


}

*/