import * as React from "react"
import './modal.scss'
import {useDispatch} from 'react-redux'
import { Dispatch } from "redux"
import { ClientManagerUIAction } from "../../../../../../front-end-state/reducers/manager-ui.reducer"

export const Modal = ({children, onClose = undefined}) =>  {
  const dispatch: Dispatch<ClientManagerUIAction> = useDispatch()
  return (
    <div className='modal'>
      <div className='modal__blackout'></div>
      <div className='modal__content'>
        {children}
      </div>
      <button 
        className='modal__close-button' 
        onClick={() => (
          dispatch({type: 'Close Modal'}), 
          onClose?.()
        )}
      >Close</button>
    </div>   
  )
}
