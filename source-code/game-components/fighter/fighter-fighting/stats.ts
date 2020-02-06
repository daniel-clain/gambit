import FighterFighting from "./fighter-fighting"

export default class FighterStats {
  
  private _baseStamina
  private _baseSpirit = 5
  private _baseSpeed
  private _baseStrength
  private _baseIntelligence
  private _baseAggression
  private _fitness
 
  maxStamina
  maxSpirit
  strength
  speed
  aggression
  intelligence

  constructor(public fighting: FighterFighting){}

  get fitness(){
    return this._fitness
  }
  get baseStrength(){
    return this._baseStrength
  }
  get baseSpeed(){
    return this._baseSpeed
  }
  get baseAggression(){
    return this._baseAggression
  }
  get baseStamina(){
    return this._baseStamina
  }
  get baseSpirit(){
    return this._baseSpirit
  }
  get baseIntelligence(){
    return this._baseIntelligence
  }



  set baseAggression(val){
    this._baseAggression = val
    this.aggression = val
  }
  set baseSpeed(val){
    this._baseSpeed = val
    this.speed = val
  }
  set baseIntelligence(val){
    this._baseIntelligence = val
    this.intelligence = val
  }
  

  set baseStrength(val){
    this._baseStrength = val
    this.strength = val
    this.fighting.fighter.determineSkin()
    this.updateBaseStamina()
  }
  
  set fitness(val){
    this._fitness = val
    this.baseSpeed = val
    this.fighting.fighter.determineSkin()
    this.updateBaseStamina()
  }

  set baseStamina(val){
    this._baseStamina = val
    this.maxStamina = val
  }
  set baseSpirit(val){
    this._baseSpirit = val
    this.maxSpirit = val
  }


  private updateBaseStamina(){
    this.baseStamina = Math.round(this.strength*.7 + this.fitness*.5)
  }


};
