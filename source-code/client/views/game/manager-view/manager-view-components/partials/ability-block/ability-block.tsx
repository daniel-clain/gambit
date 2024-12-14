import { observer } from "mobx-react"
import { AbilityData } from "../../../../../../../game-components/abilities-general/ability"
import { isPossibleToPerformAbility } from "../../../../../../front-end-service/ability-service-client"
import { showAbility } from "../../../../../../front-end-service/front-end-service"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import "./ability-block.scss"

export const AbilityBlock = observer(
  ({ abilityData }: { abilityData: Partial<AbilityData> }) => {
    const {
      serverUIState: { serverGameUIState },
    } = frontEndState

    const { managerInfo, delayedExecutionAbilities, week, jobSeekers } =
      serverGameUIState!.playerManagerUIState!

    const { enoughFightersForFinalTournament } = serverGameUIState!

    let disabled = !isPossibleToPerformAbility(
      abilityData,
      managerInfo,
      delayedExecutionAbilities,
      week,
      enoughFightersForFinalTournament,
      jobSeekers
    )

    return (
      <div
        className={`ability-block ${
          disabled ? "ability-block--disabled" : ""
        } `}
        onClick={() => showAbility(abilityData)}
      >
        <div className="ability-block__name">{abilityData.name}</div>
        <div
          className={`
        ability-block__image 
        ${
          "ability-block__image__" +
          abilityData.name!.toLocaleLowerCase().split(" ").join("-")
        }`}
        ></div>
      </div>
    )
  }
)
