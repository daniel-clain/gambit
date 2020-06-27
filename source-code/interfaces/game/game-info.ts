import PlayerNameAndId from "../player-name-and-id";

export interface GameInfo{
  id: string
  players: PlayerNameAndId[]
  paused: boolean
  round: number
  disconnectedPlayers: PlayerNameAndId[]
}