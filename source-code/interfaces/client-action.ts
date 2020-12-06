import { ClientActionNamesPreGame } from "../types/client-pre-game-actions";
import { ClientActionNamesGame } from "../types/client-game-actions";


export type ClientActionNames = ClientActionNamesPreGame | ClientActionNamesGame

export default interface ClientAction{
  name: ClientActionNames
  data?: any
}
