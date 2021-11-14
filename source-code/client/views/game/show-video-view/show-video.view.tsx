import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { FrontEndState } from '../../../../interfaces/front-end-state-interface';
import { connect } from 'react-redux';
import { randomFloor } from '../../../../helper-functions/helper-functions';
import {getVideos, VideoName} from '../../../videos/videos';

const ShowVideo_View = ({showVideo}: {showVideo: VideoName}) => {
  const videos = getVideos()
  console.log(videos)
  useEffect(() => {
    (videoElement.current as HTMLVideoElement).play()
  }, [])
  const videoElement = useRef()
  const relevantVideos = videos?.find(v => 
    v.name == showVideo
  ).videos
  const randomIndex = randomFloor(relevantVideos.length)
  const video = relevantVideos[randomIndex].source

  return <>
    <video 
      style={{width: '100%'}}
      src={video}
      ref={videoElement}
    />
  </>
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {showVideo}}
}: FrontEndState) => ({showVideo})

export default hot(connect(mapStateToProps)(ShowVideo_View))