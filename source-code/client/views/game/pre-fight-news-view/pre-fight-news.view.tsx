import * as React from 'react'
import './pre-fight-news.view.scss'
import {connect} from 'react-redux'
import { NewsType } from '../../../../types/game/news-type'
import { NewsItem } from '../../../../types/game/news-item'
import { FrontEndState } from '../../../../interfaces/front-end-state-interface'
import { useEffect, useState } from 'react'
import { time } from 'node:console'

export interface PreFightNewsProps{
  newsItem: NewsItem
}

const PreFightNews_View = ({
  newsItem
}: PreFightNewsProps) => {

  const [showNewsItem, setShowNewsItem] = useState(false)

  useEffect(() => {
    setShowNewsItem(false)
    let timeout = setTimeout(() => {
      setShowNewsItem(true)
    }, 100);
    return () => clearTimeout(timeout)
  }, [newsItem])

  if(!newsItem) return <div></div>
  return (
    <div className="pre-fight-news">
      <div className="pre-fight-news__background"></div>
        
      <div className={`news-item ${showNewsItem ? 'is-showing' : ''}`}>
        <div  className="news-item__news-paper-heading">Fight News</div>
        <div className="news-item__article-heading">{newsItem.headline}</div>
        <div className="news-item__message">
          {newsItem.message}
        </div>
        <div className={`news-item__image news-item__image--${getImage(newsItem.newsType)}`}></div>
      </div>  
    </div>
  )

  function getImage(newsType: NewsType): string{
    return (
      newsType == 'fighter was assaulted' ? 'assaulted' :
      newsType == 'fighter murdered' ? 'murdered' :
      newsType == 'fighter died from poison' ? 'poisoned' :
      newsType == 'fighter is hallucinating' ? 'hallucinating' :
      newsType == 'fighter is sick' ? 'sick' :
      newsType == 'fighter is doped up' ? 'doped' :
      newsType == 'fighter has gone up in strength or fitness' ? 'after-training' :
      newsType == 'manager prosecuted' ? 'manager-prosecuted' :
      newsType == 'fight event next week' ? 'main-event' :
    'guarded'
    )
  }
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {preFightNewsUIState: {newsItem}}}
}: FrontEndState): PreFightNewsProps => ({newsItem})

export default connect(mapStateToProps)(PreFightNews_View)
  