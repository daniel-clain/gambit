import { ClientNameAndID } from "../../server/game-host";
import { GameDisplay } from "../game-display-interface";


export interface GameInfo{
  id: string
  players: ClientNameAndID[]
  gameDisplays: ClientNameAndID[]
  paused: boolean
  round: number
  disconnectedClients: ClientNameAndID[]
}