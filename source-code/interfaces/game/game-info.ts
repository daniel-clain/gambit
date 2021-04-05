import { DisconnectedPlayerVote } from "../../interfaces/front-end-state-interface";
import { ClientNameAndID } from "../../game-host/game-host.types";


export interface GameInfo{
  id: string
  players: ClientNameAndID[]
  gameDisplays: ClientNameAndID[]
  paused: boolean
  round: number
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
}