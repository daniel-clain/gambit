import { CSSProperties, useLayoutEffect, useRef } from "react"
import { SelectedVideo } from "../../../../interfaces/front-end-state-interface"
import { getVideos } from "../../../videos/videos"

export const ShowVideo_View = ({
  selectedVideo,
}: {
  selectedVideo: SelectedVideo
}) => {
  const videos = getVideos()
  console.log(videos)

  const videoElement = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    videoElement.current?.play()
  }, [])

  const relevantVideos = videos?.find(
    (v) => v.name == selectedVideo.name
  )!.videos

  const video = relevantVideos[selectedVideo.index].source

  console.log(`${selectedVideo.name} - ${video}`)

  return (
    <div>
      <div>
        <h1 style={headingStyle}>
          {selectedVideo.name}: {selectedVideo.sourceManager.name}
        </h1>
      </div>
      <video style={{ width: "100%" }} src={video} ref={videoElement} />
    </div>
  )
}

const headingStyle: CSSProperties = {
  fontSize: "20px",
  color: "#ff405c",
  fontWeight: "bold",
  position: "absolute",
  margin: 10,
  textShadow: "1px 1px 3px black",
}
