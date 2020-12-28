

import Redux from 'redux'
import { Subscription } from 'rxjs'
import { FromClientToHost } from '../../server/game-host.types'
import { GameType } from '../../types/game/game-type'
import { FrontEndState, setupFrontEndStore } from "../front-end-state/front-end-state"
import { SetStateManagerUI } from '../front-end-state/reducers/manager-ui.reducer'
import { SetStatePreGameUI } from '../front-end-state/reducers/pre-game-ui.reducer'
import { FromClientToGame, SetState, SetStateFunctionName } from './front-end-service-types'

import { singlePlayer } from './single-player-service'
import { WebsocketService } from './websocket-service'


export class FrontEndService{
  sendUpdate: FromClientToHost & FromClientToGame
  frontEndStore: Redux.Store<FrontEndState> = setupFrontEndStore()
  connectToGameHost

  constructor(type: GameType){
    if(type == 'Local'){
      this.sendUpdate = singlePlayer.sendUpdate
      this.frontEndStore.dispatch({
        type: 'setName', payload: 'Single Player'
      })
      singlePlayer.onServerGameUIStateUpdate.subscribe(
        serverGameUIState => this.frontEndStore.dispatch(
          {type:'Update Game UI', payload: serverGameUIState}
        )
      )
    }

    if(type == 'Websockets'){
      const websocketService = new WebsocketService()
      this.sendUpdate = websocketService.sendUpdate
      this.connectToGameHost = websocketService.connectToGameHost
      websocketService.onServerPreGameUIStateUpdate.subscribe(
        serverPreGameUIState => this.frontEndStore.dispatch(
          {type:'Update Lobby UI', payload: serverPreGameUIState}
        )
      )
      websocketService.onServerGameUIStateUpdate.subscribe(
        serverGameUIState => this.frontEndStore.dispatch(
          {type:'Update Game UI', payload: serverGameUIState}
        )
      )
    }

  }

  private setStatePreGameUIFunctions: SetStatePreGameUI = {
    setName: clientName => this.dispatch('setName', clientName)
  }

  private setStateManagerUIFunctions: SetStateManagerUI = {
    showFighter: fighter => this.dispatch('showFighter', fighter),
    showEmployee: employee => this.dispatch('showEmployee', employee),
    showjobSeeker: jobSeeker => this.dispatch('showjobSeeker', jobSeeker),
    showAbility: ability => this.dispatch('showAbility', ability),
    showActivityLog: () => this.dispatch('showActivityLog'),
    showLoanShark: () => this.dispatch('showLoanShark'),
    showKnownFighters: () => this.dispatch('showKnownFighters'),
    showOtherManagers: () => this.dispatch('showOtherManagers'),
    closeModal: () => this.dispatch('closeModal'),
    closeSelectList: () => this.dispatch('closeSelectList')
  }

  setClientState: SetState = {
    ...this.setStatePreGameUIFunctions,
    ...this.setStateManagerUIFunctions
  }


  private dispatch = (functionName: SetStateFunctionName, data?) => {
    this.frontEndStore.dispatch({
      type: functionName, payload: data
    })
  }
}


let frontEndServiceInstance


export const frontEndService = (type?: GameType): FrontEndService => {
  if(frontEndServiceInstance)
  return frontEndServiceInstance
  else 
  frontEndServiceInstance = new FrontEndService(type)
  return frontEndServiceInstance
}



