import { observer } from "mobx-react"
import { useEffect } from "react"
import { initialSetup } from "../../front-end-service/front-end-service"
import { frontEndState } from "../../front-end-state/front-end-state"
import "../../styles/global.scss"
import { Game_View } from "../../views/game/game.view"
import { Lobby_View } from "../../views/pre-game/lobby.view"
import { Login_View } from "../../views/pre-game/login.view"

initialSetup()

export const MainGame_C = observer(() => {
  useEffect(() => {
    // This will scroll the page down slightly to hide the address bar
    if (window.scrollY === 0) {
      window.scrollTo(0, 1)
    }
  }, [])
  const {
    clientUIState: {
      isConnectedToGameHost,
      isConnectedToWebsocketServer,
      clientPreGameUIState: { hasGameData },
    },
  } = frontEndState

  return hasGameData ? (
    <Game_View />
  ) : isConnectedToWebsocketServer && isConnectedToGameHost ? (
    <Lobby_View />
  ) : (
    <Login_View />
  )
})
