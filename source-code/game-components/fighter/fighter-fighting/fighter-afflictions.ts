import FighterFighting from "./fighter-fighting"

export default class FighterAfflictions {
  constructor(public fighting: FighterFighting) {}
  beSick() {
    const { fighting } = this
    const { timers } = fighting

    timers.start("was just sick")

    fighting.addFighterAction({
      actionName: "be sick",
      modelState: "Recovering",
      duration: 1000,
    })
  }
  flinch() {
    const { fighting } = this
    fighting.addFighterAction({
      actionName: "flinch",
      soundMade: "dodge",
      modelState: "Defending",
      duration: 1000,
    })
  }
  hallucinations() {
    const { fighting } = this
    const { timers } = fighting

    timers.start("hallucinations")
  }
}
