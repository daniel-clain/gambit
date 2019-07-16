
type FighterAttributeName = 'Strength' | 'Speed' | 'Intelligence' | 'Endurance' | 'Aggression' | 'Passion'

export interface IFighterAttribute{
  name: FighterAttributeName
  value: number
}


class FighterAttribute implements IFighterAttribute{
  private _name: FighterAttributeName
  private _value: number
  private maxVal: 10
  private minVal: 0
  constructor(name: FighterAttributeName, value: number = 0){
    this._name = name
    this.value = value
  }
  private validate(attributeValue: number): boolean{
    let isValid: boolean = true;
    if(attributeValue < this.minVal){
      console.log(`FighterAttribute ${this.name}' can not be below ${this.minVal}. Received: ${attributeValue}`);
      isValid = false
    }    
    if(attributeValue > this.maxVal){
      console.log(`FighterAttribute ${this.name}' can not be above ${this.minVal}. Received: ${attributeValue}`);
      isValid = false
    }
    return isValid
  }
  set value(strengthValue: number){
    if(this.validate(strengthValue))
      this._value = strengthValue
  }
  get value(): number {
    return this._value
  }
  get name(): FighterAttributeName {
    return this._name
  }
}



export interface IFighterAttributes{
  strength: FighterAttribute
  intelligence: FighterAttribute
  speed: FighterAttribute
  endurance: FighterAttribute
  aggression: FighterAttribute
  passion: FighterAttribute

}

const defaultFighterAttributes: IFighterAttributes = {
  strength: new FighterAttribute('Strength'),
  intelligence: new FighterAttribute('Intelligence'),
  speed: new FighterAttribute('Speed'),
  endurance: new FighterAttribute('Endurance'),
  aggression: new FighterAttribute('Aggression'),
  passion: new FighterAttribute('Passion')
}

export default defaultFighterAttributes