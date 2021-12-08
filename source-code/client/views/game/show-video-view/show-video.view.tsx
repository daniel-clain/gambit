import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { FrontEndState, SelectedVideo } from '../../../../interfaces/front-end-state-interface';
import { connect } from 'react-redux';
import { randomFloor } from '../../../../helper-functions/helper-functions';
import {getVideos, VideoName} from '../../../videos/videos';

const ShowVideo = ({selectedVideo: {name, index}}: {selectedVideo: SelectedVideo}) => {
  const videos = getVideos()
  console.log(videos)
  useEffect(() => {
    (videoElement.current as HTMLVideoElement).play()
  }, [])
  const videoElement = useRef()
  const relevantVideos = videos?.find(v => 
    v.name == name
  ).videos
  const video = relevantVideos[index].source

  return <>
    <video 
      style={{width: '100%'}}
      src={video}
      ref={videoElement}
    />
  </>
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {selectedVideo}}
}: FrontEndState) => ({selectedVideo})

export const ShowVideo_View = hot(connect(mapStateToProps)(ShowVideo))