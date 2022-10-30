import { random } from "../../../helper-functions/helper-functions"
import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"

export default class FighterStats {
  
  private _baseStrength: number = 2
  private _baseFitness: number = 2
  private _baseIntelligence: number = 2
  private _baseAggression: number = 2

  maxSpirit = 5


  constructor(public fighter: Fighter){}



  get fitness(){
    const {sick, injured, doping} = this.fighter.state
    let x = this._baseFitness
    if(sick) x *= .4
    if(injured) x *= .6
    if(doping) x = x * 1.25 + 1   
    return Math.round(x)
  }

  get intelligence(){
    const {sick, hallucinating, doping} = this.fighter.state
    let x = this._baseIntelligence
    if(hallucinating) x *= .5
    if(doping) x *= .8  
    return Math.round(x)
  }

  get strength(){
    const {sick, injured, doping} = this.fighter.state
    let x = this.baseStrength
    if(sick) x *= .4
    if(injured) x *= .6
    if(doping) x = x * 1.3 + 1    
    return Math.round(x)
  }

  get aggression(){
    const {sick, doping, onARampage, takingADive} = this.fighter.state

    if(!onARampage && takingADive) return 0

    let x = this.baseAggression
    x -= (this.maxSpirit - this.fighter.fighting.spirit)
    if(doping) x += 3   
    if(onARampage) x *= 1.6
    if(sick) x *= .6
    if(x < 0) return 0
    return Math.round(x)
  }

  get speed(){
    const {onARampage, sick, takingADive} = this.fighter.state
    const speed = Math.round(
      2 + 
      (sick ? -5 : 0) +
      this.aggression*.3 + 
      -this.strength*.3 + 
      this.fitness*.7
    )
    if(!onARampage && takingADive) return speed * .5
    if(speed < 0) return 0
    return speed
  }

  get maxStamina(){
    const {sick, injured} = this.fighter.state
    const maxStamina = Math.round(
      2 + 
      this.strength*.8 + 
      this.fitness*.5 + 
      this.aggression*.2
      - (sick || injured ? 2 : 0)
    )


    return maxStamina
  }


  // not used
  get maxEnergy(){
    const {sick, injured, takingADive} = this.fighter.state
    let x = 5
    if(sick) x *= .8
    if(injured) x *= .8 
    if(takingADive) x *= .5

    return Math.round(x)
  }

  
  get baseStrength(){return this._baseStrength}
  get baseFitness(){return this._baseFitness}
  get baseIntelligence(){return this._baseIntelligence}
  get baseAggression(){return this._baseAggression}
  
  set baseIntelligence(x){this._baseIntelligence = x}
  set baseAggression(x){this._baseAggression = x}
  set baseStrength(val){
    this._baseStrength = val
    this.fighter.determineSkin()
  }  
  set baseFitness(val){
    this._baseFitness = val
    this.fighter.determineSkin()
  }





};
