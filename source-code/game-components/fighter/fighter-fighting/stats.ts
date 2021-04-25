import { random } from "../../../helper-functions/helper-functions"
import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"

export default class FighterStats {
  
  private _baseStrength: number = 2
  private _baseSpirit: number = 2
  private _baseFitness: number = 2
  private _baseIntelligence: number = 2
  private _baseAggression: number = 2


  constructor(public fighter: Fighter){}



  get fitness(){
    const {sick, injured, hallucinating, doping} = this.fighter.state
    let x = this._baseFitness
    if(sick) x *= .6
    if(injured) x *= .6
    if(hallucinating) x *= .7
    if(doping) x = x * 1.25 + 1   
    if(doping && hallucinating) x *= .1
    return x
  }

  get intelligence(){
    const {sick, injured, hallucinating, doping} = this.fighter.state
    let x = this._baseIntelligence
    if(sick) x *= .6
    if(injured) x *= .6
    if(hallucinating) x *= random(5) < 2 ? 1.5 : 0.4
    if(doping) x *= 1.2   
    return x
  }

  get strength(){
    const {sick, injured, doping} = this.fighter.state
    let x = this.baseStrength
    if(sick) x *= .7
    if(injured) x *= .6
    if(doping) x = x * 1.3 + 1    
    return x
  }

  get aggression(){
    const {sick, injured, hallucinating, doping, onARampage} = this.fighter.state
    let x = this.baseAggression
    if(sick) x *= .6
    if(injured) x *= .6
    if(hallucinating) x *= random(5) < 2 ? 1.5 : 0.4
    if(doping) x *= 1.2   
    if(onARampage) x *= 2
    return x
  }

  get speed(){
    const speed = Math.round(
      2 + 
      this.aggression*.5 + 
      -this.strength*.3 + 
      this.fitness
    )

    return speed
  }

  get maxStamina(){
    const maxStamina = Math.round(
      2 + 
      this.strength*.7 + 
      this.fitness*.5 + 
      this.aggression*.5
    )

    return maxStamina
  }

  get maxSpirit(){
    const {sick, injured, hallucinating, doping} = this.fighter.state
    let x = 5
    if(sick) x *= .8
    if(injured) x *= .8 

    return x
  }

  
  get baseStrength(){return this._baseStrength}
  get baseSpirit(){return this._baseSpirit}
  get baseFitness(){return this._baseFitness}
  get baseIntelligence(){return this._baseIntelligence}
  get baseAggression(){return this._baseAggression}
  
  set baseSpirit(x){this._baseSpirit = x}
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
