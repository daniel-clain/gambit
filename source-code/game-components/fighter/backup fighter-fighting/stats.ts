import Fighter from "../fighter"

export default class FighterStats {
  
  private _baseStrength: number = 2
  private _baseFitness: number = 2
  private _baseIntelligence: number = 2
  private _baseAggression: number = 2

  maxSpirit = 5
  maxEnergy = 10


  constructor(public fighter: Fighter){}



  get fitness(){
    const {sick, injured, doping} = this.fighter.state
    let x = this._baseFitness
    if(sick) x *= .4
    if(injured) x *= .4
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
    if(injured) x *= .4
    if(doping) x = x * 1.3 + 1    
    return Math.round(x)
  }

  get aggression(){
    const {sick, doping, takingADive} = this.fighter.state
    const {onARampage} = this.fighter.fighting.logistics

    if(!onARampage && takingADive) return 0

    let x = this.baseAggression
    if(doping) x += 3   
    if(onARampage) x *= 1.6
    if(sick) x *= .6
    if(x < 0) return 0
    return Math.round(x)
  }

  get speed(){
    const {logistics, energy} = this.fighter.fighting
    const {sick, takingADive} = this.fighter.state
    const {onARampage} = logistics
    const speed = Math.round(
      2 + 
      (sick ? -5 : 0) +
      this.aggression*.5 + 
      -this.strength*.3 + 
      this.fitness*.9
    )
    if(energy <= 1) return speed * .5
    if(!onARampage && takingADive) return speed * .5
    if(speed < 0) return 0
    return speed
  }

  get maxStamina(){
    const {sick, injured} = this.fighter.state
    const maxStamina = Math.round(
      2 + 
      this.baseStrength*.8 + 
      this.baseFitness*.5 + 
      this.baseAggression*.2
      - (sick || injured ? 2 : 0)
    )


    return maxStamina
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
