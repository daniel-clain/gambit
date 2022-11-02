import * as React from 'react';
import { Modal } from '../../partials/modal/modal';
import './managers-card.scss'
import '../../main-components/manager-list.scss'
import {observer} from 'mobx-react'
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { showManager } from '../../../../../../front-end-service/front-end-service';
import { toCamelCase } from '../../../../../../../helper-functions/helper-functions';


export const ManagersCard = observer(() => {

  const {
    clientUIState: {
      clientPreGameUIState: {clientName}
    },
    serverUIState:{serverGameUIState}
  } = frontEndState
  const {managerInfo: {otherManagers}} = serverGameUIState!.playerManagerUIState!

  
  return <Modal>
    <div className='panel'>
      <div className='card__heading heading'>Managers</div>
      <div className="list manager-list">
        {otherManagers.map(manager => 
          <div key={manager.name} className={'list__row manager'}  onClick={() => showManager(manager.name)}>              
            <div className={`manager__image manager__image--${toCamelCase(manager.image)}`}></div>
            <div className="manager__name">{
              `${manager.name == clientName ? '****' : ''} ${manager.name} `
            }</div>
          </div>
        )}
      </div>
    </div>
  </Modal>
})

