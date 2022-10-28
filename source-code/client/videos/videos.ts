
import sinisterVictoryVideo from 'url:./sinister-victory.mp4'
import wealthVictoryVideo from 'url:./wealth-victory.mp4'

import failSinisterVictoryVideo1 from 'url:./fail-sinister-victory1.mp4'
import failSinisterVictoryVideo2 from 'url:./fail-sinister-victory2.mp4'
import finalTournament from 'url:./final-tournament.mp4'
import dominationVictory from 'url:./domination-victory.mp4'

import defaultVictoryVideo from 'url:./default-victory.mp4'

export type VideoName = 'Sinister Victory' | 'Sinister Victory Fail' | 'Wealth Victory' | 'Domination Victory' | 'Wealth Victory Fail' | 'Final Tournament' | 'Default Victory'

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
    name: 'Final Tournament',
    videos:[{
      source: finalTournament,
      duration: 21
    }]
  },
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
      duration: 50
    }]
  },
  {
    name: 'Wealth Victory Fail',
    videos:[{
      source: wealthVictoryVideo,
      duration: 50
    }]
  },
  {
    name: 'Default Victory',
    videos:[{
      source: defaultVictoryVideo,
      duration: 35
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
      source: dominationVictory,
      duration: 37
    }]
  },
]