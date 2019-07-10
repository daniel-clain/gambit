export interface xFighter{
  name: string
  startFighting(): void
  
}

interface Relationship{

}

const 

const getFighterInstance = (name: string): xFighter => {

  
  const startFighting = () => {
    console.log('suck ma balls');
  }

  const figher = {
    name,
    startFighting
  }
  return figher
}


const fighterGenerator = {
  createNewFighter: getFighterInstance
}
export default fighterGenerator
