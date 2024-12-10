/**
 *
 * @param number From 0 to x
 * @param startAtOne From 1 to x instead
 * @returns
 */

import { round } from "lodash"
import {
  FighterInfo,
  KnownFighterInfo,
  KnownFighterStat,
  StatName,
} from "../interfaces/front-end-state-interface"

export type OptionProbability<T> = {
  option: T
  probability: number
}

export function selectByProbability<T>(
  optionProbabilities: OptionProbability<T>[]
): T | undefined {
  const filteredOptionProbabilities = optionProbabilities.filter(
    (x) => x.probability
  )
  const totalProbability = filteredOptionProbabilities.reduce(
    (totalProbability, { probability }) =>
      totalProbability + (probability || 0),
    0
  )
  if (totalProbability < 1) {
    return undefined
  }
  const randomProbability = round(
    randomNumber({ from: 1, to: totalProbability }),
    2
  )
  let probabilityCount = 0

  const randomOption = filteredOptionProbabilities.find(({ probability }) => {
    if (
      randomProbability > probabilityCount &&
      randomProbability <= probabilityCount + probability
    )
      return true
    else probabilityCount += probability
  })!

  if (!randomOption) {
    debugger
  }
  return randomOption.option
}

export const shuffle = <T>(array: T[]): T[] => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export function toCamelCase(string: string): string {
  return string.toLowerCase().split(" ").join("-")
}

export function randomNumber({ from, to }: { from?: number; to: number }) {
  from = from || 0
  return Math.random() * (to - from) + from
}

export function toWrittenList(array: string[]): string {
  if (array.length == 1) return array[0]
  return array.reduce((text, loopItem, i) => {
    const isSecondLast = i == array.length - 2
    const isLast = i == array.length - 1
    const returnText =
      text + loopItem + (isSecondLast ? " and " : isLast ? "" : ", ")
    return returnText
  }, "")
}

export const percentageChance = ({
  percentage,
}: {
  percentage: number
}): boolean => {
  return percentage > Math.floor(Math.random() * 100)
}

export function check(
  value: number,
  func: (value: number) => [boolean, number][]
) {
  const array = func(value)
  let result = 0
  array.forEach(([condition, val]: [boolean, number]) => {
    if (condition) result = val
  })
  return result
}

export function numberLoop(
  amount: number,
  func: (number?: number) => void
): any[] {
  let returnVal: any[] = []
  for (let number = 1; number <= amount; number++) {
    returnVal.push(func(number))
  }
  return returnVal
}

export function deleteByProperty<T, T2 extends keyof T>({
  array,
  prop,
  val,
}: {
  array: T[]
  prop: T2
  val: any
}): void {
  const index = array.findIndex((item) => item[prop] == val)
  array.splice(index, 1)
}

export type RejectablePromise<T = void> = {
  promise: Promise<T>
  reject: (reason?: unknown) => void
}

export const randomNumberDigits = (digits: number) =>
  Math.round(Math.random() * Math.pow(10, digits))

export const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export function twoDec(num: number) {
  return Math.round(num * 100) / 100
}

export function convertFighterInfoToKnownFighterInfo(
  fighter: FighterInfo
): KnownFighterInfo {
  const { stats, name, goalContract, characterType } = fighter
  const statsNames = Object.keys(stats) as StatName[]

  const converted = statsNames.reduce((converted, statName) => {
    const obj: KnownFighterStat = {
      lastKnownValue: stats[statName],
      weeksSinceUpdated: 0,
    }

    return { ...converted, [statName]: obj }
  }, {} as Record<StatName, KnownFighterStat>)

  const knownFighterInfo: KnownFighterInfo = {
    name,
    stats: converted,
    goalContract,
    characterType,
  }
  return knownFighterInfo
}
