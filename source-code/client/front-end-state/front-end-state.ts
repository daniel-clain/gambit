
import { ServerGameUIState } from "../../interfaces/server-game-ui-state.interface"
import Redux, { combineReducers, createStore } from 'redux'
import ChatMessage from "../../interfaces/chat-message.interface"
import { GameInfo } from "../../interfaces/game/game-info"

import { ClientManagerUIActionType, clientManagerUIReducer, ClientManagerUIState } from "./reducers/manager-ui.reducer"
import { ClientNameAndID, GameBeingCreated } from "../../server/game-host.types"
import { clientPreGameUIReducer } from "./reducers/pre-game-ui.reducer"

export interface FrontEndState {
  serverUIState: ServerUIState
  clientUIState: ClientUIState
}

export class ServerUIState{
  serverGameUIState: ServerGameUIState
  serverPreGameUIState: ServerPreGameUIState
}

export interface ServerPreGameUIState{
  connectedClients: ClientNameAndID[]
  gamesBeingCreated: GameBeingCreated[]
  globalChat: ChatMessage[]
  activeGames: GameInfo[]
}

export interface ClientGameUIState{
  clientManagerUIState: ClientManagerUIState
}

export interface ClientPreGameUIState {
  clientName: string
  clientId: string
}


export interface ClientUIState{
  clientGameUIState: ClientGameUIState
  clientPreGameUIState: ClientPreGameUIState
}



type ServerActionName = 'Update Lobby UI' | 'Update Game UI'


export interface ServerAction{
  type: ServerActionName
  payload?: any
}

const initialServerUIState: ServerUIState = {
  serverGameUIState: new ServerGameUIState(),
  serverPreGameUIState: undefined
}


const serverUIReducer = (serverUIState: ServerUIState = new ServerUIState(), {type, payload}: ServerAction) => {

  switch(type){
    case 'Update Lobby UI': return {
      ...serverUIState,
      serverPreGameUIState: payload
    }
    case 'Update Game UI': return {
      ...serverUIState,
      serverGameUIState: payload
    }
    default: return serverUIState
  }
}

const clientUIReducer = combineReducers({
  clientPreGameUIState: clientPreGameUIReducer,
  clientGameUIState: combineReducers({
    clientManagerUIState: clientManagerUIReducer
  })
})

const frontEndStoreReducer = combineReducers({
  serverUIState: serverUIReducer,
  clientUIState: clientUIReducer

})

export const setupFrontEndStore = (): Redux.Store<FrontEndState> => {
  return createStore(frontEndStoreReducer, 
    window['__REDUX_DEVTOOLS_EXTENSION__'] && 
    window['__REDUX_DEVTOOLS_EXTENSION__']()
  )
}
