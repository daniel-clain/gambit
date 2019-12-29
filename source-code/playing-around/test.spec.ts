

describe('sponsor fighter', () => {
  

  class Fighter{
    constructor(public name: string){}
    fight: Fight
    manager: Manager
  }

  class Fight {
    fighters: Fighter[] = []
    
    addFighter(fighter: Fighter){
      if(this.fighters.some(f => f.name === fighter.name)){
        throw 'cant add fighter that is already in the fight'
      }
      this.fighters.push(fighter)
      fighter.fight = this
    }
  }

  class Manager {
    name = 'Manager Jim'
    fighters: Fighter[] = []
    sponsorFighter(fighter: Fighter){
      if(this.fighters.some(f => f.name === fighter.name)){
        throw 'cant sponsor fighter that is already sponsored'
      }
      this.fighters.push(fighter)
      fighter.manager = this
    }
  }
  const manager = new Manager()
  const fighterBob = new Fighter('Bob')
  manager.sponsorFighter(fighterBob)
  it('should add fighter to the list of manager fighters', () => {
    expect(manager.fighters.some(fighter => fighter.name == 'Bob')).toBeTruthy()    
  });
  it('should set the fighters manager to this manager', () => {
    expect(fighterBob.manager.name === 'Manager Jim').toBeTruthy()
  });
  
  it('should throw an error if trying to add the same fighter twice', () => {    
    expect(() => manager.sponsorFighter(fighterBob)).toThrowError('cant sponsor fighter that is already sponsored')
  });
});



