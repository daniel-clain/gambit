import { observer } from "mobx-react"
import { useEffect } from "react"
import { initialSetup } from "../../front-end-service/front-end-service"
import { frontEndState } from "../../front-end-state/front-end-state"
import "../../styles/global.scss"
import { Game_View } from "../../views/game/game.view"
import { useFullscreen } from "../../views/pre-game/fullscreen-hook"
import { Lobby_View } from "../../views/pre-game/lobby.view"
import { Login_View } from "../../views/pre-game/login.view"
import { registerServiceWorker } from "./service-worker-utils"

initialSetup()

export const MainGame_C = observer(() => {
  const { appRef, viewportHeight, requestFullscreen, showFullScreenButton } =
    useFullscreen()

  useEffect(() => {
    registerServiceWorker()
  }, [])

  const {
    clientUIState: {
      gameAssetsLoaded,
      isConnectedToGameHost,
      isConnectedToWebsocketServer,
      clientPreGameUIState: { hasGameData },
    },
  } = frontEndState

  return (
    <div
      ref={appRef}
      id="root"
      style={{
        height: viewportHeight ? `${viewportHeight}px` : "100vh",
        width: "100vw",
        background: "black",
      }}
    >
      {showFullScreenButton() && (
        <button onClick={requestFullscreen}>Enter Fullscreen</button>
      )}
      {gameAssetsLoaded && hasGameData ? (
        <Game_View />
      ) : isConnectedToWebsocketServer && isConnectedToGameHost ? (
        <Lobby_View />
      ) : (
        <Login_View />
      )}
    </div>
  )
})
