import PlayerNameAndId from './player-name-and-id';

export default interface ChatMessage{
  player: PlayerNameAndId
  message: string
}