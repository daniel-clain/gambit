
import { Profession } from "../types/game/profession";
import { AbilityName } from "./abilities-general/ability";

export const getProfessionalsAbilities = (profession: Profession): AbilityName[] => {
  switch (profession) {
    case 'Lawyer':
      return ['Prosecute Manager', 'Gather Evidence']
    case 'Thug':
      return ['Guard Fighter', 'Assault Fighter']
    case 'Drug Dealer':
      return ['Sell Drugs']
    case 'Talent Scout':
      return ['Research Fighter', 'Offer Contract']
    case 'Private Agent':
      return ['Poison Fighter', 'Do Surveillance', 'Research Fighter', 'Gather Evidence']
    case 'Hitman':
      return ['Poison Fighter', 'Murder Fighter']
    case 'Promoter':
      return ['Promote Fighter']
    case 'Trainer':
      return ['Train Fighter']
  }
}
