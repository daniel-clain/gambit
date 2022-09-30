import FighterFighting from "./fighter-fighting";
import Animation from "../../../interfaces/game/fighter/animation";
import { wait, random } from "../../../helper-functions/helper-functions";
import { AnimationName } from "../../../types/fighter/animation-name";

export default class FighterAnimation{
  constructor(public fighting: FighterFighting){}
  
  private cancel: (reason: string) => void
  inProgress: AnimationName
  
  async start(animation: Animation): Promise<void>{

    const {name, duration, model, sound} = animation
    let timeoutRef

    const randomNum = random(100)

    const logSupressedActions: AnimationName[] = [
      //'turning around', 
      'doing cooldown'
    ]

    if(this.inProgress){
      this.cancel(`${name} started (${randomNum})`)      
      await wait(5)
    }
    
    /* if(!logSupressedActions.some(n => n == name))
      console.log(`${this.fighting.fighter.name} started ${name} (${randomNum})`); */

    this.inProgress = name  

    if(sound)
      this.fighting.soundsMade.push({soundName: sound, time: Date.now()})
    if(model)
      this.fighting.modelState = model

    
    return new Promise((resolve, reject) => {
      timeoutRef = setTimeout(resolve, duration)
      this.cancel = reject    
    })
    .then(() => {      
      this.inProgress = null
     /*  if(!logSupressedActions.some(n => n == name))
        console.log(`${this.fighting.fighter.name} finished ${name} (${randomNum})`); */
      return
        
    })
    .catch(reason => {
      this.inProgress = null
      clearTimeout(timeoutRef)

      /* if(!logSupressedActions.some(n => n == name)){
        console.log(`${this.fighting.fighter.name}'s ${name} was cancled because ${reason} (${randomNum})`);
      } */
      throw(reason)
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
    const {speed, aggression, strength} = this.fighting.stats
    const modifiedSpeed = baseAnimationSpeed * (1-(speed*.0018)) * (1-(aggression*.0013)) * (1+(strength*.0013))
    console.log('modifiedSpeed :>> ', modifiedSpeed);
    return modifiedSpeed
  }


}