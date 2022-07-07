import * as React from "react"
import './modal.scss'
import { connect } from "react-redux"
import { hot } from "react-hot-loader/root"
import { frontEndStore } from "../../../../../../front-end-state/front-end-state"

export interface ModalProps{
  onClose?: () => void
  children: any
}



export const Modal = connect()(hot((props: ModalProps) =>  {
  
  const close = () => (
    props.onClose && props.onClose(), 
    frontEndStore.dispatch({type:'closeModal'})
  )
  return (
    <div className='modal-container'>
      <div className='modal-blackout' onClick={close}></div>
      <div className='modal'>
        <div className='modal__content'>
          {props.children}
        </div>
      </div>   
    </div>   
  )
}))
