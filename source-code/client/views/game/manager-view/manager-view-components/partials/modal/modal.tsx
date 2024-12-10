import { PropsWithChildren } from "react"
import { closeModal } from "../../../../../../front-end-service/front-end-service"
import "./modal.scss"

type Props = {
  onClose?: () => void
}
export const Modal = (props: PropsWithChildren<Props>) => {
  return (
    <div className="modal-container">
      <div className="modal-blackout" onClick={() => closeModal()}></div>
      <div className="modal">
        <div className="modal__content">{props.children}</div>
      </div>
    </div>
  )
}
