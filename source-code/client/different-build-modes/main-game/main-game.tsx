import { runInAction } from "mobx"
import { observer } from "mobx-react"
import { useEffect, useRef, useState } from "react"
import { initialSetup } from "../../front-end-service/front-end-service"
import { frontEndState } from "../../front-end-state/front-end-state"
import "../../styles/global.scss"
import { Game_View } from "../../views/game/game.view"
import { Lobby_View } from "../../views/pre-game/lobby.view"
import { Login_View } from "../../views/pre-game/login.view"

initialSetup()

export const MainGame_C = observer(() => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent)
  console.log("isMobileDevice", isMobileDevice)

  useEffect(() => {
    runInAction(() => {
      frontEndState.clientUIState.gameAssetsLoaded = true
    })
  }, [])

  const appRef = useRef<HTMLDivElement>(null)

  const requestFullscreen = () => {
    if (appRef.current) {
      appRef.current.requestFullscreen()
    }
    // Safari and older WebKit-based browsers
    else if ((appRef.current as any).webkitRequestFullscreen) {
      ;(appRef.current as any).webkitRequestFullscreen()

      alert("webkit fullscreen")
    }
  }
  const handleFullscreenChange = (e: any) => {
    console.log("e", e)
    if (document.fullscreenElement) {
      setIsFullscreen(true)
    } else {
      setIsFullscreen(false)
    }
  }
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const {
    clientUIState: {
      gameAssetsLoaded,
      isConnectedToGameHost,
      isConnectedToWebsocketServer,
      clientPreGameUIState: { hasGameData },
    },
  } = frontEndState

  const showFullScreenButton = isMobileDevice && !isFullscreen

  return (
    <div
      ref={appRef}
      id="root"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "black",
      }}
    >
      {showFullScreenButton ? (
        <button onClick={requestFullscreen}>App requires full screen</button>
      ) : gameAssetsLoaded && hasGameData ? (
        <Game_View />
      ) : isConnectedToWebsocketServer && isConnectedToGameHost ? (
        <Lobby_View />
      ) : (
        <Login_View />
      )}
    </div>
  )
})
