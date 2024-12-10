import { observer } from "mobx-react"
import { AbilityData } from "../../../../../../../game-components/abilities-general/ability"
import { JobSeeker } from "../../../../../../../interfaces/front-end-state-interface"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import { AbilityBlock } from "../../partials/ability-block/ability-block"
import { InfoBox } from "../../partials/info-box/info-box"
import { Modal } from "../../partials/modal/modal"
import "../modal-card.scss"
import "./job-seeker-card.scss"

export const JobSeekerCard = observer(() => {
  const {
    clientUIState: {
      clientGameUIState: {
        clientManagerUIState: { activeModal },
      },
    },
  } = frontEndState

  const jobSeeker = activeModal!.data as JobSeeker

  const abilityData: Partial<AbilityData> = {
    name: "Offer Contract",
    source: undefined,
    target: jobSeeker,
  }

  const { numberOfWeeks, weeklyCost } = jobSeeker.goalContract!

  const infoBoxList: InfoBoxListItem[] = [
    { label: "Number of weeks", value: numberOfWeeks },
    { label: "Weekly cost", value: weeklyCost },
  ]

  return (
    <Modal>
      <div className="card job-seeker-card">
        <div className="heading">{jobSeeker.name}</div>
        <div className="card__two-columns">
          <div className="card__two-columns__left job-seeker-card__image"></div>
          <div className="card__two-columns__right">
            <div className="job-seeker-card__profession">
              Profession: {jobSeeker.profession}
            </div>
            <div className="job-seeker-card__skill-level">
              Skill level: {jobSeeker.skillLevel}
            </div>
            <div className="direction-box">
              <InfoBox heading={"Abilities"}>
                <ul>
                  {jobSeeker.abilities?.map((ability) => (
                    <li key={ability}>{ability}</li>
                  ))}
                </ul>
              </InfoBox>
              <InfoBox heading={"Contract Goal"} list={infoBoxList} />
            </div>
          </div>
        </div>
        <div className="card__options">
          <div className="heading">Options</div>
          <AbilityBlock abilityData={abilityData} />
        </div>
      </div>
    </Modal>
  )
})
