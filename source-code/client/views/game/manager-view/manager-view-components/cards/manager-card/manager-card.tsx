import { observer } from "mobx-react"
import {
  Employee,
  FighterInfo,
} from "../../../../../../../interfaces/front-end-state-interface"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import { ActivityLogItem } from "../../../../../../../types/game/activity-log-item"
import { Evidence } from "../../../../../../../types/game/evidence.type"
import { ManagerImage } from "../../../../../../../types/game/manager-image"
import {
  getAbilitiesThatCanTargetThis,
  getAbilitiesThisSourceCanDo,
} from "../../../../../../front-end-service/ability-service-client"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import { AbilityBlock } from "../../partials/ability-block/ability-block"
import { InfoBox } from "../../partials/info-box/info-box"
import { Modal } from "../../partials/modal/modal"
import "../modal-card.scss"
import "./manager-card.scss"

export const ManagerCard = observer(() => {
  const {
    clientUIState: {
      clientPreGameUIState: { clientName },
      clientGameUIState: {
        clientManagerUIState: { activeModal },
      },
    },
    serverUIState: { serverGameUIState },
  } = frontEndState
  const { managerInfo } = serverGameUIState!.playerManagerUIState!

  const managerName = activeModal!.data as string
  const isYourManager = managerName == clientName

  let managerImage: ManagerImage,
    abilityBlocks: JSX.Element[],
    infoBoxList: InfoBoxListItem[],
    evidenceAgainstManager: Evidence[] | undefined

  if (isYourManager) {
    managerImage = managerInfo.image

    const abilitiesYouManagerCanDo = getAbilitiesThisSourceCanDo(managerInfo)
    abilityBlocks = abilitiesYouManagerCanDo.map((a) => (
      <AbilityBlock
        key={a.name}
        abilityData={{
          name: a.name,
          source: managerInfo,
          target: undefined,
        }}
      />
    ))

    const { money, loan, employees, fighters, evidence, name, activityLogs } =
      managerInfo
    infoBoxList = [
      { label: "Name", value: name },
      { label: "Money", value: money },
      { label: "Loan", value: loan?.debt },
      { label: "Fighters", value: fighters.map((f) => f.name) },
      {
        label: "Employees",
        value: employees.length
          ? employees.map((e) => `${e.name}(${e.profession})`).join("\n")
          : 0,
      },
      { label: "Evidence", value: evidence.length },
    ]
  }

  if (!isYourManager) {
    const selectedManager = managerInfo.otherManagers.find(
      (m) => m.name == managerName
    )!
    managerImage = selectedManager.image
    const abilitiesManagerCanBeTheTargetOf =
      getAbilitiesThatCanTargetThis(selectedManager)
    abilityBlocks = abilitiesManagerCanBeTheTargetOf.map((a) => (
      <AbilityBlock
        key={a.name}
        abilityData={{
          name: a.name,
          source: undefined!,
          target: selectedManager,
        }}
      />
    ))

    const { money, loan, employees, fighters, evidence, name, activityLogs } =
      selectedManager
    infoBoxList = [
      { label: "Name", value: name },
      {
        label: "Money",
        value: money
          ? `${money.lastKnownValue} (${money.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Loan",
        value: loan
          ? `${loan?.lastKnownValue?.debt} (${loan.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Fighters",
        value: fighters?.lastKnownValue
          ? `${
              !fighters.lastKnownValue.length
                ? "0"
                : fighters.lastKnownValue.map((f: FighterInfo) => `\n${f.name}`)
            } (${fighters.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Employees",
        value: employees?.lastKnownValue
          ? `${
              !employees.lastKnownValue.length
                ? "0"
                : employees.lastKnownValue
                    .map(
                      (employee: Employee) =>
                        `${employee.name}(${employee.profession})`
                    )
                    .join("\n")
            } (${employees.weeksSinceUpdated})`
          : "unknown",
      },
      {
        label: "Evidence",
        value: evidence?.lastKnownValue
          ? `${
              !evidence.lastKnownValue.length
                ? "0"
                : evidence.lastKnownValue.length
            } (${evidence.weeksSinceUpdated})`
          : "unknown",
      },

      {
        label: "Activity Logs",
        value: activityLogs?.lastKnownValue
          ? `${
              !activityLogs.lastKnownValue.length
                ? "0"
                : activityLogs.lastKnownValue
                    .map((log: ActivityLogItem) => `- ${log.message}`)
                    .join("\n")
            } (${activityLogs.weeksSinceUpdated})`
          : "unknown",
      },
    ]

    evidenceAgainstManager = managerInfo.evidence.filter(
      (e) => e.managerName == selectedManager.name
    )
  }

  return (
    <Modal>
      <div className="card manager-card">
        <div className="card__heading heading">{managerName}</div>
        <div className="card__two-columns">
          <div
            className={`card__two-columns__left manager-card__image manager-card__image--${managerImage!
              .toLowerCase()
              .split(" ")
              .join("-")}`}
          ></div>
          <div className="card__two-columns__right">
            <div className="manager-card__stats">
              <InfoBox heading={`Manager Info`} list={infoBoxList!}>
                {evidenceAgainstManager?.length ? (
                  <div className="manager-card__evidence-container">
                    {evidenceAgainstManager.map((e) => (
                      <div className="manager-card__evidence">
                        {`* ${e.evidenceDescription}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </InfoBox>
            </div>
          </div>
        </div>

        <div className="heading">Options</div>
        <div className="card__options">{abilityBlocks!}</div>
      </div>
    </Modal>
  )
})
