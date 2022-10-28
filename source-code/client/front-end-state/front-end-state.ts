import { autorun, observable, reaction } from 'mobx'
import { FrontEndState } from '../../interfaces/front-end-state-interface'


export const frontEndState: FrontEndState = observable(getInitialState())


export function getInitialState(): FrontEndState{
  return {
    serverUIState: {
      serverPreGameUIState: undefined,
      serverGameUIState: undefined
    },
    clientUIState: {
      isConnectedToWebsocketServer: false,
      isConnectedToGameHost: false,
      clientPreGameUIState: {
        clientId: undefined,
        clientName: undefined
      },
      clientGameUIState: {
        clientManagerUIState: {
          activeModal: undefined,
          selectListActive: undefined
        }
      }
    }
  }
}