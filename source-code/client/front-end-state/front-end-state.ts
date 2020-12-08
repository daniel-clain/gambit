
import { FighterInfo, JobSeeker, ServerGameUIState } from "../../interfaces/server-game-ui-state.interface"
import Redux, { createStore } from 'redux'
import ChatMessage from "../../interfaces/chat-message.interface"
import { GameInfo } from "../../interfaces/game/game-info"
import PlayerNameAndId from "../../interfaces/player-name-and-id"
import GameCandidate from "../../interfaces/game-candidate.interface"
import { AbilityData } from "../../game-components/abilities-reformed/ability"

export interface LobbyUiState{
  connectedPlayers: PlayerNameAndId[]
  gameCandidates: GameCandidate[]
  globalChat: ChatMessage[]
  activeGames: GameInfo[]
}

export interface FrontEndState {
  clientId: string
  clientName: string
  clientType: 'Player' | 'Display'
  connectedToGameHost: boolean
  lobbyUiState: LobbyUiState
  inGame: boolean
  serverGameUIState: ServerGameUIState
  clientGameUIState: ClientGameUIState
}

export const lobbyUiState: LobbyUiState = {
  connectedPlayers: [],
  gameCandidates: [],
  globalChat: [],
  activeGames: [],
}


export type ModalName = 'Logs' | 'Loan Shark' | 'Known Fighters' | 'Managers' | 'Ability' | 'Fighter' | 'Employee' | 'Job Seeker' | 'Manager'

export interface ClientGameUIState{
  selectedFighter?: FighterInfo
  selectedAbility?: AbilityData
  selectedJobseeker?: JobSeeker
  activeModal?: ModalName
}

function getClientid(){
  const id = localStorage.getItem('clientId') 
  if(id) return id
  else {
    const clientId = new Date().getTime().toString()
    localStorage.setItem('clientId', clientId)
    return clientId
  }
}

const gameUiData = undefined


type ActionType = 'Fighter Selected' | 'Set Name' | 'Jobseeker Selected' | 'Ability Selected' | 'Employee Selected' | 'Close Modal' | 'Open Modal' | 'Update Lobby UI' | 'Update Game UI'


export interface DispatchAction{
  type: ActionType
  payload?: any
}


let initialState: FrontEndState = {
  clientId: getClientid(),
  clientName: localStorage.getItem('name'),
  clientType: localStorage.getItem('name') ? 'Player': undefined,
  inGame: false,
  connectedToGameHost: false,
  clientGameUIState: {},
  lobbyUiState: undefined,
  serverGameUIState: undefined,
}

function frontEndStoreReducer(
  state: FrontEndState = initialState, 
  action: DispatchAction
): FrontEndState{

  switch(action.type){
    case 'Set Name': return {...state, clientName: action.payload}
    case 'Fighter Selected': return {...state, clientGameUIState: {...state.clientGameUIState, selectedFighter: action.payload}}
    case 'Jobseeker Selected': return {...state, clientGameUIState: {...state.clientGameUIState, selectedJobseeker: action.payload}}
    case 'Close Modal': return {...state, clientGameUIState: {...state.clientGameUIState, activeModal: null}}
    case 'Open Modal': return {...state, clientGameUIState: {...state.clientGameUIState, activeModal: action.payload}}
    case 'Update Lobby UI': return {
      ...state,
      lobbyUiState: action.payload as LobbyUiState,
      connectedToGameHost: true
    }
    case 'Update Game UI': return {
      ...state,
      inGame: true,
      serverGameUIState: action.payload as ServerGameUIState
    }
    default: return state
  }

}


export const setupFrontEndStore = (): Redux.Store<FrontEndState> => {
  return createStore(frontEndStoreReducer, 
    window['__REDUX_DEVTOOLS_EXTENSION__'] && 
    window['__REDUX_DEVTOOLS_EXTENSION__']()
  )
}