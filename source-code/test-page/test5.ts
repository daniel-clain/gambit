
const sleeper = (state) => ({
  sleep(length) {
    console.log(`${state.name} is sleeping.`)
    state.energy += length
  }
})
const painter = (state) => ({
  paint() {
    console.log(`${state.name} painted a picture.`)
    state.paintings ? state.paintings += 1 : state.paintings = 1
  }
})
const barker = (state) => ({
  bark() {
    if(state.energy > 0){
      console.log(`${state.name} started barking.`)
      state.energy -= 1
    }
    console.log(`${state.name} cant bark because hes out of energy.`)
  }
})

const newDog = (function (name, energy) {
  function Dog(name, energy) {
    let dog = {
      name,
      energy
    }
    return Object.assign(
      dog,
      sleeper(dog),
      barker(dog)
    )
  }
  return Dog
}())

const Artist = (function (name, energy) {
  function Artist(name, energy) {
    let artist = {
      name,
      energy
    }
    return Object.assign(
      artist,
      sleeper(artist),
      painter(artist)
    )
  }
  return Artist
}())

globalThis.george = Artist('George', 10)
globalThis.george.sleep(3)

globalThis.fido = newDog('Fido', 5)
globalThis.fido.sleep(12)

