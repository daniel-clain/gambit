
import ConnectedClient from './connected-client';
import GameCandidateClient from '../interfaces/game-candidate-client.interface';
import ClientNameAndId from '../interfaces/client-name-and-id.interface';
import ChatMessage from '../interfaces/chat-message.interface';
import { Player } from '../interfaces/player-info.interface';
import Game, { createGame } from "../game-components/game";
import { Socket } from 'socket.io';

import PlayerNameAndId from '../interfaces/player-name-and-id';
import { LobbyUiState } from '../client/front-end-state/front-end-state';
import GameCandidate from '../interfaces/game-candidate.interface';
import { GameInfo } from '../interfaces/game/game-info';



export default class GameHost{

  
  connectedClients: ConnectedClient[] = []
  gameCandidates: GameCandidate[] = []
  globalChat: ChatMessage[] = []
  activeGames: Game[] = []


  handleConnectingClient(clientNameAndId: ClientNameAndId, socket: Socket){
    const {name, id} = clientNameAndId
    if(name == undefined)
      throw 'connecting client name undefined'
    if(id == undefined)
      throw 'connecting client id undefined'

    if(this.connectedClients?.some(
      (client: ConnectedClient) => client.id == id)){
      console.log('error: connecting player id already exists');
      return
    }
    const connectingClient: ConnectedClient = new ConnectedClient(id, name, socket, this)

    this.connectedClients.push(connectingClient)
    console.log(`${connectingClient.name} has connected to the game host`);

    this.sendGameHostUiUpdateToClients()   
  }

  clientDisconnected(disconnectingClient: ConnectedClient, reason){
      console.log(`${disconnectingClient.name} disconnected due to ${reason}, removing ${disconnectingClient.name} from the connected players list`);
      const clientIndex = this.connectedClients.findIndex((client: ConnectedClient) => client.id == disconnectingClient.id)
      this.connectedClients.splice(clientIndex, 1)

      this.cancelAnyGamesCreatedByClient(disconnectingClient)
      this.leaveAnyGameCandidateClientIsIn(disconnectingClient)
      this.disconnectFromGameClientIsIn(disconnectingClient)

      this.sendGameHostUiUpdateToClients()
  }


  clientCreatedGameCandidate(createdGameCandidate: GameCandidate){    
    const isCreatorInGame = this.gameCandidates.some((GameCandidate: GameCandidate) => 
    GameCandidate.clients.some(client => client.id == createdGameCandidate.creator.id))

    if(isCreatorInGame)
      throw 'shouldnt be able to create game if already in one'

    this.gameCandidates.push(createdGameCandidate)
    console.log(`${createdGameCandidate.creator.name} created a game lobby`);
    this.sendGameHostUiUpdateToClients()
  }

  clientJoinedGameCandidate(joiningClient: ConnectedClient, GameCandidateId){
    const GameCandidate: GameCandidate = this.gameCandidates.find(GameCandidate => GameCandidate.id == GameCandidateId)
    if(GameCandidate == undefined)
      throw `${joiningClient.name} tried to join a game that could not be found`

    if(GameCandidate.creator.id == joiningClient.id)
      throw `${joiningClient.name} trying to join a game that he created`


    if(GameCandidate.clients.some((clientInLobby: GameCandidateClient) => clientInLobby.id == joiningClient.id))
      throw `${joiningClient.name} was trying to join a game that he is already in`
    
    const joiningClientInfo: GameCandidateClient = {
      name: joiningClient.name,
      id: joiningClient.id,
      ready: false
    }
    GameCandidate.clients.push(joiningClientInfo)

    console.log(`${joiningClient.name} joined ${GameCandidate.creator.name}'s game`);
    this.sendGameHostUiUpdateToClients()
  }

  clientLeftGameCandidate(leavingClient: ConnectedClient, GameCandidateId){    
    const GameCandidate = this.gameCandidates.find((GameCandidate: GameCandidate) => GameCandidate.id == GameCandidateId)
    const leavingClientIndex = GameCandidate.clients.findIndex(
      (GameCandidateClient: GameCandidateClient) => GameCandidateClient.id == leavingClient.id
    )
    GameCandidate.clients.splice(leavingClientIndex, 1)

    console.log(`${leavingClient.name} has left ${GameCandidate.creator.name}'s game lobby`);
    this.sendGameHostUiUpdateToClients()
  }


  clientCanceledGameCandidate(GameCandidateId){    

    const GameCandidate: GameCandidate = this.gameCandidates.find((GameCandidate: GameCandidate) => GameCandidate.id == GameCandidateId)

    const canceldGameCandidateIndex = this.gameCandidates.findIndex((GameCandidate: GameCandidate) => GameCandidate.id == GameCandidateId)

    if(canceldGameCandidateIndex == -1)
      throw `canceled game lobby could not be found in gameCandidates array`

    console.log(`${GameCandidate.creator.name} has canceled his game lobby`);

    this.gameCandidates.splice(canceldGameCandidateIndex, 1)

    this.sendGameHostUiUpdateToClients()
  }

  clientToggledReadyInGameCandidate(togglingClient: ConnectedClient, GameCandidateId, readyValue: boolean){  

    const GameCandidate: GameCandidate = this.gameCandidates.find((GameCandidate: GameCandidate) => GameCandidate.id == GameCandidateId)

    const clientIndex = GameCandidate.clients.findIndex((client: GameCandidateClient) => 
      client.id == togglingClient.id)

    GameCandidate.clients[clientIndex].ready = readyValue
    
    console.log(`${togglingClient.name} set his ready state to ${readyValue} for ${GameCandidate.creator.name}'s game lobby`);
    this.sendGameHostUiUpdateToClients()
  }

  

  clientStartedGameCandidate(GameCandidateId){  
    const startedGameCandidate: GameCandidate = this.gameCandidates.find((GameCandidate: GameCandidate) => GameCandidate.id == GameCandidateId)
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


  private removeGameCandidate(removedGameCandidate: GameCandidate){
    const startedGameCandidateIndex = this.gameCandidates.findIndex((GameCandidate: GameCandidate) => GameCandidate.id == removedGameCandidate.id)
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
    const GameCandidateCreatedByClient: GameCandidate = this.gameCandidates.find(
      (GameCandidate: GameCandidate) => GameCandidate.creator.id == client.id
    )
    if(GameCandidateCreatedByClient !== undefined)
      this.clientCanceledGameCandidate(GameCandidateCreatedByClient.id)
    
    this.sendGameHostUiUpdateToClients()
  }

  private leaveAnyGameCandidateClientIsIn(client: ConnectedClient){
    const GameCandidateClientIsIn: GameCandidate = this.gameCandidates.find(
      (GameCandidate: GameCandidate) => GameCandidate.clients.some((GameCandidateClient: GameCandidateClient) => GameCandidateClient.id == client.id)
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

