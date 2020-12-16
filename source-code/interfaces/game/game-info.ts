import { ClientNameAndID } from "../../server/game-host";


export interface GameInfo{
  id: string
  players: ClientNameAndID[]
  paused: boolean
  round: number
  disconnectedClients: ClientNameAndID[]
}