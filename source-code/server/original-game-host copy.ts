import ServerWebsocketService from "./server-websocket.service";
import Player from "../interfaces/player";
import Game from "../classes/game/game";
import Manager from "../classes/game/manager/manager";
import IManagerOption from "../classes/game/manager/managerOptions/manager-option";
import PlayerAction from "../interfaces/player-action";
import ConnectedClient, { GameLobbyUpdate } from './connected-client';
import ConnectingClientData from '../interfaces/connecting-client-data';
import { Subject } from 'rxjs';
import ClientId from '../types/client-id.type';
import CreatedGame from './created-game';
import PlayerNameAndId from '../interfaces/player-name-and-id';
import InGamePlayer from '../interfaces/in-game-player.interface';


export default class GameHost{
  private gameLobbyUpdatesSubject: Subject<GameLobbyUpdate> = new Subject()
  private connectedClients: ConnectedClient[] = []
  private availabeGames: CreatedGame[] = []
  //private activeGames: Game[] = []

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
    const connectingClient: ConnectedClient = new ConnectedClient(socket, id, name,this.gameLobbyUpdatesSubject)

    this.connectedClients.push(connectingClient)
    console.log(`${connectingClient.name} has connected to the game host`);


    this.connectedClientsUpdate()

    const inGamePlayer: InGamePlayer = {
      name: connectingClient.name,
      id: connectingClient.id,
      ready: false
    }

    connectingClient.disconnectedSubject.subscribe((clientId: ClientId) => this.handlePlayerDisconnect(clientId))
    connectingClient.createdGameSubject.subscribe((createdGame: CreatedGame) => this.handleCreatedGame(createdGame))
    connectingClient.joinedGameSubject.subscribe(gameId => this.handleJoinedGame(gameId, inGamePlayer))
    

  }



  private handlePlayerDisconnect(clientId: string){
    const foundDisconnectingPlayer: Player = this.connectedClients.find((player: Player) => player.id == clientId)
    if(foundDisconnectingPlayer == undefined)
      console.log('disconecting player is not in the player list')
    else{
      console.log(`removing ${foundDisconnectingPlayer.name} from the connected players list`);
      this.connectedClients = this.connectedClients.filter((player: Player) => player.id != clientId)
    }
    this.connectedClientsUpdate()
  }


  handleCreatedGame(createdGame: CreatedGame){    
    const isCreatorInGame = this.availabeGames.some((availabeGame: CreatedGame) => 
    availabeGame.creator.id === createdGame.creator.id || 
    availabeGame.joinedPlayers.some(player => player.id == createdGame.creator.id))

    if(isCreatorInGame)
      throw 'shouldnt be able to create game if already in one'

    this.availabeGames.push(createdGame)

    const gameLobbyUpdate: GameLobbyUpdate = {
      name: 'Available Games Update',
      data: this.availabeGames
    }
    this.gameLobbyUpdatesSubject.next(gameLobbyUpdate)
  }

  handleJoinedGame(gameId, player: InGamePlayer){
    const foundGame: CreatedGame = this.availabeGames.find(game => game.id == gameId)
    if(foundGame == undefined)
      throw 'should have been able join game'

    foundGame.joinedPlayers.push(player)
    console.log(`${player.name} joined ${foundGame.creator.name}'s game`);

    const gameLobbyUpdate: GameLobbyUpdate = {
      name: 'Available Games Update',
      data: this.availabeGames
    }
    this.gameLobbyUpdatesSubject.next(gameLobbyUpdate)
  }


  private connectedClientsUpdate(){
    const gameLobbyUpdate: GameLobbyUpdate = {
      name: 'Connected Clients Update',
      data: this.connectedClients.map(client => ({name: client.name, id: client.id}))
    }
    this.gameLobbyUpdatesSubject.next(gameLobbyUpdate)
  }

}

