import * as React from "react"
import './modal.scss'
import {frontEndService} from "../../../../../../front-end-service/front-end-service"

export const Modal = ({children, onClose = undefined}) =>  {
  const {closeModal} = frontEndService .setClientState
  return (
    <div className='modal-container'>
      <div className='modal-blackout'></div>
      <div className='modal'>
        <div className='modal__content'>
          {children}
        </div>
        <button 
          className='modal__close-button' 
          onClick={() => (closeModal(), onClose?.())}
        >Close</button>
      </div>   
    </div>   
  )
}
