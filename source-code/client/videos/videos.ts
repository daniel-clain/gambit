import { VictoryType } from "../../types/game/victory-type";
import sinisterVictoryVideo from './sinister-victory.mp4'
import wealthVictoryVideo from './wealth-victory.mp4'
//import dominationVictoryVideo from './domination-victory.mp4'
import failSinisterVictoryVideo1 from './fail-sinister-victory1.mp4'
import failSinisterVictoryVideo2 from './fail-sinister-victory2.mp4'
//import dominationVictory from './domination-victory.mp4'

export type VideoName = 'Sinister Victory' | 'Sinister Victory Fail' | 'Wealth Victory' | 'Domination Victory' | 'Wealth Victory Fail'

type VideoInfo = {
  source: string,
  duration: number
}
export type VideoData = {
  name: VideoName
  videos: VideoInfo[]
}

export const getVideos = (): VideoData[] => [
  {
    name: 'Sinister Victory',
    videos:[{
      source: sinisterVictoryVideo,
      duration: 78
    }]
  },
  {
    name: 'Wealth Victory',
    videos:[{
      source: wealthVictoryVideo,
      duration: 32
    }]
  },
  {
    name: 'Sinister Victory Fail',
    videos:[{
      source: failSinisterVictoryVideo1,
      duration: 66
    },{
      source: failSinisterVictoryVideo2,
      duration: 45
    }]
  },
  {
    name: 'Domination Victory',
    videos:[{
      source: null,//dominationVictory,
      duration: 37
    }]
  },
]