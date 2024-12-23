import { useEffect, useRef, useState } from "react"

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewportHeight, setViewportHeight] = useState<number>()
  const [fullScreenAvailable, setFullScreenAvailable] = useState(false)
  const appRef = useRef<HTMLDivElement>(null)

  const updateHeight = () => {
    setViewportHeight(window.innerHeight)
  }

  const requestFullscreen = () => {
    if (appRef.current) {
      const nativeRequestFullscreen = appRef.current.requestFullscreen
      const webkitRequestFullscreen = (appRef.current as any)
        .webkitRequestFullscreen

      if (nativeRequestFullscreen) {
        nativeRequestFullscreen.call(appRef.current).catch((err: any) => {
          console.error("Error requesting fullscreen:", err)
        })
      } else if (webkitRequestFullscreen) {
        webkitRequestFullscreen.call(appRef.current).catch((err: any) => {
          console.error("Error requesting fullscreen (webkit):", err)
        })
      }
    } else {
      console.warn("No element available to request fullscreen.")
    }
  }

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }

  const isMobileDevice = () => {
    return (
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    )
  }

  const showFullScreenButton = () => {
    return isMobileDevice() && fullScreenAvailable && !isFullscreen
  }

  useEffect(() => {
    // Track viewport height changes
    window.addEventListener("resize", updateHeight)
    window.addEventListener("orientationchange", updateHeight)
    updateHeight()

    // Cleanup listeners
    return () => {
      window.removeEventListener("resize", updateHeight)
      window.removeEventListener("orientationchange", updateHeight)
    }
  }, [])

  useEffect(() => {
    // Check for fullscreen availability
    if (appRef.current) {
      const requestFullscreen = appRef.current.requestFullscreen
      const webkitRequestFullscreen = (document.documentElement as HTMLElement)
        .webkitRequestFullscreen

      setFullScreenAvailable(!!(requestFullscreen || webkitRequestFullscreen))
    }
  }, [appRef])

  useEffect(() => {
    // Listen for fullscreen changes
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

  return {
    appRef,
    isFullscreen,
    viewportHeight,
    fullScreenAvailable,
    requestFullscreen,
    showFullScreenButton,
  }
}
