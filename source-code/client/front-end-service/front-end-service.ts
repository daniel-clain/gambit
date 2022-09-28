
import { SetStatePreGameUI } from '../front-end-state/reducers/pre-game-ui.reducer'
import { SetStateFunctionName } from './front-end-service-types'

import { LocalService } from './local-service'
import { websocketService } from './websocket-service'
import {abilityService} from './ability-service-client';
import { frontEndStore } from '../front-end-state/front-end-state'
import { AllManagerUIState, FrontEndState, ServerGameUIState, ServerPreGameUIState } from '../../interfaces/front-end-state-interface'
import { ReportTypes } from '../../types/game/log-item-type';
import { ActivityLogItem } from '../../types/game/activity-log-item';

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

  let testTheServerTimeout = setInterval(() => {
    testTheServer()
  }, 1000)

  let lastTestVal, pollInterval, refreshTimeout, testing

  const resetTestTheServer = () => {
    clearTimeout(refreshTimeout)
    clearTimeout(testTheServerTimeout)
    testTheServerTimeout = setInterval(() => {
      testTheServer()
    }, 1000)
  }


  function testTheServer(){    
    const {clientName, clientId} = frontEndStore.getState().clientUIState.clientPreGameUIState 
    if(!clientName || !clientId) return 
    websocketService.sendUpdate.testConnection()
    refreshTimeout = setTimeout(() => {

      clearInterval(pollInterval)
      clearTimeout(refreshTimeout)
      doRefresh()
    }, 2000);

  }

  const doRefresh = () => {
    location.reload()
  }

  

  let connectionType: ConnectionType


  function getSortedActivityLogs(): ActivityLogItem[]{
    const {activityLogs} = frontEndStore.getState().serverUIState.serverGameUIState.playerManagerUIState.managerInfo
    
    function mainAtTop(a, b){
      const sameRound = a.roundNumber == b.roundNumber
      if(
        a.roundNumber > b.roundNumber || 
       (sameRound && a.type == 'critical') ||
       (sameRound && a.type == 'new round')

      ) return  -1 
      else return 1

    }

    const sortedLogs = activityLogs.sort((a, b) => b.roundNumber - a.roundNumber)
    return sortedLogs
  }


  return {
    sendUpdate: null,
    abilityService,
    frontEndStore,
    connectionType,
    getSortedActivityLogs,

    toManagerState(mapping){
      return () => ({
        clientUIState:{clientGameUIState:{clientManagerUIState}},
        serverUIState:{serverGameUIState:{playerManagerUIState}}
      }: FrontEndState): AllManagerUIState => mapping(
        {...clientManagerUIState, ...playerManagerUIState}
      )
    },

    toAllManagerState({
      clientUIState:{clientGameUIState:{clientManagerUIState}},
      serverUIState:{serverGameUIState:{playerManagerUIState}}
    }: FrontEndState): AllManagerUIState{
      return {...clientManagerUIState, ...playerManagerUIState}
    },


    setConnectionType: function (type: ConnectionType){
      this.connectionType = type
      
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
          serverPreGameUIState => {
            resetTestTheServer()
            frontEndStore.dispatch(
              {type:'Update Lobby UI', payload: serverPreGameUIState}
            )
          }
        )
        websocketService.onServerGameUIStateUpdate.subscribe(
          serverGameUIState => {
            resetTestTheServer()
            frontEndStore.dispatch(
              {type:'Update Game UI', payload: serverGameUIState}
            )
          }
        )
      }
    },
    setClientState: {
      ...setStatePreGameUIFunctions
      
    },

    connectToGameHost() {
      const {clientName, clientId} = frontEndStore.getState().clientUIState.clientPreGameUIState
      clientName ? this.sendUpdate.connectToHost({name: clientName, id: clientId}) : alert('You must submit a name')
    }
  }
})()

export {frontEndService}




