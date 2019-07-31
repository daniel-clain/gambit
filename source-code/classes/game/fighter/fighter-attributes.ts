
type FighterAttributeName = 'Strength' | 'Speed' | 'Intelligence' | 'Endurance' | 'Aggression' | 'Passion'

export interface IFighterAttribute{
  name: FighterAttributeName
  value: number
}


export default class FighterAttributes{  
  private _strength: number
  private _intelligence: number
  private _speed: number
  private _endurance: number
  private _aggression: number
  private _numberOfFights: number
  private _numberOfWins: number

  private maxVal: 10
  private minVal: 0

  get strength(){
    return this._strength
  }
  get intelligence(){
    return this._intelligence
  }
  get speed(){
    return this._speed
  }
  get endurance(){
    return this._endurance
  }
  get aggression(){
    return this._aggression
  }
  get numberOfFights(){
    return this._numberOfFights
  }
  get numberOfWins(){
    return this._numberOfWins
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
  set endurance(val){
    if(this.validateAttribute(val))
      this._endurance = val
  }
  set aggression(val){
    if(this.validateAttribute(val))
      this._aggression = val
  }
  set numberOfFights(val){
    this._numberOfFights = val
  }
  set numberOfWins(val){
    this._numberOfWins = val
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
