import './test.scss'
import gsap from 'gsap'

const newsItemsCount = 4
const container = document.querySelector('.container')

for(let i = 0; i < newsItemsCount; i++){
  const newsElem: HTMLImageElement = document.createElement('img')
  newsElem.className += 'news-paper'
  newsElem.id = 'news-paper'+i
  newsElem.src = '/source-code/client/images/pre-fight/news-bg.jpg'
  container.appendChild(newsElem)
}

const newItemAnimations =  gsap.timeline()

for(let i = 0; i < newsItemsCount; i++){
  console.log('add one');
  newItemAnimations
    .add(tumbleIntoView('news-paper'+i))
    .add(waitForReadTime('news-paper'+i))
    .add(getRidOfIt('news-paper'+i))
}
newItemAnimations.play()



function tumbleIntoView(id){
  console.log('ding');
  return gsap.timeline()
  .to('#'+id, {
    display: 'block',
    transform: 'scale(1)',
    right: '0%',
    top: '0%',
    width: 500,
    duration: .3  
  }, "-=2")
}
function waitForReadTime(id){
  return gsap.timeline().to('#'+id, {duration: 3})
}
function getRidOfIt(id){
  console.log('get rid of it');
  return gsap.timeline()
  .to('#'+id, {
    opacity: '0',
    right: '-100%', 
    transform: 'scale(.5)', 
    duration: .5  
  })
  .to('#'+id, {
    display: 'none'
  })

}
