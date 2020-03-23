import * as React from 'react'
import './pre-fight-news.scss'
import { PreFightNewsUiData } from '../../../../../interfaces/game-ui-state.interface'
import gsap from 'gsap'
import gameConfiguration from '../../../../../game-settings/game-configuration'


export interface PreFightNewsProps{
  preFightNewsUiData: PreFightNewsUiData
}

export class PreFightNews extends React.Component<PreFightNewsProps>{

  componentDidMount(){
    this.animateNewsItems()
  }

  animateNewsItems(){
    const holdDuration = gameConfiguration.stageDurations.eachNewsSlide - 1
    const newItemAnimations =  gsap.timeline()

    for(let i = 0; i < this.props.preFightNewsUiData.newsItems.length; i++){
      const elementId = '#news-item'+i
      newItemAnimations
        .add(tumbleIntoView(elementId))
        .add(waitForReadTime(elementId))
        .add(getRidOfIt(elementId))
    }
    newItemAnimations.play()



    function tumbleIntoView(id){
      return gsap.timeline()
      .to(id, {
        display: 'block',
        transform: 'scale(1)',
        right: '0%',
        top: '15%',
        width: 500,
        duration: .3  
      })
    }
    function waitForReadTime(id){
      return gsap.timeline().to(id, {duration: holdDuration})
    }
    function getRidOfIt(id){
      return gsap.timeline()
      .to(id, {
        opacity: '0',
        right: '-100%', 
        transform: 'scale(.5)', 
        duration: .3  
      })
      .to(id, {
        display: 'none'
      })

    }
  }

  render(){
    return (
      <div className="pre-fight-news">
        <div className="pre-fight-news__background"></div>
        {this.props.preFightNewsUiData.newsItems.map((newsItem, i) => {
          const image = 
            newsItem.newsType == 'fighter was assaulted' ? 'assaulted' :
            newsItem.newsType == 'fighter murdered' ? 'murdered' :
            newsItem.newsType == 'fighter was poisoned' ? 'poisoned' :
            newsItem.newsType == 'fighter is doped up' ? 'doped' :
            newsItem.newsType == 'fighter has gone up in strength or fitness' ? 'after-training' :
            'guarded'


          return <div id={'news-item'+i} key={i} className="news-item">
            <div className="news-item__news-paper-heading">Fight News</div>
            <div className="news-item__article-heading">{newsItem.headline}</div>
            <div className="news-item__message">
              {newsItem.message}
            </div>
            <div className={`news-item__image news-item__image--${image}`}></div>
          </div>  
        })}
      </div>
    )
  }
};
