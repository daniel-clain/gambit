import ClientAction from "../interfaces/client-action"
import ClientNameAndId from "../interfaces/client-name-and-id.interface"

export type ClientActionNamesPreGame = 'Connect To Game Host' | 'Join Game' | 'Create Game' | 'Cancel Game' | 'Leave Game' | 'Start Game' | 'Ready To Start Game' | 'Submit Global Chat'


export interface ClientPregameAction extends ClientAction{  
  name: ClientActionNamesPreGame
}

export class ConnecToGameHostAction implements ClientPregameAction{
  name:  'Connect To Game Host'
  data: ClientNameAndId
}
