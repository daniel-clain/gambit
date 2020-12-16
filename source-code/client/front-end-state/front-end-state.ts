
import { ServerGameUIState } from "../../interfaces/server-game-ui-state.interface"
import Redux, { combineReducers, createStore } from 'redux'
import ChatMessage from "../../interfaces/chat-message.interface"
import { GameInfo } from "../../interfaces/game/game-info"

import GameBeingCreated from "../../interfaces/game-candidate.interface"
import { ClientManagerUIActionType, clientManagerUIReducer, ClientManagerUIState } from "./reducers/manager-ui.reducer"
import { clientPreGameUIReducer, ClientPreGameUIState, ClientPreUIGameActionType } from "./reducers/pre-game-ui.reducer"
import { ClientNameAndID, GameBeingCreated } from "../../server/game-host"

export interface FrontEndState {
  serverUIState: ServerUIState
  clientUIState: ClientUIState
}

export interface ServerUIState{
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


export interface ClientUIState{
  clientGameUIState: ClientGameUIState
  clientPreGameUIState: ClientPreGameUIState
}



type ActionType = 'Update Lobby UI' | 'Update Game UI' | ClientManagerUIActionType | ClientPreUIGameActionType


export interface DispatchAction{
  type: ActionType
  payload?: any
}

const initialServerUIState: ServerUIState = {
  serverGameUIState: undefined,
  serverPreGameUIState: undefined
}


const serverUIReducer = (serverUIState: ServerUIState = initialServerUIState, {type, payload}: DispatchAction) => {

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