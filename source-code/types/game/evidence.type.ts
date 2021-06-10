import { AbilityData } from "../../game-components/abilities-general/ability";

export type IllegalActivityName = 'supplying illegal substances' | 'administering performance enhancing drugs' | 'administering with intent to harm' | 'solicitation to commit homicide' | 'solicited assault'

export const IllegalActivityName_Set =  new Set<IllegalActivityName>(['supplying illegal substances' , 'administering performance enhancing drugs' , 'administering with intent to harm' , 'solicitation to commit homicide' , 'solicited assault'])

export type Evidence = {
  managerName: string
  abilityData: AbilityData
  illegalActivity: IllegalActivityName
  evidenceDescription: string

}