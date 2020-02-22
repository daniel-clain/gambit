
import * as React from 'react';

export interface LoanSharkPanelProps{
  showLoanSharkCard()
}

export default class LoanSharkPanel extends React.Component<LoanSharkPanelProps> {
    
  render(){
    const {showLoanSharkCard} = this.props
    return (
      <div className='group-panel loan-shark'>
        <div className='heading'>Loan Shark</div>
        <button className='standard-button' onClick={showLoanSharkCard}>See Loan Shark</button>
      </div>
    )
  }
};
