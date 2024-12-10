/* chat gpt says its bad to have god create everything because
  - it violates the object ownership principal, where a solarsystem owns a planet, so the solar system should create it
  - violates single responsibility pattern, a galaxy should focus on managing planets, if god does everything, then god doesn have single responsibility
  - Cohesion: Each class is responsible for its immediate "children" and nothing else.

  - the correct way is 
    Option 2: Hierarchical Ownership (Galaxy Creates Solar Systems, Solar Systems Create Planets)
      In this approach, each entity is responsible for creating and managing its children:
        Universe creates Galaxy.
        Galaxy creates SolarSystem.
        SolarSystem creates Planet.

      Why this makes sense:
        - Natural Ownership: This mirrors a real-world hierarchy. For example, it feels logical to say a galaxy "owns" its solar systems and thus manages their creation.
        - Separation of Concerns: Each class only manages its immediate children, keeping responsibilities focused and modular.
        - Extensibility: If you want to add new behaviors (e.g., galaxies that have unique creation rules), those changes stay localized to the Galaxy class.
*/

type Omnibenevolence = {}
type Omnificence = {
  createUniverse: () => Universe
  createGalaxy: (universe: Universe) => Galaxy
  createSolarSystem: (galaxy: Galaxy) => SolarSystem
  createPlanet: (solarSystem: SolarSystem) => Planet
}
type Omnipotence = {}
type Omnipresence = {}
type Omniscience = {}

type God = Omnibenevolence &
  Omnificence &
  Omnipotence &
  Omnipresence &
  Omniscience

class Universe {
  galaxies: Galaxy[] = []
}
class Galaxy {
  solarSystems: SolarSystem[] = []
  constructor(public universe: Universe) {}
}

class SolarSystem {
  planets: Planet[] = []
  constructor(public galaxy: Galaxy) {}
}

class Planet {
  constructor(public solarSystem: SolarSystem) {
    console.log("Hello World!")
  }
}

const god: God = {
  createUniverse: () => {
    return new Universe()
  },
  createGalaxy: (universe: Universe) => {
    const galaxy = new Galaxy(universe)
    universe.galaxies.push(galaxy)
    return galaxy
  },
  createSolarSystem: (galaxy: Galaxy) => {
    const solarSystem = new SolarSystem(galaxy)
    galaxy.solarSystems.push(solarSystem)
    return solarSystem
  },
  createPlanet: (solarSystem: SolarSystem) => {
    const planet = new Planet(solarSystem)
    solarSystem.planets.push(planet)
    return planet
  },
}

god.createPlanet(god.createSolarSystem(god.createGalaxy(god.createUniverse())))
