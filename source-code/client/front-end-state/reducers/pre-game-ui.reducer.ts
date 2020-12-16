

export interface ClientPreGameUIState{
  clientId: string
  clientName: string
}


const initialPreGameUIState: ClientPreGameUIState = {
  clientId: getClientid(),
  clientName: localStorage.getItem('name')
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

export type ClientPreUIGameActionType = 'Set Name' | 'Set Client Is Game Display'

export interface PreGameUIAction {
  type: ClientPreUIGameActionType
  payload?: any
}

export const clientPreGameUIReducer = (clientPreGameUIState: ClientPreGameUIState = initialPreGameUIState, {type, payload}: PreGameUIAction): ClientPreGameUIState => {
  switch (type){
    case 'Set Name': {      
      if(payload && payload != ''){
        localStorage.setItem('name', payload)
        return {...clientPreGameUIState, clientName: payload}
      }
    }
    case 'Set Client Is Game Display': return {
      ...clientPreGameUIState, 
      clientName: 'Game Display'
    }

    default: return clientPreGameUIState
  }
}