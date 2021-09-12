import { NewsType } from "./news-type";

export type NewsItem = {
  newsType: NewsType
  message: string
  headline: string
  duration?: number
}