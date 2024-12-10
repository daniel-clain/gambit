import { observer } from "mobx-react"
import { ReactNode } from "react"
import { ClientAbility } from "../../../../../../../game-components/abilities-general/ability"
import {
  FighterInfo,
  KnownFighterInfo,
} from "../../../../../../../interfaces/front-end-state-interface"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { getAbilitiesThatCanTargetThis } from "../../../../../../front-end-service/ability-service-client"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import { AbilityBlock } from "../../partials/ability-block/ability-block"
import Fights from "../../partials/fights-and-wins/fights"
import Wins from "../../partials/fights-and-wins/wins"
import { InfoBox } from "../../partials/info-box/info-box"
import { Modal } from "../../partials/modal/modal"
import "../modal-card.scss"
import "./fighter-card.scss"

export const FighterCard = observer(() => {
  const {
    serverUIState: { serverGameUIState },
    clientUIState: {
      clientPreGameUIState: { clientName },
      clientGameUIState: {
        clientManagerUIState: { activeModal },
      },
    },
  } = frontEndState

  const { playerManagerUIState } = serverGameUIState!

  const {
    managerInfo: { knownFighters, fighters },
    jobSeekers,
  } = playerManagerUIState!

  const fighterName = activeModal!.data as string
  const thisPlayersName = clientName

  const fighter: FighterInfo | KnownFighterInfo =
    fighters.find((f) => f.name == fighterName) ??
    knownFighters.find((f) => f.name == fighterName)!

  let isYourFighter: boolean = false
  let infoBoxList: InfoBoxListItem[]
  let fightExperience: ReactNode

  if (fighter.stats.manager == thisPlayersName) {
    // is your fighter
    const myFighter = fighter as FighterInfo
    const {
      strength,
      fitness,
      intelligence,
      aggression,
      numberOfFights,
      numberOfWins,
      publicityRating,
    } = myFighter.stats
    infoBoxList = [
      { label: "Strength", value: strength },
      { label: "Fitness", value: fitness },
      { label: "Intelligence", value: intelligence },
      { label: "Aggression", value: aggression },
      {
        label: "Publicity Rating",
        value: publicityRating,
      },
      { label: "Manager", value: thisPlayersName },
    ]

    fightExperience = (
      <div className="fighter-card__fight-experience">
        <Fights numberOfFights={numberOfFights} />
        <Wins numberOfWins={numberOfWins} />
      </div>
    )
  } else {
    const knownFighter = fighter as KnownFighterInfo
    const {
      strength,
      fitness,
      intelligence,
      aggression,
      manager,
      numberOfFights,
      numberOfWins,
      publicityRating,
    } = knownFighter.stats
    infoBoxList = [
      {
        label: "Strength",
        value: strength
          ? `${strength.lastKnownValue} (${strength.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Fitness",
        value: fitness
          ? `${fitness.lastKnownValue} (${fitness.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Intelligence",
        value: intelligence
          ? `${intelligence.lastKnownValue} (${intelligence.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Aggression",
        value: aggression
          ? `${aggression.lastKnownValue} (${aggression.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Publicity Rating",
        value: publicityRating
          ? `${publicityRating.lastKnownValue} (${publicityRating.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Manager",
        value: manager
          ? `${manager.lastKnownValue ? manager.lastKnownValue : "none"} (${
              manager.weeksSinceUpdated
            })`
          : "unknown",
      },
    ]

    fightExperience = (
      <div className="fighter-card__fight-experience">
        <Fights
          numberOfFights={numberOfFights?.lastKnownValue as number | undefined}
        />

        <Wins
          numberOfWins={numberOfWins?.lastKnownValue as number | undefined}
        />
      </div>
    )
  }
  const goalContractInfo = fighter.goalContract && [
    { label: "Number of weeks", value: fighter.goalContract.numberOfWeeks },
    { label: "Weekly cost", value: fighter.goalContract.weeklyCost },
  ]

  const abilitiesThatTargetFighter = getAbilitiesThatCanTargetThis(fighter)

  const jobSeekerFighter = jobSeekers.find((j) => j.name == fighterName)

  const contractInfo =
    (isYourFighter && [
      {
        label: "Weeks remaining",
        value: fighter.activeContract!.weeksRemaining,
      },
      { label: "Cost per week", value: fighter.activeContract!.weeklyCost },
    ]) ||
    undefined

  return (
    <Modal>
      <div className="card fighter-card">
        <div className="card__heading heading">{fighter.name}</div>
        <div className="card__two-columns">
          <div className="card__two-columns__left fighter-card__image"></div>
          <div className="card__two-columns__right">
            {fightExperience}
            <div className="fighter-card__stats">
              <InfoBox
                heading={`${!isYourFighter ? "Known " : ""}Stats`}
                list={infoBoxList}
              />
            </div>
            {goalContractInfo && (
              <InfoBox heading={"Goal Contract"} list={goalContractInfo} />
            )}
            {fighter.activeContract && (
              <InfoBox heading={"Active Contract"} list={contractInfo} />
            )}
          </div>
        </div>

        <div className="heading">Options</div>
        <div className="card__options">
          {abilitiesThatTargetFighter.map((clientAbility: ClientAbility) => (
            <AbilityBlock
              key={clientAbility.name}
              abilityData={{
                name: clientAbility.name,
                target: fighter,
                source: undefined!,
              }}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
})
