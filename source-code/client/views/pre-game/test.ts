import { random } from "lodash"

type FighterState = {
  health: number
  morale: number
}

type Action = {
  name: "punch" | "kick"
  duration: number
  damage: number
}

// Fighter class
class Fighter {
  name: string
  state: FighterState

  constructor(name: string, health: number, morale: number) {
    this.name = name
    this.state = { health, morale }
  }

  actions: Action[] = [
    { name: "punch", duration: 1500, damage: 1 },
    { name: "kick", duration: 2000, damage: 10 },
  ]

  // Fighter decides an action based on the current state
  decideAction(targetFighter: Fighter): Action {
    const [punch, kick] = this.actions
    if (targetFighter.state.health < 50 && random(0, 1)) {
      return kick
    }
    return punch
  }
}

type DelayedEffect = {
  source: Fighter
  action: Action
  resolveTime: number
  target: Fighter
}

// Event queue to simulate delayed effects
class EventQueue {
  delayedEffects: DelayedEffect[] = []
  feEventList: DelayedEffect[] = []

  // Add event to queue with resolve time
  addEvent(delayedEffect: DelayedEffect) {
    this.delayedEffects.push(delayedEffect)
    this.feEventList.push(delayedEffect)
  }

  // Process events that are ready to resolve
  processEvents(currentTime: number) {
    this.delayedEffects = this.delayedEffects.filter((delayedEffect) => {
      if (delayedEffect.resolveTime <= currentTime) {
        console.log()
        const { target: t, source: s } = delayedEffect
        const oldHealth = t.state.health
        t.state.health -= delayedEffect.action.damage
        console.log(
          `${s.name}  ${delayedEffect.action.name} on ${t.name}. health from ${oldHealth} to ${t.state.health}. trigger at  ${currentTime}`
        )

        return false // Remove event after processing
      }
      return true
    })
  }
}

// Simulated fight system
function simulateFight(fighters: Fighter[]) {
  let currentTime = 0 // Simulated time
  const timeStep = 1 // 1 second per loop
  const eventQueue = new EventQueue()

  console.log(`Starting fight`)

  while (fighters.filter((f) => f.state.health > 0).length > 1) {
    fighters.forEach((fighter) => {
      if (
        fighter.state.health <= 0 ||
        eventQueue.delayedEffects.some((e) => e.source.name == fighter.name)
      ) {
        return
      }
      const otherFighters = fighters.filter(
        (f) => f.name != fighter.name && f.state.health > 0
      )!

      const targetFighter: Fighter =
        otherFighters[random(0, otherFighters.length - 1)]

      const decidedAction = fighter.decideAction(targetFighter)

      console.log(
        `${fighter.name} decides to ${decidedAction.name} ${targetFighter.name}. initiated at ${currentTime}`
      )

      const delayedEffect: DelayedEffect = {
        source: fighter,
        action: decidedAction,
        resolveTime: currentTime + decidedAction.duration + random(10),
        target: targetFighter,
      }

      eventQueue.addEvent(delayedEffect)
    })
    // Fast forward time and process events
    currentTime += timeStep
    eventQueue.processEvents(currentTime)
  }
  const winner = fighters.find((f) => f.state.health > 0)!
  console.log(`${winner.name} wins`)

  return eventQueue.feEventList
}

// Test the simulation
const fighterA = new Fighter("Fighter A", 100, 100)
const fighterB = new Fighter("Fighter B", 100, 100)
const fighterC = new Fighter("Fighter C", 100, 100)

export const go = () => {
  return simulateFight([fighterA, fighterB, fighterC])
}
