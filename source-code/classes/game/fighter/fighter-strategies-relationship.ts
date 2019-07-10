interface Relationship{
  internal: any[]
  esternal: any[]
}

interface HasRelationships{
  relationships: Relationship[] = []
}

class zFighter implements HasRelationships{
  relationships = {
    internal: 
  }
}

class FighterStrategies extends zFighter{
  'Run away and recover' |
  'Impatience' |
  'Avoid crowds' |
  'Safe to attack' |
  'Backed into a corner' |
  'Attack closest fighter' |
  'Avoid boundary' |
  'Avoid being flanked' |
  'Smart defend' |
  'Cheapshot' |
  'Awarness' |
  'Prey on the weak'


}


class FighterStrategies extends BobTheParent{

}