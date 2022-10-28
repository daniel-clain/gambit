import { Socket } from "socket.io"
import { Game } from "../game-components/game"
import ChatMessage from "../interfaces/chat-message.interface"

export class ClientNameAndID{
  name: string
  id: string
}
export class ConnectedClient implements ClientNameAndID {
  constructor(    
    public name: string,
    public id: string,
    public socket?: Socket
  ){}  
}
export class JoinedClient implements ClientNameAndID {  
  ready: boolean
  constructor(    
    public name: string,
    public id: string
  ){} 
}

export type GameBeingCreated = {
  id: string
  creator: JoinedClient
  clients: JoinedClient[]
}


export type FromClientToHost = {
  connectToHost({name, id}: {name: string, id: string}) 
  create() 
  testConnection() 
  cancel(gameId: string) 
  start(gameId: string)
  join(gameId: string)
  readyToStart({gameId, ready}: {gameId: string, ready: boolean})
  leave(gameId: string)
  reJoin(gameId: string)
  submitGlobalChat(message: string)
  disconnect?(reason: string)
  reset({name,id}: {name: string, id: string})
}


export class GameHostState {
  connectedClients: ConnectedClient[] = []
  gamesBeingCreated: GameBeingCreated[] = []
  globalChat: ChatMessage[] = []
  activeGames: Game[] = []
  testConnection: number
}