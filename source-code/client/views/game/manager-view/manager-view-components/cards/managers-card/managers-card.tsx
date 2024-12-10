import { observer } from "mobx-react"
import { toCamelCase } from "../../../../../../../helper-functions/helper-functions"
import { showManager } from "../../../../../../front-end-service/front-end-service"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import "../../main-components/manager-list.scss"
import { Modal } from "../../partials/modal/modal"
import "./managers-card.scss"

export const ManagersCard = observer(() => {
  const {
    clientUIState: {
      clientPreGameUIState: { clientName },
    },
    serverUIState: { serverGameUIState },
  } = frontEndState
  const {
    managerInfo: { otherManagers },
  } = serverGameUIState!.playerManagerUIState!

  return (
    <Modal>
      <div className="panel">
        <div className="card__heading heading">Managers</div>
        <div className="list managers-card">
          {otherManagers.map((manager) => (
            <div
              key={manager.name}
              className={"list__row manager"}
              onClick={() => showManager(manager.name)}
            >
              <div
                className={`manager__image manager__image--${toCamelCase(
                  manager.image
                )}`}
              ></div>
              <div className="manager__name">{`${
                manager.name == clientName ? "****" : ""
              } ${manager.name} `}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
})
