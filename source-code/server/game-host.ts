
import ConnectedClient from './connected-client';
import GameLobbyClient from '../interfaces/game-lobby-client.interface';
import ClientNameAndId from '../interfaces/client-name-and-id.interface';
import ChatMessage from '../interfaces/chat-message.interface';
import GameLobby from '../interfaces/game-lobby.interface';
import { PlayerInfo } from '../interfaces/player-info.interface';
import Game from "../game-components/game";
import { Socket } from 'socket.io';
import PlayerUpdateCommunicatorGameWebsocket from '../game-components/update-communicators/player-update-communicator-game-websocket';
import PlayerUpdateCommunicatorGame from '../game-components/update-communicators/player-update-communicator-game';
import { GameInfo } from '../interfaces/game/game-info';
import { MainGameData } from '../interfaces/game-ui-state.interface';
import PlayerNameAndId from '../interfaces/player-name-and-id';


export default class GameHost{
  private connectedClients: ConnectedClient[] = []
  private gameLobbies: GameLobby[] = []
  private activeGames: Game[] = []
  private globalChat: ChatMessage[] = []

  
  private gameHostUiState: MainGameData = {
    connectedPlayers: [],
    gameLobbies: [],
    globalChat: [],
    activeGames: []
  }


  handleConnectingClient(clientNameAndId: ClientNameAndId, socket: Socket){
    const {name, id} = clientNameAndId
    if(name == undefined)
      throw 'connecting client name undefined'
    if(id == undefined)
      throw 'connecting client id undefined'

    if(this.connectedClients.some(
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
      this.leaveAnyGameLobbyClientIsIn(disconnectingClient)
      this.disconnectFromGameClientIsIn(disconnectingClient)

      this.sendGameHostUiUpdateToClients()
  }


  clientCreatedGameLobby(createdGameLobby: GameLobby){    
    const isCreatorInGame = this.gameLobbies.some((gameLobby: GameLobby) => 
    gameLobby.clients.some(client => client.id == createdGameLobby.creator.id))

    if(isCreatorInGame)
      throw 'shouldnt be able to create game if already in one'

    this.gameLobbies.push(createdGameLobby)
    console.log(`${createdGameLobby.creator.name} created a game lobby`);
    this.sendGameHostUiUpdateToClients()
  }

  clientJoinedGameLobby(joiningClient: ConnectedClient, gameLobbyId){
    const gameLobby: GameLobby = this.gameLobbies.find(gameLobby => gameLobby.id == gameLobbyId)
    if(gameLobby == undefined)
      throw `${joiningClient.name} tried to join a game that could not be found`

    if(gameLobby.creator.id == joiningClient.id)
      throw `${joiningClient.name} trying to join a game that he created`


    if(gameLobby.clients.some((clientInLobby: GameLobbyClient) => clientInLobby.id == joiningClient.id))
      throw `${joiningClient.name} was trying to join a game that he is already in`
    
    const joiningClientInfo: GameLobbyClient = {
      name: joiningClient.name,
      id: joiningClient.id,
      ready: false
    }
    gameLobby.clients.push(joiningClientInfo)

    console.log(`${joiningClient.name} joined ${gameLobby.creator.name}'s game`);
    this.sendGameHostUiUpdateToClients()
  }

  clientLeftGameLobby(leavingClient: ConnectedClient, gameLobbyId){    
    const gameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)
    const leavingClientIndex = gameLobby.clients.findIndex(
      (gameLobbyClient: GameLobbyClient) => gameLobbyClient.id == leavingClient.id
    )
    gameLobby.clients.splice(leavingClientIndex, 1)

    console.log(`${leavingClient.name} has left ${gameLobby.creator.name}'s game lobby`);
    this.sendGameHostUiUpdateToClients()
  }


  clientCanceledGameLobby(gameLobbyId){    

    const gameLobby: GameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)

    const canceldGameLobbyIndex = this.gameLobbies.findIndex((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)

    if(canceldGameLobbyIndex == -1)
      throw `canceled game lobby could not be found in gameLobbies array`

    console.log(`${gameLobby.creator.name} has canceled his game lobby`);

    this.gameLobbies.splice(canceldGameLobbyIndex, 1)

    this.sendGameHostUiUpdateToClients()
  }

  clientToggledReadyInGameLobby(togglingClient: ConnectedClient, gameLobbyId, readyValue: boolean){  

    const gameLobby: GameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)

    const clientIndex = gameLobby.clients.findIndex((client: GameLobbyClient) => 
      client.id == togglingClient.id)

    gameLobby.clients[clientIndex].ready = readyValue
    
    console.log(`${togglingClient.name} set his ready state to ${readyValue} for ${gameLobby.creator.name}'s game lobby`);
    this.sendGameHostUiUpdateToClients()
  }

  

  clientStartedGameLobby(gameLobbyId){  
    const startedGameLobby: GameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)
    const gameClients: ConnectedClient[] = startedGameLobby.clients.map(client => this.getClientById(client.id))
      
    const playerInfos: PlayerInfo[] = gameClients.map(client => client.getPlayerInfo())
    console.log(`${startedGameLobby.creator.name} has started his game lobby!`);
    const newGame: Game = new Game('Websockets' ,playerInfos)

    this.activeGames.push(newGame)
    this.removeGameLobby(startedGameLobby)
    this.sendGameHostUiUpdateToClients()
  }

  private getClientById(id: string): ConnectedClient{
    return this.connectedClients.find(
      (client: ConnectedClient) => client.id == id
    )
  }


  private removeGameLobby(removedGameLobby: GameLobby){
    const startedGameLobbyIndex = this.gameLobbies.findIndex((gameLobby: GameLobby) => gameLobby.id == removedGameLobby.id)
    this.gameLobbies.splice(startedGameLobbyIndex, 1)
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
    const gameLobbyCreatedByClient: GameLobby = this.gameLobbies.find(
      (gameLobby: GameLobby) => gameLobby.creator.id == client.id
    )
    if(gameLobbyCreatedByClient !== undefined)
      this.clientCanceledGameLobby(gameLobbyCreatedByClient.id)
    
    this.sendGameHostUiUpdateToClients()
  }

  private leaveAnyGameLobbyClientIsIn(client: ConnectedClient){
    const gameLobbyClientIsIn: GameLobby = this.gameLobbies.find(
      (gameLobby: GameLobby) => gameLobby.clients.some((gameLobbyClient: GameLobbyClient) => gameLobbyClient.id == client.id)
    )
    if(gameLobbyClientIsIn != undefined)
      this.clientLeftGameLobby(client, gameLobbyClientIsIn.id)

    this.sendGameHostUiUpdateToClients()
  }

  private disconnectFromGameClientIsIn(client: ConnectedClient){
    const gameClientIsIn: Game = this.activeGames.find(
      (game: Game) => game.playersUpdateCommunicatorsWebsocket.some((playersUpdateCommunicator: PlayerUpdateCommunicatorGameWebsocket) => playersUpdateCommunicator.id == client.id)
    )
    if(gameClientIsIn != undefined)
      gameClientIsIn.disconnectedPlayers.playerDisconnected({id: client.id, name: client.name})

    this.sendGameHostUiUpdateToClients()
  }

  playerRejoinGame(gameId, player: PlayerNameAndId, socket: Socket){
    const game: Game = this.activeGames.find((game: Game) => game.id == gameId)
    game.disconnectedPlayers.playerReconnected(player, socket)
    this.sendGameHostUiUpdateToClients()
  }


  private sendGameHostUiUpdateToClients(){
    const activeGames: GameInfo[] = this.activeGames.map((game: Game): GameInfo => game.getGameInfo())
    
    const clientNameAndIds: ClientNameAndId[] = this.connectedClients.map(client => ({name: client.name, id: client.id}))
    
    this.gameHostUiState.connectedPlayers = clientNameAndIds 
    this.gameHostUiState.gameLobbies = this.gameLobbies  
    this.gameHostUiState.globalChat = this.globalChat    
    this.gameHostUiState.activeGames = activeGames    

    this.connectedClients.forEach(client => {
      client.sendMainGameDataToClient(this.gameHostUiState)
    })
  }


}

