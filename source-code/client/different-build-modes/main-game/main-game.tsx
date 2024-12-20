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
  const [viewportHeight, setViewportHeight] = useState<number>()
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false)

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    window.addEventListener("resize", updateHeight)
    window.addEventListener("orientationchange", updateHeight)

    // Set initial height
    updateHeight()

    // Cleanup event listeners
    return () => {
      window.removeEventListener("resize", updateHeight)
      window.removeEventListener("orientationchange", updateHeight)
    }
  }, [])

  const isMobileDevice = () => {
    return (
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    )
  }
  console.log("isMobileDevice", isMobileDevice())

  useEffect(() => {
    runInAction(() => {
      frontEndState.clientUIState.gameAssetsLoaded = true
    })
  }, [])

  const appRef = useRef<HTMLDivElement>(null)

  const requestFullscreen = () => {
    if (appRef.current) {
      // Check for requestFullscreen in non-iOS devices (like Android, etc.)
      const requestFullscreen = appRef.current.requestFullscreen

      // WebKit-based browsers (Safari, Chrome on iOS)
      const webkitRequestFullscreen = (document.documentElement as HTMLElement)
        .webkitRequestFullscreen

      // Standard fullscreen (for most browsers)
      if (!!requestFullscreen) {
        appRef.current.requestFullscreen().catch((err) => {
          alert("Error requestFullscreen: " + err)
        })
      }
      // WebKit-based fullscreen (for Safari on iOS)
      else if (!!webkitRequestFullscreen) {
        webkitRequestFullscreen().catch((err) => {
          alert("Error webkitRequestFullscreen: " + err)
        })
      }
    } else {
      alert("No element found for fullscreen.")
    }
  }
  const handleFullscreenChange = (e: any) => {
    console.log("e", e)
    if (document.fullscreenElement) {
      setIsFullscreen(true)
    } else {
      setFullScreenAvailable(false)
    }
  }

  useEffect(() => {
    if (appRef.current) {
      const requestFullscreen = appRef.current.requestFullscreen

      // WebKit-based browsers (Safari, Chrome on iOS)
      const webkitRequestFullscreen = (document.documentElement as HTMLElement)
        .webkitRequestFullscreen

      if (!!requestFullscreen || !!webkitRequestFullscreen) {
        setFullScreenAvailable(true)
      } else {
        setViewportHeight(window.innerHeight)
      }
    }
  }, [appRef.current])
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      )
    }
  }, [])

  const {
    clientUIState: {
      gameAssetsLoaded,
      isConnectedToGameHost,
      isConnectedToWebsocketServer,
      clientPreGameUIState: { hasGameData },
    },
  } = frontEndState

  const showFullScreenButton =
    isMobileDevice() && fullScreenAvailable && !isFullscreen

  return (
    <div
      ref={appRef}
      id="root"
      style={{
        height: viewportHeight ? `${viewportHeight}px` : "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "black",
      }}
    >
      {showFullScreenButton && (
        <button onClick={requestFullscreen}>full screen</button>
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
