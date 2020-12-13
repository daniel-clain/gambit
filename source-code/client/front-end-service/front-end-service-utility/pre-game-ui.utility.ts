
import { FrontEndService } from '../front-end-service';

export interface PreGameUIUtility{
  connectToGameHost()
}

const getPreGameUIUtility = (FES: FrontEndService ): PreGameUIUtility => {
  return {
    connectToGameHost
  }


  function connectToGameHost(){
    let {clientName, clientId} = FES.frontEndStore.getState().clientUIState.clientPreGameUIState

    FES.sendUpdate(
      {
        name: 'Connect To Game Host',
        data: {name:  clientName, id: clientId}
      }
    )
  }
}

export default getPreGameUIUtility