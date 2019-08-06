
import * as React from 'react';
import { Loan } from '../../../interfaces/game-ui-state.interface';

interface LoanSharkCardProps{
  loan: Loan
  paybackMoney(amount: number)
  borrowMoney(amount: number)
}


export default class LoanSharkCard extends React.Component<LoanSharkCardProps>{

  paybackAmount: number
  borrowAmount: number

  updatePaybackAmount = (e) => {
    this.paybackAmount = parseInt(e.target.value)
  }
  updateLoanAmount = (e) => {
    this.borrowAmount = parseInt(e.target.value)
  }

  submitBorrowAmount(){
    this.props.borrowMoney(this.borrowAmount)
  }
  submitPaybackAmount(){
    this.props.paybackMoney(this.paybackAmount)
  }


  render(){

    const {debt} = this.props.loan
    


    return (
      <div className='loan-shark-card'>

        <div className='loan-shark-card__image loan-shark-card__left'></div>

        <div className='loan-shark-card__content loan-shark-card__right'>
          <div className='loan-shark-card__info'>
            Hey buddy, ill loan you money, but each week you don't pay me back you build up intrest, 10% of what you owe added on each week. If you owe me more than 500 and you dont pay me back in 3 weeks...... well, you'll find out what happens, and you wont like it.....
          </div>
          <div className='loan-shark-card__debt'>
            Your Debt is: {debt}
          </div>
          
          <div className='loan-shark-card__loan-tool'>
            <div className='left'>
              <div className='heading'>Pay Off Debt</div>
              <div className='pay-back-input'>
                Pay back amount: <input onChange={this.updatePaybackAmount} />
                <button className='standard-button payback-money-submit' onClick={this.submitPaybackAmount}>Submit</button>
              </div>
            </div>
            
            <div className='right'>
              <div className='heading'>Get Loan</div>
              <div className='get-loan-input'>
                Borrow amount: <input onInput={this.updateLoanAmount} />
              </div>
              <button className='standard-button borrow-money-submit'
                onClick={this.submitBorrowAmount.bind(this)}>Submit</button>
            </div>

          </div>          
        </div>
      </div>
    )
  }
}

