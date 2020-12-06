
import * as React from 'react';

export interface LoanSharkPanelProps{
  showLoanSharkCard()
}

const LoanSharkPanel = ({showLoanSharkCard}:LoanSharkPanelProps) => {      
  return (
    <div className='group-panel loan-shark'>
      <div className='heading'>Loan Shark</div>
      <button className='standard-button' onClick={showLoanSharkCard}>See Loan Shark</button>
    </div>
  )
};
export default class 
