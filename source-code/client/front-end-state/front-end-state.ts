import { combineReducers, createStore, Store } from 'redux'
import { ServerUIState } from '../../interfaces/front-end-state-interface'
import { clientManagerUIReducer } from "./reducers/manager-ui.reducer"
import { clientPreGameUIReducer } from "./reducers/pre-game-ui.reducer"


type ServerActionName = 'Update Lobby UI' | 'Update Game UI'


interface ServerAction{
  type: ServerActionName
  payload?: any
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


export const frontEndStore = createStore(frontEndStoreReducer, 
  window['__REDUX_DEVTOOLS_EXTENSION__'] && 
  window['__REDUX_DEVTOOLS_EXTENSION__']()
)
