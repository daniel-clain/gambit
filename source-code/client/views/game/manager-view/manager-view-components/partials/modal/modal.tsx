import * as React from "react"
import './modal.scss'
import { connect } from "react-redux"
import { hot } from "react-hot-loader/root"

export const Modal = connect()(hot((props) =>  {
  const close = () => (props.onClose && props.onClose(), props.dispatch({type:'closeModal'}))
  return (
    <div className='modal-container'>
      <div className='modal-blackout' onClick={close}></div>
      <div className='modal'>
        <div className='modal__content'>
          {props.children}
        </div>
        <button 
          className='modal__close-button' 
          onClick={close}
        >Close</button>
      </div>   
    </div>   
  )
}))
