

import Redux from 'redux'
import { DispatchAction, FrontEndState, setupFrontEndStore } from "../front-end-state/front-end-state"

import {BackEndConnection, backEndConnection} from './front-end-service-utility/backend-connection.utility'
import getPreGameUIUtility, { PreGameUIUtility } from './front-end-service-utility/pre-game-ui.utility'
import getManagerUiUtility, { ManagerUIUtility } from './front-end-service-utility/manager-ui.utility'


export interface FrontEndService 
  extends 
    BackEndConnection, 
    PreGameUIUtility,
    ManagerUIUtility  
{
  frontEndStore: Redux.Store<FrontEndState>
}

let frontEndServiceInstance: FrontEndService



export const setupFrontEndService = (): FrontEndService => {

  frontEndServiceInstance = {
    ...backEndConnection,
    frontEndStore: setupFrontEndStore(),
  } as any

  frontEndServiceInstance = {
    ...frontEndServiceInstance, 
    ...getManagerUiUtility(frontEndServiceInstance),
    ...getPreGameUIUtility(frontEndServiceInstance)
  } as FrontEndService

  frontEndServiceInstance.onUpdateReceived((type, data) => {
    switch(type){
      case 'To Client From Server - Lobby Ui': {
        frontEndServiceInstance.frontEndStore.dispatch({
          type: 'Update Lobby UI',
          payload: data
        })
      }; break
      case 'To Client From Server - Game Ui': {
        frontEndServiceInstance.frontEndStore.dispatch({
          type: 'Update Game UI',
          payload: data
        })
      }
    }
  })


  return frontEndServiceInstance
}

export const frontEndService = frontEndServiceInstance ? frontEndServiceInstance : setupFrontEndService()


