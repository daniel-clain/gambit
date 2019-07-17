import { ClientUIState } from "../client/client";

const defaultUiState: ClientUIState = {
  views: {
    gameLobby: {
      props: {
        isActive: true,
        connected: false
      }
    },
    managerOptions: null,
    fightEvent: null
  }
}

export default defaultUiState