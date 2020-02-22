import ClientId from "../../types/client-id.type";


export interface PlayerReadyToggle{
  ready: boolean
  clientId?: ClientId
}