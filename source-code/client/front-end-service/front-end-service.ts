
import { SetStatePreGameUI } from '../front-end-state/reducers/pre-game-ui.reducer'
import { SetStateFunctionName } from './front-end-service-types'

import { LocalService } from './local-service'
import { websocketService } from './websocket-service'
import {abilityService} from './ability-service-client';
import { frontEndStore } from '../front-end-state/front-end-state'
import { AllManagerUIState, FrontEndState, ServerPreGameUIState } from '../../interfaces/front-end-state-interface'
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

/*   const setStateManagerUIFunctions = {
    showFighter: fighter => dispatch('showFighter', fighter),
    showEmployee: employee => dispatch('showEmployee', employee),
    showjobSeeker: jobSeeker => dispatch('showjobSeeker', jobSeeker),
    showAbility: ability => dispatch('showAbility', ability),
    showManagerOptions: () => dispatch('showManagerOptions'),
    showLoanShark: () => dispatch('showLoanShark'),
    showKnownFighters: () => dispatch('showKnownFighters'),
    showOtherManagers: () => dispatch('showOtherManagers'),
    closeModal: () => dispatch('closeModal'),
    closeSelectList: () => dispatch('closeSelectList'),
    showReport: () => dispatch('showReport')
  }
 */

  

  let connectionType: ConnectionType


  return {
    sendUpdate: null,
    abilityService,
    frontEndStore,
    connectionType,
    getReportItems(): ActivityLogItem[]{
      const {activityLogs} = frontEndStore.getState().serverUIState.serverGameUIState.playerManagerUIState.managerInfo

      const types: ReportTypes[] = ['employee outcome', 'betting', 'critical', 'report']
      const reduced = [...activityLogs].reverse().reduce((obj, logItem) => {
        if(!obj.first && logItem.type == 'new round') return {...obj, first: true}
        else if(obj.second) return obj
        else if(logItem.type == 'new round') return {...obj, second: true}
        else if(types.some(t => t == logItem.type)) return {...obj, returnArray: [...obj.returnArray, logItem]}
        else return obj
      },{first: null, second: null, returnArray: []})
      return reduced.returnArray
    },

    /* hotConnection<T>(, component: (props: T) => JSX.Element){
      return connect(this.managerMap(mapping))(hot(component))
    }, */

    managerMap<T>(mapping: (allManagerUIState: AllManagerUIState) => T){
      return () => ({
        clientUIState:{clientGameUIState:{clientManagerUIState}},
        serverUIState:{serverGameUIState:{playerManagerUIState}}
      }: FrontEndState):T => mapping({...clientManagerUIState, ...playerManagerUIState})
    },

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
      ...setStatePreGameUIFunctions
      
    },

    connectToGameHost() {
      const {clientName, clientId} = frontEndStore.getState().clientUIState.clientPreGameUIState
      clientName ? this.sendUpdate.connectToHost({name: clientName, id: clientId}) : alert('You must submit a name')
    }
  }
})()

export {frontEndService}




