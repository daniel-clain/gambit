

export interface ClientPreGameUIState{
  clientId: string
  clientName: string
  clientType: 'Player' | 'Display'
}


const initialPreGameUIState: ClientPreGameUIState = {
  clientId: getClientid(),
  clientName: localStorage.getItem('name'),
  clientType: localStorage.getItem('name') ? 'Player': undefined
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

export type ClientPreUIGameActionType = 'Set Name'

interface PreGameUIAction {
  type: ClientPreUIGameActionType,
  payload?: any
}

export const clientPreGameUIReducer = (clientPreGameUIState: ClientPreGameUIState = initialPreGameUIState, {type, payload}: PreGameUIAction): ClientPreGameUIState => {
  switch (type){
    case 'Set Name': return {...clientPreGameUIState, clientName: payload}
    default: return clientPreGameUIState
  }
}