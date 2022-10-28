

import arenaBehind from './fight-view/arena/fight-arena-behind.png'
import arenaInFront from './fight-view/arena/fight-arena-in-front.png'
import fightBanner from './fight-view/fight.png'

import loginBg from './login-bg.jpg'
import preGameBg from './pre-game/pre-game-bg.jpg'
import createButton from './pre-game/create-button.png'

import managerViewBg from './manager-view/bg.jpg'
import report from './manager-view/report.png'

import assault from './manager-view/abilities/assault-fighter.jpg'
import surveillance from './manager-view/abilities/do-surveillance.jpg'
import dope from './manager-view/abilities/dope-fighter.png'
import gatherEvidence from './manager-view/abilities/gather-evidence.png'
import guard from './manager-view/abilities/guard-fighter.jpg'
import murder from './manager-view/abilities/murder-fighter.jpg'
import contract from './manager-view/abilities/offer-contract.png'
import poison from './manager-view/abilities/poison-fighter.jpg'
import promote from './manager-view/abilities/promote-fighter.png'
import research from './manager-view/abilities/research-fighter.png'
import sellDrugs from './manager-view/abilities/sell-drugs.jpg'
import sueManager from './manager-view/abilities/sue-manager.jpg'
import train from './manager-view/abilities/train-fighter.png'


import defaultBlocking from './fight-view/fighter/default-skin/blocking.png'
import defaultDefending from './fight-view/fighter/default-skin/defending.png'
import defaultDodging from './fight-view/fighter/default-skin/dodging.png'
import defaultKicking from './fight-view/fighter/default-skin/kicking.png'
import defaultKnockedOut from './fight-view/fighter/default-skin/knocked-out.png'
import defaultPunching from './fight-view/fighter/default-skin/punching.png'
import defaultRecovering from './fight-view/fighter/default-skin/recovering.png'
import defaultTakingHit from './fight-view/fighter/default-skin/taking-hit.png'
import defaultVictory from './fight-view/fighter/default-skin/victory.png'
import defaultWalking from './fight-view/fighter/default-skin/walking.png'

import muscleBlocking from './fight-view/fighter/muscle-skin/blocking.png'
import muscleDefending from './fight-view/fighter/muscle-skin/defending.png'
import muscleDodging from './fight-view/fighter/muscle-skin/dodging.png'
import muscleKicking from './fight-view/fighter/muscle-skin/kicking.png'
import muscleKnockedOut from './fight-view/fighter/muscle-skin/knocked-out.png'
import musclePunching from './fight-view/fighter/muscle-skin/punching.png'
import muscleRecovering from './fight-view/fighter/muscle-skin/recovering.png'
import muscleTakingHit from './fight-view/fighter/muscle-skin/taking-hit.png'
import muscleVictory from './fight-view/fighter/muscle-skin/victory.png'
import muscleWalking from './fight-view/fighter/muscle-skin/walking.png'
import muscleIdle from './fight-view/fighter/muscle-skin/idle.png'

import fastBlocking from './fight-view/fighter/fast-skin/blocking.png'
import fastDefending from './fight-view/fighter/fast-skin/defending.png'
import fastDodging from './fight-view/fighter/fast-skin/dodging.png'
import fastKicking from './fight-view/fighter/fast-skin/kicking.png'
import fastKnockedOut from './fight-view/fighter/fast-skin/knocked-out.png'
import fastPunching from './fight-view/fighter/fast-skin/punching.png'
import fastRecovering from './fight-view/fighter/fast-skin/recovering.png'
import fastTakingHit from './fight-view/fighter/fast-skin/taking-hit.png'
import fastVictory from './fight-view/fighter/fast-skin/victory.png'
import fastWalking from './fight-view/fighter/fast-skin/walking.png'
import FighterModelState from '../../types/fighter/fighter-model-states'
import fastIdle from './fight-view/fighter/fast-skin/idle.png'


import mainEventBg from './pre-fight/main-event-bg.jpg';
import preFightNewsBg from './pre-fight/pre-fight-news-bg.jpg';
import newsBg from './pre-fight/after-training.png';
import mainEventNext from './pre-fight/main-event-small.jpg';
import afterTraining from './pre-fight/after-training.png';
import assaulted from './pre-fight/assaulted.jpg';
import doped from './pre-fight/doped.jpg';
import drugOverdose from './pre-fight/drug-overdose.jpg';
import guarded from './pre-fight/guarded.png';
import murdered from './pre-fight/murder-news.jpg';
import sick from './pre-fight/sick.png';
import hallucinate from './pre-fight/hallucinate.jpg';



export type FighterImageObj = {
  modelState: FighterModelState,
  image: any
}

export const defaultFighterImages: FighterImageObj[] = [
  { modelState: 'Blocking', image: defaultBlocking },  
  { modelState: 'Defending', image: defaultDefending },
  { modelState: 'Dodging', image: defaultDodging },
  { modelState: 'Kicking', image: defaultKicking },
  { modelState: 'Knocked Out', image: defaultKnockedOut },
  { modelState: 'Punching', image: defaultPunching },
  { modelState: 'Recovering', image: defaultRecovering },
  { modelState: 'Victory', image: defaultVictory },
  { modelState: 'Walking', image: defaultWalking },
  { modelState: 'Idle', image: defaultWalking },
  { modelState: 'Taking Hit', image: defaultTakingHit }
]

export const muscleFighterImages: FighterImageObj[] = [
  { modelState: 'Blocking', image: muscleBlocking },
  { modelState: 'Defending', image: muscleDefending },
  { modelState: 'Dodging', image: muscleDodging },
  { modelState: 'Kicking', image: muscleKicking },
  { modelState: 'Knocked Out', image: muscleKnockedOut },
  { modelState: 'Punching', image: musclePunching },
  { modelState: 'Recovering', image: muscleRecovering },
  { modelState: 'Victory', image: muscleVictory },
  { modelState: 'Walking', image: muscleWalking },
  { modelState: 'Idle', image: muscleIdle },
  { modelState: 'Taking Hit', image: muscleTakingHit }
]

export const fastFighterImages: FighterImageObj[] = [
  { modelState: 'Blocking', image: fastBlocking },
  { modelState: 'Defending', image: fastDefending },
  { modelState: 'Dodging', image: fastDodging },
  { modelState: 'Kicking', image: fastKicking },
  { modelState: 'Knocked Out', image: fastKnockedOut },
  { modelState: 'Punching', image: fastPunching },
  { modelState: 'Recovering', image: fastRecovering },
  { modelState: 'Victory', image: fastVictory },
  { modelState: 'Walking', image: fastWalking },
  { modelState: 'Idle', image: fastIdle },
  { modelState: 'Taking Hit', image: fastTakingHit }
]


export const fightUiImages = [
  ...defaultFighterImages.map(imageObj => imageObj.image),
  ...fastFighterImages.map(imageObj => imageObj.image),
  ...muscleFighterImages.map(imageObj => imageObj.image),
  fightBanner,
  arenaBehind, 
  arenaInFront
]

export const images = {
  ...fightUiImages,
  loginBg,
  preGameBg,
  createButton,
  managerViewBg,
  report,
  assault,
  surveillance,
  dope,
  gatherEvidence,
  guard, 
  murder,
  contract,
  poison,
  promote,
  research,
  sellDrugs,
  sueManager,
  train,

  newsBg,
  mainEventBg,
  preFightNewsBg,
  afterTraining,
  mainEventNext,
  assaulted,
  doped,
  drugOverdose,
  guarded,
  murdered,
  sick,
  hallucinate
}