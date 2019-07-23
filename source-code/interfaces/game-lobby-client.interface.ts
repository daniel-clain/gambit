import ClientName from '../types/client-name.type';

import ClientId from '../types/client-id.type';

export default interface GameLobbyClient{
  name: ClientName
  id: ClientId
  ready: boolean
}