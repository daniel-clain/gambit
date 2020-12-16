import * as React from 'react'
import './pre-fight-news.view.scss'
import {connect} from 'react-redux'
import { NewsType } from '../../../../types/game/news-type'
import { NewsItem } from '../../../../types/game/news-item'
import { FrontEndState } from '../../../front-end-state/front-end-state'

export interface PreFightNewsProps{
  newsItem: NewsItem
}

const PreFightNews_View = ({
  newsItem
}: PreFightNewsProps) => {

  if(!newsItem) return <div></div>
  return (
    <div className="pre-fight-news">
      <div className="pre-fight-news__background"></div>
        
      <div className="news-item">
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
      newsType == 'fighter was poisoned' ? 'poisoned' :
      newsType == 'fighter is doped up' ? 'doped' :
      newsType == 'fighter has gone up in strength or fitness' ? 'after-training' :
    'guarded'
    )
  }
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {preFightNewsUiData: {newsItem}}}
}: FrontEndState): PreFightNewsProps => ({newsItem})

export default connect(mapStateToProps)(PreFightNews_View)
  