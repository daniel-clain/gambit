
import OneToFive from '../../types/game/one-to-five.type';
import { ActiveContract } from '../../interfaces/game/contract.interface';
import Manager from '../manager/manager';
import Fight from "../fight/fight";



export default class FighterState{
  doping: boolean = false
  injured: boolean = false
  activeContract: ActiveContract = null
  manager: Manager
  fight: Fight
  
  private _maxStamina: OneToFive = 4
  private _maxSpirit: OneToFive = 4
  private _happieness: OneToFive = 4  
  private _healthRating: OneToFive = 5
  private _publicityRating: OneToFive = 1
  private _strength: OneToFive = 1
  private _intelligence: OneToFive = 1
  private _speed: OneToFive = 1
  private _aggression: OneToFive = 1

  numberOfFights: number = 0
  numberOfWins: number = 0

  private maxVal: 5
  private minVal: 1

  constructor(){}

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
  get happieness(){
    return this._happieness
  }
  get healthRating(){
    return this._healthRating
  }
  get publicityRating(){
    return this._publicityRating
  }

  
  






  set strength(val){
    if(this.validateAttribute(val))
      this._strength = val
  }
  set intelligence(val){
    if(this.validateAttribute(val))
      this._intelligence = val
  }
  set speed(val){
    if(this.validateAttribute(val))
      this._speed = val
  }
  set aggression(val){
    if(this.validateAttribute(val))
      this._aggression = val
  }
  set maxStamina(val){
    if(this.validateAttribute(val))
      this._maxStamina = val
  }
  set maxSpirit(val){
    if(this.validateAttribute(val))
      this._maxSpirit = val
  }
  set happieness(val){
    if(this.validateAttribute(val))
      this._happieness = val
  }
  set healthRating(val){
    if(this.validateAttribute(val))
      this._healthRating = val
  }
  set publicityRating(val){
    if(this.validateAttribute(val))
      this._publicityRating = val
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


}


