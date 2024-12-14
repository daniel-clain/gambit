export type VideoName =
  | "Sinister Victory"
  | "Sinister Victory Fail"
  | "Wealth Victory"
  | "Domination Victory"
  | "Wealth Victory Fail"
  | "Final Tournament"
  | "Default Victory"

export type VideoData = {
  name: VideoName
  videos: VideoInfo[]
}

type VideoInfo = {
  source: string
  duration: number
}
