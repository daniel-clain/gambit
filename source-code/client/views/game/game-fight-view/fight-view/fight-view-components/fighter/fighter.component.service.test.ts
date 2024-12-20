import { ActionName } from "../../../../../../../types/fighter/action-name"
import { FighterUiTimeStamp } from "../../../../../../../types/game/ui-fighter-state"
import { getCurrentAndRemainingTimeStamps } from "./fighter.component.service"

describe("getCurrentAndRemainingTimeStamps", () => {
  test("1", () => {
    const serverStartTime = Date.now()
    const serverTimeStep = 0
    const fighterTimeStamps = [
      { actionName: "action 1" as ActionName, startTimeStep: 0 },
      { actionName: "action 2" as ActionName, startTimeStep: 100 },
    ] as FighterUiTimeStamp[]

    const result = getCurrentAndRemainingTimeStamps(
      fighterTimeStamps,
      serverStartTime,
      serverTimeStep
    )

    expect(result.currentTimeStamp.actionName).toEqual("action 1" as ActionName)
    expect(result.remainingTimeStamps.length).toEqual(1)
  })

  test("runs code 1000ms after start time", () => {
    const serverStartTime = Date.now() - 1000
    const serverTimeStep = 0
    const fighterTimeStamps = [
      { actionName: "action 1" as ActionName, startTimeStep: 0 },
      { actionName: "action 2" as ActionName, startTimeStep: 900 },
      { actionName: "action 3" as ActionName, startTimeStep: 1100 },
    ] as FighterUiTimeStamp[]

    const result = getCurrentAndRemainingTimeStamps(
      fighterTimeStamps,
      serverStartTime,
      serverTimeStep
    )

    expect(result.currentTimeStamp.actionName).toEqual("action 2" as ActionName)
    expect(result.remainingTimeStamps.length).toEqual(1)
  })

  test.only("runs code 1000ms after start time, server time step 2000", () => {
    const serverStartTime = Date.now() - 1000
    const serverTimeStep = 2000
    const fighterTimeStamps = [
      { actionName: "action 1" as ActionName, startTimeStep: 0 },
      { actionName: "action 2" as ActionName, startTimeStep: 900 },
      { actionName: "action 3" as ActionName, startTimeStep: 1100 },
      { actionName: "action 4" as ActionName, startTimeStep: 3100 },
      { actionName: "action 5" as ActionName, startTimeStep: 5100 },
    ] as FighterUiTimeStamp[]

    const result = getCurrentAndRemainingTimeStamps(
      fighterTimeStamps,
      serverStartTime,
      serverTimeStep
    )

    expect(result.currentTimeStamp.actionName).toEqual("action 3" as ActionName)
    expect(result.remainingTimeStamps.length).toEqual(2)
  })
})
