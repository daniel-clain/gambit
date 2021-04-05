
import { FromClientToHost } from '../../game-host/game-host.types'
import { SetStateManagerUI } from '../front-end-state/reducers/manager-ui.reducer'
import { SetStatePreGameUI } from '../front-end-state/reducers/pre-game-ui.reducer'
import { FromClientToGame, SetStateFunctionName } from './front-end-service-types'

import { LocalService } from './local-service'
import { websocketService } from './websocket-service'
import {abilityService} from './ability-service-client';
import { frontEndStore } from '../front-end-state/front-end-state'
import { ServerPreGameUIState } from '../../interfaces/front-end-state-interface'

type ConnectionType = 'Local' | 'Websockets'

const frontEndService = (() => {

  

  const dispatch = (functionName: SetStateFunctionName, data?) => {
    frontEndStore.dispatch({
      type: functionName, payload: data
    })
  }

  const setStatePreGameUIFunctions: SetStatePreGameUI = {
    setName: clientName => dispatch('setName', clientName)
  }

  const setStateManagerUIFunctions = {
    showFighter: fighter => dispatch('showFighter', fighter),
    showEmployee: employee => dispatch('showEmployee', employee),
    showjobSeeker: jobSeeker => dispatch('showjobSeeker', jobSeeker),
    showAbility: ability => dispatch('showAbility', ability),
    showActivityLog: () => dispatch('showActivityLog'),
    showLoanShark: () => dispatch('showLoanShark'),
    showKnownFighters: () => dispatch('showKnownFighters'),
    showOtherManagers: () => dispatch('showOtherManagers'),
    closeModal: () => dispatch('closeModal'),
    closeSelectList: () => dispatch('closeSelectList'),
    showReport: () => dispatch('showReport')
  }

  let connectionType: ConnectionType


  return {
    sendUpdate: null,
    abilityService,
    frontEndStore,
    connectionType,
    setConnectionType: function (type: ConnectionType){
      connectionType = type
      
      if(type == 'Local'){
        const localService = new LocalService()
        this.sendUpdate = localService.sendUpdate

        dispatch('setName','Single Player')
        localService.onServerPreGameUIStateUpdate.subscribe(
          serverPreGameUIState => frontEndStore.dispatch(
            {type:'Update Lobby UI', payload: serverPreGameUIState}
          )
        )
        localService.onServerGameUIStateUpdate.subscribe(
          serverGameUIState => frontEndStore.dispatch(
            {type:'Update Game UI', payload: serverGameUIState}
          )
        )
        localService.onServerPreGameUIStateUpdate.next({} as ServerPreGameUIState)
        localService.game.functions.triggerUIUpdate()
      }
    
      if(type == 'Websockets'){
        websocketService.init()
        this.sendUpdate = websocketService.sendUpdate
        
        websocketService.onServerPreGameUIStateUpdate.subscribe(
          serverPreGameUIState => frontEndStore.dispatch(
            {type:'Update Lobby UI', payload: serverPreGameUIState}
          )
        )
        websocketService.onServerGameUIStateUpdate.subscribe(
          serverGameUIState => {
            console.log('game update ', serverGameUIState);
            frontEndStore.dispatch(
              {type:'Update Game UI', payload: serverGameUIState}
            )
          }
        )
      }
    },
    setClientState: {
      ...setStatePreGameUIFunctions,
      ...setStateManagerUIFunctions
      
    },

    connectToGameHost() {
      const {clientName, clientId} = frontEndStore.getState().clientUIState.clientPreGameUIState
      clientName ? this.sendUpdate.connectToHost({name: clientName, id: clientId}) : alert('You must submit a name')
    }
  }
})()

export {frontEndService}




