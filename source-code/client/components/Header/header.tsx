
import * as React from 'react'
import styled from 'styled-components'
import Connection from './Connection/connection';
import ConnectionStates from '../../../types/connection-states';

const HeaderStyle = styled.div`
  height: 4rem;
  border-bottom: 1px solid;
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: row-reverse;
  justify-content: right;
  align-items: center;
`

type Props = {
  connectionState: ConnectionStates
}

export default class Header extends React.Component<Props>{

  render(){
    return (
      <HeaderStyle id='header'>
        <Connection connectionState={this.props.connectionState}></Connection>
      </HeaderStyle>
    )    
  }
}