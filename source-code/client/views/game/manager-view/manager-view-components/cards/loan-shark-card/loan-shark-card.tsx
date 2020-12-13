
import * as React from 'react';
import './loan-shark-card.scss'
import { useState } from 'react';
import { Loan } from '../../../../../../../interfaces/server-game-ui-state.interface';
import ClientGameAction from '../../../../../../../types/client-game-actions';
import { frontEndService } from '../../../../../../front-end-service/front-end-service';
import { Modal } from '../../partials/modal/modal';

export interface LoanSharkCardProps{
  loan: Loan
  money: number
}

interface LoanSharkCardState{
  paybackAmount: number, 
  borrowAmount: number
}


export const LoanSharkCard = ({loan, money}: LoanSharkCardProps) => {
  const [state, setState] = useState<LoanSharkCardState>({
    paybackAmount: undefined,
    borrowAmount: undefined
  })

  const {sendUpdate} = frontEndService

  const {debt, weeksOverdue} = loan    
  const {borrowAmount, paybackAmount} = state


  return (
    <Modal>
      <div className='card loan-shark-card'>
        <div className='heading'>Loan Shark</div>
        <div className="card__two-columns">

          <div className='loan-shark-card__image card__two-columns__left'></div>

          <div className='card__two-columns__right'>
            <div className='loan-shark-card__info'>
              Hey buddy, ill loan you money, but each week you don't pay me back you build up intrest, 10% of what you owe added on each week. If you owe me more than 500 and you dont pay me back in 3 weeks...... well, you'll find out what happens, and you wont like it.....
            </div>            
          </div>
        </div>
        <div className='loan-shark-card__debt'>
          Your Debt is: {debt}
        </div>
        {weeksOverdue > 0 && 
          <div className='loan-shark-card__debt'>
            You are <strong>{weeksOverdue}</strong> week{weeksOverdue > 1 && 's'} overdue!
          </div>
        }
        
        <div className='loan-shark-card__loan-tool'>
          <div className='loan-shark-card__loan-tool__left'>
            <div className='loan-shark-card__loan-tool__heading'>Pay Off Debt</div>
            <div className='pay-back-input'>
              Pay back amount: 
              <input 
                value={paybackAmount > 0 ? paybackAmount : ''} 
                onChange={e => updatePaybackAmount(e.target.value)} 
                onKeyPress={handleEnterEvent}
                type='number' step='10' min='0' max='500' 
              />
              <button className='standard-button payback-money-submit' onClick={paybackMoney}>Submit</button>
            </div>
          </div>
          
          <div className='loan-shark-card__loan-tool__right'>
            <div className='loan-shark-card__loan-tool__heading'>Get Loan</div>
            <div className='get-loan-input'>
              Borrow amount: 
              <input 
                value={borrowAmount > 0 ? borrowAmount : ''} 
                onChange={updateBorrowAmount}  
                onKeyPress={handleEnterEvent}
                type='number' step='10' min='0' max='500' 
              />
            </div>
            <button className='standard-button borrow-money-submit'
              onClick={borrowMoney}>Submit</button>
          </div>

        </div>        
      </div>
    </Modal>
  )
  

  function updatePaybackAmount(paybackAmountString: string){
    const paybackAmount: number = parseInt(paybackAmountString)
    setState({...state, paybackAmount})
  }


  function updateBorrowAmount(e){
    const borrowAmountString: string = e.target.value
    const borrowAmount: number = parseInt(borrowAmountString)
    setState({...state, borrowAmount})
  }

  
  function borrowMoney() {
    if(!state.borrowAmount)
      return
      
    if(state.borrowAmount > 500 ||
      loan.debt && state.borrowAmount + loan.debt > 500){
      alert(`you loan can't be bigger than 500`)
      return
    }
    const gameAction: ClientGameAction = {
      name: 'Borrow Money',
      data: { amount: state.borrowAmount }
    }
    sendUpdate(gameAction)
    setState({...state, borrowAmount: 0})
  }


  function paybackMoney() {
    if(!state.paybackAmount)
      return
    
    if(state.paybackAmount > money){
      alert(`you can't pay back more money than what you have`)
      return
    }

    if(state.paybackAmount > loan.debt){
      alert(`you can't pay back more than what you owe`)
      return
    }
    const gameAction: ClientGameAction = {
      name: 'Payback Money',
      data: { amount: state.paybackAmount }
    }
    sendUpdate(gameAction)
    setState({...state, paybackAmount: 0})
  }


  function handleEnterEvent(event){
    if(event.key == 'Enter')
      event.target.blur()
  }
}

