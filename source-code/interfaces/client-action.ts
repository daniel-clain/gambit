
type ClientActionNames = 'Connect' | 'Join Game'

export interface ClientAction{
  playerId?: string
  name: ClientActionNames
  arguments?: any
}