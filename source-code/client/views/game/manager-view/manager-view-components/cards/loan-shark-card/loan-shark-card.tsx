
import * as React from 'react';
import './loan-shark-card.scss'
import { useState } from 'react';
import { Modal } from '../../partials/modal/modal';
import gameConfiguration from '../../../../../../../game-settings/game-configuration';
import { observer } from 'mobx-react';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { websocketService } from '../../../../../../front-end-service/websocket-service';

export const LoanSharkCard = observer(() => {
  const {
    serverUIState: {serverGameUIState: {
      playerManagerUIState: {managerInfo: {loan, money}}
    }}
  } = frontEndState

  const [state, setState] = useState({
    paybackAmount: undefined,
    borrowAmount: undefined
  })

  console.log(loan)
 

  const {borrowAmount, paybackAmount} = state
  const {minimumAmountToPayBackEachWeek, interestAddedPerWeek, weeksOfNoPaybackUntilRespond} = gameConfiguration.loanSharkSettings

  return (
    <Modal>
      <div className='card loan-shark-card'>
        <div className='heading'>Loan Shark</div>
        <div className="card__two-columns">

          <div className='loan-shark-card__image card__two-columns__left'></div>

          <div className='card__two-columns__right'>
            <div className='loan-shark-card__info'>
              Hey buddy, ill loan you money, interest will be {interestAddedPerWeek * 100}% of what you owe added on each week. You must pay me back a minimum of {minimumAmountToPayBackEachWeek} and if you don't pay the minimum {weeksOfNoPaybackUntilRespond} weeks in a row...... well, you'll find out what happens, and you wont like it.....
            </div>            
          </div>
        </div>
        {loan ? <>
          <div className='loan-shark-card__debt'>
            Your Debt is: {loan.debt}
          </div>
          {loan.weeksOverdue > 0 && loan.amountPaidBackThisWeek < 50 ?
            <div className='loan-shark-card__debt'>
              You are <strong>{loan.weeksOverdue}</strong> week{loan.weeksOverdue > 1 && 's'} overdue!
            </div>
            : ''
          }
        </>: ''}
        
        <div className='loan-shark-card__loan-tool'>
          <div className='loan-shark-card__loan-tool__left'>
            <div className='loan-shark-card__loan-tool__heading'>
              Get Loan
              </div>
            <div className='get-loan-input'>
              Borrow amount: 
              <input 
                value={borrowAmount > 0 ? borrowAmount : ''} 
                onChange={updateBorrowAmount}  
                onKeyPress={handleEnterEvent}
                type='number' step='10' min='0' max='500' 
              />
            </div>
            <button 
              className='standard-button borrow-money-submit'
              onClick={borrowMoney}
            >
              Submit
            </button>
            
          </div>
          
          <div className='loan-shark-card__loan-tool__right'><div className='loan-shark-card__loan-tool__heading'>Pay Off Debt</div>
            <div className='pay-back-input'>
              Pay back amount: 
              <input 
                value={paybackAmount > 0 ? paybackAmount : ''} 
                onChange={e => updatePaybackAmount(e.target.value)} 
                onKeyPress={handleEnterEvent}
                type='number' step='10' min='0' max='500' 
              />
              <button 
                className='standard-button payback-money-submit' 
                onClick={paybackMoney}
              >
                Submit
              </button>
            </div>
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
      loan?.debt && state.borrowAmount + loan.debt > 500){
      alert(`You can not get a loan be bigger than 500`)
      return
    }
    websocketService.sendUpdate.borrowMoney(state.borrowAmount)
    setState({...state, borrowAmount: 0})
  }


  function paybackMoney() {
    if(!state.paybackAmount)
      return
    
    if(state.paybackAmount > money){
      alert(`You can't pay back more money than what you have`)
      return
    }

    if(state.paybackAmount > loan.debt){
      alert(`You can't pay back more than what you owe`)
      return
    }
    websocketService.sendUpdate.payBackMoney(state.paybackAmount)
    setState({...state, paybackAmount: 0})
  }


  function handleEnterEvent(event){
    if(event.key == 'Enter')
      event.target.blur()
  }
})


