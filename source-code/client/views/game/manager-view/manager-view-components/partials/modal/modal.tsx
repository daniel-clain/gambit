import React from 'react'
import { frontEndService } from '../../../../../../front-end-service/front-end-service'

export const Modal = ({children, onClose = undefined}) =>   
  <div className='modal'>
    <div className='modal__blackout'></div>
    <div className='modal__content'>
      {children}
    </div>
    <button 
      className='modal__close-button' 
      onClick={() => (
        frontEndService.closeModal, 
        onClose()
      )}
      value='Close'
    />
  </div>   

