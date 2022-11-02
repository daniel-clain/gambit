import FighterFighting from "./fighter-fighting";
import Animation from "../../../interfaces/game/fighter/animation";
import { AnimationName } from "../../../types/fighter/animation-name";

export default class FighterAnimation{
  constructor(public fighting: FighterFighting){}
  
  inProgress: AnimationName
  
  async start(animation: Animation): Promise<void>{

    const {name, duration, model, sound} = animation
    this.inProgress = name  

    if(sound)
      this.fighting.soundsMade.push({soundName: sound, time: Date.now()})
    if(model)
      this.fighting.modelState = model

    
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration)
    })
    .then(() => {      
      this.inProgress = null
      return        
    })
  }

  cooldown(duration): Promise<void>{
    return this.start({
      name: 'doing cooldown', 
      model: 'Idle',
      duration: this.speedModifier(duration)
    })
  }

  
  speedModifier(baseAnimationSpeed){
    const {speed} = this.fighting.stats
    const modifiedSpeed = baseAnimationSpeed * (1-(speed*.01))
    return modifiedSpeed
  }


}