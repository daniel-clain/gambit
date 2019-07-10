export interface IFighterAttribute{
  name: string
  value: number
}

type FighterAttributeName = 'Strength' | 'Speed' | 'Intelligence' | 'Endurance' | 'Aggression'

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
  get name(): string {
    return this._name
  }
}




const defaultFighterAttributes: FighterAttribute[] = [
  new FighterAttribute('Strength'),
  new FighterAttribute('Intelligence'),
  new FighterAttribute('Speed'),
  new FighterAttribute('Endurance'),
  new FighterAttribute('Aggression')
]

export default defaultFighterAttributes