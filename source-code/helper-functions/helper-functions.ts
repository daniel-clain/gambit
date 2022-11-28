import { dir } from "console";
import Coords from "../interfaces/game/fighter/coords";
import { Angle } from "../types/game/angle";
/**
 * 
 * @param number From 0 to x
 * @param startAtOne From 1 to x instead
 * @returns 
 */

 export type OptionProbability<T> = {
  option: T, 
  probability: number
}

export function selectByProbability<T>(optionProbabilities: OptionProbability<T>[]): T {
  const filteredOptionProbabilities = optionProbabilities.filter(x => x.probability)
  const totalProbability = filteredOptionProbabilities.reduce(
    (totalProbability, {probability}) => 
      totalProbability + (probability || 0), 0
  )
  const randomProbability = randomNumber({from: 1, to: totalProbability})
  let probabilityCount = 0
  const randomOption = filteredOptionProbabilities.find(
    ({probability}) => {
      if(
        randomProbability > probabilityCount &&
        randomProbability <= probabilityCount + probability
      )
        return true
      else
        probabilityCount += probability
    }
  )

  return randomOption?.option
}

export const shuffle = <T>(array: T[]): T[] => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function toCamelCase(string: string): string{
  return string.toLowerCase().split(' ').join('-')
}


export function randomNumber({from, to}:{from?: number, to: number}){
  from = from || 0
  return Math.round(Math.random()*(to-from) + from)
}


export function toWrittenList(array: string[]): string {
  if(array.length == 1) return array[0]
  return array.reduce((text, loopItem, i) => {
    const isSecondLast = i == array.length - 2
    const isLast = i == array.length - 1
    const returnText = text + loopItem + (isSecondLast ? ' and ' : isLast ? '' : ', ')
    return returnText

  }, '')


}

export const percentageChance = ({percentage}: {percentage: number}): boolean => {
  return percentage > Math.floor((Math.random() * 100))
}

export function check(value: number, func: (value: number) => [boolean, number][]){
  const array = func(value)
  let result = 0
  array.forEach(([condition, val]: [boolean, number]) => {
    if(condition) result = val
  })
  return result
}

export function numberLoop(amount: number, func: (number?: number) => void): any[] {
  let returnVal: any[] = []
  for(let number = 1; number <= amount; number++){
    returnVal.push(func(number))
  }
  return returnVal
}

export function deleteByProperty<T, T2 extends keyof T>(
  {array, prop, val}:
  {array: T[], prop: T2, val:any}
): void{
  const index = array.findIndex(item => item[prop] == val)
  array.splice(index, 1)
}

export type RejectablePromise<T = void> = {
  promise: Promise<T>
  reject: (reason?: unknown) => void
}


export const randomNumberDigits = (digits: number) => Math.round(Math.random() * Math.pow(10, digits))


export const wait = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds))


let bounceObj: {
  id
  timeout,
  reject
}[] = []
export function debounce(functionId: string): Promise<void>{
  return new Promise((resolve, reject) => {
    const existing = bounceObj.find(b => b.id == functionId)

    if(existing){
      clearTimeout(existing.timeout)
      existing.reject()
      bounceObj = bounceObj.filter(b => b.id != functionId)
    } 


    bounceObj.push({
      id: functionId,
      timeout: setTimeout(() => {
        resolve()
        bounceObj = bounceObj.filter(b => b.id != functionId)
      }, 500),
      reject
    })

  });
}
export function twoDec(num: number){
  return (Math.round((num) * 100) / 100)
}