import OneToFive from "../../../types/game/one-to-five.type"
import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"

export default class FighterStats {
  
  private _maxStamina: OneToFive = 3
  private _maxSpirit: OneToFive = 3
  private _strength: OneToFive = 1
  private _intelligence: OneToFive = 1
  private _speed: OneToFive = 1
  private _aggression: OneToFive = 1

  private maxVal: 5
  private minVal: 1

  constructor(private fighting: FighterFighting){}

  get strength(){
    return this._strength
  }
  get intelligence(){
    return this._intelligence
  }
  get speed(){
    return this._speed
  }
  get aggression(){
    return this._aggression
  }
  get maxStamina(){
    return this._maxStamina
  }
  get maxSpirit(){
    return this._maxSpirit
  }


  set strength(val){
    if(this.validateAttribute(val)){
      this._strength = val
      this.fighting.fighter.determineSkin()
    }
  }
  set intelligence(val){
    if(this.validateAttribute(val))
      this._intelligence = val
  }
  set speed(val){
    if(this.validateAttribute(val)){
      this._speed = val
      this.fighting.fighter.determineSkin()
    }
  }
  set aggression(val){
    if(this.validateAttribute(val)){
      this._aggression = val
      this.fighting.fighter.determineSkin()
    }
  }
  set maxStamina(val){
    if(this.validateAttribute(val)){
      this._maxStamina = val
      this.fighting.fighter.determineSkin()
    }
  }
  set maxSpirit(val){
    if(this.validateAttribute(val))
      this._maxSpirit = val
  }

  private validateAttribute(attributeValue: number): boolean{
    let isValid: boolean = true;
    if(attributeValue < this.minVal){
      console.log(`Fighter attribute can not be below ${this.minVal}. Received: ${attributeValue}`);
      isValid = false
    }    
    if(attributeValue > this.maxVal){
      console.log(`Fighter attribute can not be above ${this.minVal}. Received: ${attributeValue}`);
      isValid = false
    }
    return isValid
  }

};
