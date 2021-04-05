import * as React from 'react';
import './money.scss'
export default function Money({money}: {money: number}){
  return <span className='money'>{money}</span>
}