import * as React from "react"
import { closeModal } from "../../../../../../front-end-service/front-end-service"
import './modal.scss'



export const Modal = ((props) =>  {  
  return (
    <div className='modal-container'>
      <div className='modal-blackout' onClick={
        () => closeModal()
      }></div>
      <div className='modal'>
        <div className='modal__content'>
          {props.children}
        </div>
      </div>   
    </div>   
  )
})
