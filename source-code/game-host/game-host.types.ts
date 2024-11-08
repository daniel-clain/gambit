import { Socket } from "socket.io"
import { Game } from "../game-components/game"
import ChatMessage from "../interfaces/chat-message.interface"

export class ClientNameAndID {
  name: string
  id: string
}
export class ConnectedClient implements ClientNameAndID {
  constructor(public name: string, public id: string, public socket?: Socket) {}
}
export class JoinedClient implements ClientNameAndID {
  ready: boolean
  constructor(public name: string, public id: string) {}
}

export type GameBeingCreated = {
  id: string
  creator: JoinedClient
  clients: JoinedClient[]
}

export type FromClientToHost = {
  connectToHost: ({ name, id }: { name: string; id: string }) => void
  create: () => void
  testConnection: () => void
  cancel: (gameId: string) => void
  start: (gameId: string) => void
  join: (gameId: string) => void
  readyToStart: ({ gameId, ready }: { gameId: string; ready: boolean }) => void
  leave: (gameId: string) => void
  reJoin: (gameId: string) => void
  submitGlobalChat: (message: string) => void
  disconnect: (reason: string) => void
  reset: ({ name, id }: { name: string; id: string }) => void
}

export type FromClientToHostName = keyof FromClientToHost

export class GameHostState {
  connectedClients: ConnectedClient[] = []
  gamesBeingCreated: GameBeingCreated[] = []
  globalChat: ChatMessage[] = []
  activeGames: Game[] = []
  testConnection: number
}
