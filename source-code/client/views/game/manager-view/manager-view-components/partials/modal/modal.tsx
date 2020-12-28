import * as React from "react"
import './modal.scss'
import {useDispatch} from 'react-redux'
import { Dispatch } from "redux"
import { frontEndService } from "../../../../../../front-end-service/front-end-service"

export const Modal = ({children, onClose = undefined}) =>  {
  const {closeModal} = frontEndService().setClientState
  return (
    <div className='modal'>
      <div className='modal__blackout'></div>
      <div className='modal__content'>
        {children}
      </div>
      <button 
        className='modal__close-button' 
        onClick={() => (closeModal(), onClose?.())}
      >Close</button>
    </div>   
  )
}
