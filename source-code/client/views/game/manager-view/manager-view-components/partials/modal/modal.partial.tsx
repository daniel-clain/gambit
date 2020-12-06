import React from 'react'

export const Modal_Partial = ({children}) => {
  return <>
    <div className="modal-overlay"></div>
    <div className='modal'>
      {children}
    </div>
  </>
}
