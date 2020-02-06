
import * as React from 'react';
import './modal.scss'

export interface ModalProps{
  closeModal
}

export default class Modal extends React.Component<ModalProps> {
  render(){
    const {children, closeModal} = this.props
    return (
      <div className='modal'>
        <div className='modal__blackout'></div>
        <div className='modal__content'>
          {children}
        </div>
        <button className='modal__close-button' onClick={closeModal}>
          Close
        </button>
      </div>      
    )
  }
};
