import { ClientPreGameUIState } from "../../../interfaces/front-end-state-interface"
import { SetStatePreGameUIFunctionName } from "../../front-end-service/front-end-service-types"




const initialPreGameUIState: ClientPreGameUIState = {
  clientId: getClientid(),
  clientName: localStorage.getItem('clientName')
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


export type SetStatePreGameUIAction = {
  type: SetStatePreGameUIFunctionName
  payload?
}

export type SetStatePreGameUI = {
  setName(name: string)
}

const setStatePreGameUI: SetStatePreGameUI ={
  setName: clientName => {
    localStorage.setItem('clientName', clientName)
    return {clientName}
  }
}



export interface SetStateePreGameUIAction {
  type: SetStatePreGameUIFunctionName
  payload?: any
}
export const clientPreGameUIReducer = (
  clientPreGameUIState: ClientPreGameUIState = initialPreGameUIState, 
  {type, payload }: SetStatePreGameUIAction
): ClientPreGameUIState => setStatePreGameUI?.[type] ? ({
  ...clientPreGameUIState, ...setStatePreGameUI[type](payload)
}) : clientPreGameUIState
