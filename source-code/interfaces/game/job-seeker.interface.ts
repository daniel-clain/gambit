import {Contract} from './contract.interface';
import { EmployeeTypes } from '../../client/manager-ui-test/options-breakdown/employee';
import SkillLevel from '../../types/skill-level.type';

export interface JobSeeker{
  name: string
  type: EmployeeTypes
  offeredContract: Contract
  skill: SkillLevel
  
}