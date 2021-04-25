import * as React from 'react';
import { KnownManager } from "../../../../../../../game-components/manager";
import {connect, ConnectedProps} from 'react-redux'
import { FrontEndState } from "../../../../../../../interfaces/front-end-state-interface";
import { Modal } from '../../partials/modal/modal';
import './managers-card.scss'
import { frontEndService } from '../../../../../../front-end-service/front-end-service';
import { SetStateManagerUIAction } from '../../../../../../front-end-state/reducers/manager-ui.reducer';


const ManagersCard = ({
  managers, clientName, selectManager
}: PropsFromRedux) => {
  
  return <Modal>
    <div className='panel known-fighters'>
      <div className='card__heading heading'>Managers</div>
      <div className="list managers-container">
        {managers.map(manager => 
          <div key={manager.name} className={'list__row manager'}  onClick={() => selectManager(manager)}>              
            <div className={`manager__image manager__image--${manager.image.toLowerCase().replace(' ', '-')}`}></div>
            <div className="manager__name">{
              `${manager.name == clientName ? '****' : ''} ${manager.name} `
            }</div>
          </div>
        )}
      </div>
    </div>
  </Modal>
}

const mapState = (({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {managerInfo}
  }},
  clientUIState: {clientPreGameUIState: {clientName}}
}: FrontEndState) => ({
  managers: managerInfo.otherManagers, clientName
}))

const mapDispatch = {
  selectManager: (manager: KnownManager): SetStateManagerUIAction => ({type: 'showManagerOptions', payload: manager })
}


const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(ManagersCard)