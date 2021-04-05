export const UtilityFunctions = {
  randomNumber: ({digits}:{digits: number}) => Math.round(Math.random() * Math.pow(10, digits)).toString()
}