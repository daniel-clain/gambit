import failWealthVictoryVideo from "url:./fail-wealth-victory.mp4"
import sinisterVictoryVideo from "url:./sinister-victory.mp4"
import wealthVictoryVideo from "url:./wealth-victory.mp4"

import dominationVictory from "url:./domination-victory.mp4"
import failSinisterVictoryVideo1 from "url:./fail-sinister-victory1.mp4"
import failSinisterVictoryVideo2 from "url:./fail-sinister-victory2.mp4"
import finalTournament from "url:./final-tournament.mp4"

import defaultVictoryVideo from "url:./default-victory.mp4"
import gameConfiguration from "../../game-settings/game-configuration"
import { VideoData } from "../../types/game/video-names"

export const getVideos = (): VideoData[] => [
  {
    name: "Final Tournament",
    videos: [
      {
        source: finalTournament,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Final Tournament"
        )!.videos[0].duration,
      },
    ],
  },
  {
    name: "Sinister Victory",
    videos: [
      {
        source: sinisterVictoryVideo,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Sinister Victory"
        )!.videos[0].duration,
      },
    ],
  },
  {
    name: "Wealth Victory",
    videos: [
      {
        source: wealthVictoryVideo,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Wealth Victory"
        )!.videos[0].duration,
      },
    ],
  },
  {
    name: "Wealth Victory Fail",
    videos: [
      {
        source: failWealthVictoryVideo,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Wealth Victory Fail"
        )!.videos[0].duration,
      },
    ],
  },
  {
    name: "Sinister Victory Fail",
    videos: [
      {
        source: failSinisterVictoryVideo1,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Sinister Victory Fail"
        )!.videos[0].duration,
      },
      {
        source: failSinisterVictoryVideo2,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Sinister Victory Fail"
        )!.videos[1].duration,
      },
    ],
  },
  {
    name: "Domination Victory",
    videos: [
      {
        source: dominationVictory,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Domination Victory"
        )!.videos[0].duration,
      },
    ],
  },
  {
    name: "Default Victory",
    videos: [
      {
        source: defaultVictoryVideo,
        duration: gameConfiguration.videos.find(
          (v) => v.name == "Default Victory"
        )!.videos[0].duration,
      },
    ],
  },
]
