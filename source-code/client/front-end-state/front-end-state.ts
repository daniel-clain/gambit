import { autorun, observable, reaction } from 'mobx'
import { FrontEndState } from '../../interfaces/front-end-state-interface'


export const frontEndState: FrontEndState = observable(getInitialState())


function getInitialState(): FrontEndState{
  return {
    serverUIState: {
      serverPreGameUIState: undefined,
      serverGameUIState: undefined
    },
    clientUIState: {
      clientPreGameUIState: {},
      clientGameUIState: {
        clientManagerUIState: {}
      }
    }
  }
}