
import * as React from 'react';
import './loan-shark-card.scss'
import { Loan } from '../../../../../interfaces/game-ui-state.interface';
import PlayerAction from '../../../../../interfaces/player-action';

export interface LoanSharkCardProps{
  loan: Loan
  money: number
  sendPlayerAction(playerAction: PlayerAction): void
}

interface LoanSharkCardState{
  paybackAmount: number, 
  borrowAmount: number
}

export default class LoanSharkCard extends React.Component<LoanSharkCardProps>{
  state: LoanSharkCardState = {
    paybackAmount: undefined,
    borrowAmount: undefined
  }

  updatePaybackAmount = (paybackAmountString: string) => {
    const paybackAmount: number = parseInt(paybackAmountString)
    this.setState({paybackAmount})
  }
  updateBorrowAmount = (borrowAmountString: string) => {
    const borrowAmount: number = parseInt(borrowAmountString)
    this.setState({borrowAmount})
  }

  
  borrowMoney() {
    if(!this.state.borrowAmount)
      return
      
    if(this.state.borrowAmount > 500 ||
      this.props.loan.debt && this.state.borrowAmount + this.props.loan.debt > 500){
      alert(`you loan can't be bigger than 500`)
      return
    }
    const playerAction: PlayerAction = {
      name: 'Borrow Money',
      args: { amount: this.state.borrowAmount }
    }
    this.props.sendPlayerAction(playerAction)
    this.setState({borrowAmount: 0})
  }

  paybackMoney() {
    if(!this.state.paybackAmount)
      return
    
    if(this.state.paybackAmount > this.props.money){
      alert(`you can't pay back more money than what you have`)
      return
    }

    if(this.state.paybackAmount > this.props.loan.debt){
      alert(`you can't pay back more than what you owe`)
      return
    }
    const playerAction: PlayerAction = {
      name: 'Payback Money',
      args: { amount: this.state.paybackAmount }
    }
    this.props.sendPlayerAction(playerAction)
    this.setState({paybackAmount: 0})
  }

  render(){

    const {debt, weeksOverdue} = this.props.loan    
    const {borrowAmount, paybackAmount} = this.state


    return (
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
                onChange={e => this.updatePaybackAmount(e.target.value)} 
                type='number' step='10' min='0' max='500' 
              />
              <button className='standard-button payback-money-submit' onClick={this.paybackMoney.bind(this)}>Submit</button>
            </div>
          </div>
          
          <div className='loan-shark-card__loan-tool__right'>
            <div className='loan-shark-card__loan-tool__heading'>Get Loan</div>
            <div className='get-loan-input'>
              Borrow amount: 
              <input 
                value={borrowAmount > 0 ? borrowAmount : ''} 
                onChange={e => this.updateBorrowAmount(e.target.value)} 
                type='number' step='10' min='0' max='500' 
              />
            </div>
            <button className='standard-button borrow-money-submit'
              onClick={this.borrowMoney.bind(this)}>Submit</button>
          </div>

        </div>        
      </div>
    )
  }
}

