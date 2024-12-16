import { useEffect, useState } from "react"

interface Asset {
  url: string
  type: "image" | "video"
  hash: string
}

const assets: Asset[] = [
  { url: "../game", type: "image", hash: "v1" },
  { url: "/images/manager-view/bg.jpg", type: "image", hash: "v1" },
  {
    url: "/images/manager-view/abilities/assault-fighter.jpg",
    type: "image",
    hash: "v1",
  },
  { url: "/images/fight-view/fight.mp4", type: "video", hash: "v1" },
  // Add more assets here
]

type Props = {
  onComplete: () => void
}
export function Preloader({ onComplete }: Props): JSX.Element {
  const [loaded, setLoaded] = useState<number>(0)
  const total = assets.length
  const [isLoading, setIsLoading] = useState<boolean>(true)

  function preloadImage(asset: Asset): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = `${asset.url}?hash=${asset.hash}`
      img.onload = () => resolve()
      img.onerror = () => reject()
    })
  }

  function preloadVideo(asset: Asset): Promise<void> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.src = `${asset.url}?hash=${asset.hash}`
      video.onloadeddata = () => resolve()
      video.onerror = () => reject()
    })
  }

  useEffect(() => {
    async function preloadAssets(): Promise<void> {
      try {
        for (const asset of assets) {
          if (asset.type === "image") {
            await preloadImage(asset)
          } else if (asset.type === "video") {
            await preloadVideo(asset)
          }
          setLoaded((prev) => prev + 1)
        }
        setIsLoading(false)
        onComplete()
      } catch (error) {
        console.error("Error preloading assets:", error)
      }
    }

    preloadAssets()
  }, [onComplete])

  const progress: number = Math.round((loaded / total) * 100)

  return (
    <div style={styles.loaderContainer}>
      {isLoading && (
        <>
          <h1>Loading Assets</h1>
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
          </div>
          <p>{progress}%</p>
        </>
      )}
    </div>
  )
}

// Inline styles for simplicity
const styles: { [key: string]: React.CSSProperties } = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#333",
    color: "#fff",
  },
  progressBarContainer: {
    width: "80%",
    height: "20px",
    backgroundColor: "#555",
    borderRadius: "10px",
    overflow: "hidden",
    margin: "20px 0",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    transition: "width 0.3s ease-in-out",
  },
}
