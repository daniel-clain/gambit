import {ManagerOptionNames} from './manager-options/manager-option';
import { EmployeeTypes } from '../../../interfaces/game-ui-state.interface';

export interface IManagerAction{
  name: ManagerOptionNames
  source: {
    name: string,
    type: 'Manager' | EmployeeTypes
  }
  target: {
    name: string
    targetType: 'Manager' | 'Fighter'
  }
  args: any
}