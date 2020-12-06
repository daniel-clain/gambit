


import { DispatchAction } from '../../front-end-state/front-end-state';
import { FrontEndService } from '../front-end-service';

export interface PreGameUIUtility{
  setName(name: string): void
  connectToGameHost()
}

const getPreGameUIUtility = (FES: FrontEndService ): PreGameUIUtility => {
  return {
    setName,
    connectToGameHost
  }

  function setName(name: string){
    const dispatchAction: DispatchAction = {
      type: 'Set Name', 
      payload: name
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }

  function connectToGameHost(){
    let {clientName, clientId} = FES.frontEndStore.getState()
    FES.sendUpdate(
      {
        name: 'Connect To Game Host',
        data: {name:  clientName, id: clientId}
      }
    )
  }
}

export default getPreGameUIUtility