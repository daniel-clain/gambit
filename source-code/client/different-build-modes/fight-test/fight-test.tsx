import { useCallback, useEffect, useRef, useState } from "react"
import { Subscription } from "rxjs"
import Fight from "../../../game-components/fight/fight"
import Fighter from "../../../game-components/fighter/fighter"
import { FightUiState } from "../../../types/game/ui-fighter-state"
import "../../styles/global.scss"
import { Fight_View } from "../../views/game/game-fight-view/fight-view/fight.view"
import { ConfigureTestFighters } from "./configure-test-fighters"
import { fightUiService } from "./fight-ui-service"

export const FighterTest_C = () => {
  const [fightUiState, setFightUiState] = useState<FightUiState>()
  const [fight, setFight] = useState<Fight>()
  const [fightersList, setFightersList] = useState<Fighter[]>([])

  const fightUiDataSubscription = useRef<Subscription>()

  const startNewFight = useCallback(() => {
    fight?.doTeardown()
    setFight(fightUiService.newFight())
  }, [fight])

  useEffect(() => {
    if (fight) {
      fightUiDataSubscription.current?.unsubscribe()
      fightUiDataSubscription.current =
        fight.fightUiDataSubject.subscribe(setFightUiState)
      fight.start()
    }
  }, [fight])

  return (
    <>
      <ConfigureTestFighters
        onFightersUpdated={(fighters: Fighter[]) => {
          setFightersList(fighters)
        }}
      />
      <button
        style={{ position: "absolute", left: "60px", zIndex: 3 }}
        onClick={() => (fight?.paused ? fight.unpause() : fight?.pause())}
      >
        {fight?.paused ? "Un-Pause" : "Pause"}
      </button>
      <button
        style={{ position: "absolute", left: "150px", zIndex: 3 }}
        onClick={startNewFight}
      >
        Start New Fight
      </button>
      {fightUiState && <Fight_View {...{ fightUiState }} />}
    </>
  )
}
