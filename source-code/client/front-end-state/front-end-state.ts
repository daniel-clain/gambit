import { combineReducers, createStore, Store } from 'redux'
import { ServerGameUIState, ServerPreGameUIState, ServerUIState } from '../../interfaces/front-end-state-interface'
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
      serverPreGameUIState: payload as ServerPreGameUIState
    }
    case 'Update Game UI': return {
      ...serverUIState,
      serverGameUIState: payload as ServerGameUIState
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
export type RootState = ReturnType<typeof frontEndStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof frontEndStore.dispatch