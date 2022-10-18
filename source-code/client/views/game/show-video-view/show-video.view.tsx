import * as React from 'react';
import { useEffect, useRef } from 'react';
import {getVideos} from '../../../videos/videos';
import { frontEndState } from '../../../front-end-state/front-end-state';
import {observer} from 'mobx-react'

export const ShowVideo_View = observer(() => {
  const {selectedVideo} = frontEndState.serverUIState.serverGameUIState
  const videos = getVideos()
  console.log(videos)

  useEffect(() => {
    (videoElement.current as HTMLVideoElement).play()
  }, [])

  const videoElement = useRef()

  const relevantVideos = videos?.find(v => 
    v.name == selectedVideo.name
  ).videos

  const video = relevantVideos[selectedVideo.index].source

  console.log(`${selectedVideo.name} - ${video}`);

  return <>
    <video 
      style={{width: '100%'}}
      src={video}
      ref={videoElement}
    />
  </>
})