import {fightUiImages, images} from '../images/images';


const preLoadImages = async (fightUiOnly?: boolean) => {
  const preloadImages = fightUiOnly ? fightUiImages : images

  await Promise.all(preloadImages.map(i => new Promise(r => {
    const image = new Image()
    image.src = i
    image.onload = r
  })))
}

export {preLoadImages}