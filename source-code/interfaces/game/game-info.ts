import { ClientNameAndID } from "../../backend/game-host/game-host.types"
import { DisconnectedPlayerVote } from "../../interfaces/front-end-state-interface"

export interface GameInfo {
  id: string
  players: ClientNameAndID[]
  gameDisplays?: ClientNameAndID[]
  paused: boolean
  week: number
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
}
