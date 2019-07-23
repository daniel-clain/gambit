import {GameHostState, GameState} from './../interfaces/client-ui-state.interface';
import ServerWebsocketService from "./server-websocket.service";
import ConnectedClient from './connected-client';
import ConnectingClientData from '../interfaces/connecting-client-data';
import GameLobby from './game-lobby';
import GameLobbyClient from '../interfaces/game-lobby-client.interface';
import ClientNameAndId from '../interfaces/client-name-and-id.interface';
import Game from '../classes/game/game';
import PlayerNameAndId from '../interfaces/player-name-and-id';
import ChatMessage from '../interfaces/chat-message.interface';
import Player from '../classes/game/player';


export default class GameHost{
  private connectedClients: ConnectedClient[] = []
  private gameLobbies: GameLobby[] = []
  private activeGames: Game[] = []
  private globalChat: ChatMessage[] = []

  constructor(private websocketService: ServerWebsocketService){
    this.websocketService.clientConnected.subscribe(
      (connectingClientData: ConnectingClientData) => this.handleConnectingClient(connectingClientData))    
  }

  private handleConnectingClient(connectingClientData: ConnectingClientData){
    const {id, name, socket} = connectingClientData
    if(name == undefined)
      throw 'connecting client name undefined'
    if(id == undefined)
      throw 'connecting client id undefined'

    if(this.connectedClients.some(
      (client: ConnectedClient) => client.id == id)){
      console.log('error: connecting player id already existsxx');
      return
    }
    const connectingClient: ConnectedClient = new ConnectedClient(socket, id, name, this)

    this.connectedClients.push(connectingClient)
    console.log(`${connectingClient.name} has connected to the game host`);

    this.gameHostUpdate()   
  }

  clientDisconnected(disconnectingClient: ConnectedClient, reason){
      console.log(`${disconnectingClient.name} disconnected due to ${reason}, removing ${disconnectingClient.name} from the connected players list`);
      const clientIndex = this.connectedClients.findIndex((client: ConnectedClient) => client.id == disconnectingClient.id)
      this.connectedClients.splice(clientIndex, 1)

      this.cancelAnyGamesCreatedByClient(disconnectingClient)
      this.leaveAnyGamesClientIsIn(disconnectingClient)

      this.gameHostUpdate()
  }


  clientCreatedGameLobby(createdGameLobby: GameLobby){    
    const isCreatorInGame = this.gameLobbies.some((gameLobby: GameLobby) => 
    gameLobby.clients.some(client => client.id == createdGameLobby.creator.id))

    if(isCreatorInGame)
      throw 'shouldnt be able to create game if already in one'

    this.gameLobbies.push(createdGameLobby)
    console.log(`${createdGameLobby.creator.name} created a game lobby`);
    this.gameHostUpdate()
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
    this.gameHostUpdate()
  }

  clientLeftGameLobby(leavingClient: ConnectedClient, gameLobbyId){    
    const gameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)
    const leavingClientIndex = gameLobby.clients.findIndex(
      (gameLobbyClient: GameLobbyClient) => gameLobbyClient.id == leavingClient.id
    )
    gameLobby.clients.splice(leavingClientIndex, 1)

    console.log(`${leavingClient.name} has left ${gameLobby.creator.name}'s game lobby`);
    this.gameHostUpdate()
  }


  clientCanceledGameLobby(gameLobbyId){    

    const gameLobby: GameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)

    const cancledGameLobbyIndex = this.gameLobbies.findIndex((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)

    if(cancledGameLobbyIndex == -1)
      throw `canceled game lobby could not be found in gameLobbies array`

    console.log(`${gameLobby.creator.name} has cancled his game lobby`);

    this.gameLobbies.splice(cancledGameLobbyIndex, 1)

    this.gameHostUpdate()
  }

  clientToggledReadyInGameLobby(togglingClient: ConnectedClient, gameLobbyId, readyValue: boolean){  

    const gameLobby: GameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)

    const clientIndex = gameLobby.clients.findIndex((client: GameLobbyClient) => 
      client.id == togglingClient.id)

    gameLobby.clients[clientIndex].ready = readyValue
    
    console.log(`${togglingClient.name} set his ready state to ${readyValue} for ${gameLobby.creator.name}'s game lobby`);
    this.gameHostUpdate()
  }

  

  clientStartedGameLobby(gameLobbyId){  
    const startedGameLobby: GameLobby = this.gameLobbies.find((gameLobby: GameLobby) => gameLobby.id == gameLobbyId)
    const playerNameAndIds: PlayerNameAndId[] = startedGameLobby.clients.map(
      (client: GameLobbyClient) => {
        const playerNameAndId: PlayerNameAndId = {
          name: client.name,
          id: client.id
        }
        return playerNameAndId
      }
    )
    console.log(`${startedGameLobby.creator.name} has started his game lobby`);
    const newGame: Game = new Game(playerNameAndIds)
    newGame.players.forEach((player: Player) => {
      const playersConnectedClient: ConnectedClient = this.connectedClients.find(
        (connectedClient: ConnectedClient) => connectedClient.id == player.id
      )
      player.gameUiStateSubject.subscribe((gameState: GameState) => {
        playersConnectedClient.gameUiUpdate(gameState)
      })
    })
    this.activeGames.push(newGame)
  }

  clientSubmittedGlobalMessage(client: ConnectedClient, message: string){
    const chatMessage: ChatMessage = {
      player: {name: client.name, id: client.id},
      message
    }
    this.globalChat.push(chatMessage)
    this.gameHostUpdate()
  }


  private cancelAnyGamesCreatedByClient(client: ConnectedClient){
    const gameLobbyCreatedByClient: GameLobby = this.gameLobbies.find(
      (gameLobby: GameLobby) => gameLobby.creator.id == client.id
    )
    if(gameLobbyCreatedByClient !== undefined){
      this.clientCanceledGameLobby(gameLobbyCreatedByClient.id)
    }
  }

  private leaveAnyGamesClientIsIn(client: ConnectedClient){
    const gameLobbyClientIsIn: GameLobby = this.gameLobbies.find(
      (gameLobby: GameLobby) => gameLobby.clients.some((gameLobbyClient: GameLobbyClient) => gameLobbyClient.id == client.id)
    )
    if(gameLobbyClientIsIn != undefined)
      this.clientLeftGameLobby(client, gameLobbyClientIsIn.id)
  }


  private gameHostUpdate(){
    const clientNameAndIds: ClientNameAndId[] = this.connectedClients.map(client => ({name: client.name, id: client.id}))

    const gameHostStateUpdate: GameHostState = {
      connectedPlayers: clientNameAndIds,
      gameLobbies: this.gameLobbies,
      globalChat: this.globalChat
    }
    this.connectedClients.forEach((connectedClient: ConnectedClient) => connectedClient.gameHostUiUpdate(gameHostStateUpdate))
  }



}

