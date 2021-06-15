import Coords from "../interfaces/game/fighter/coords";
import { Angle } from "../types/game/angle";
/**
 * 
 * @param number From 0 to x
 * @param startAtOne From 1 to x instead
 * @returns 
 */
export function random(number: number, startAtOne?: boolean){return Math.round((Math.random() * (number + (startAtOne ? -1 : 0))) + (startAtOne ? 1 : 0))}
export function randomFloor(number: number, startAtOne?: boolean){return Math.floor((Math.random() * (number + (startAtOne ? -1 : 0))) + (startAtOne ? 1 : 0))}

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
export const randomNumber = ({digits}:{digits: number}) => Math.round(Math.random() * Math.pow(10, digits))


export const wait = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds))

export const getDistanceBetweenTwoPoints = (point1: Coords, point2: Coords): number =>{
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + 
    Math.pow(point1.y - point2.y, 2)
  )
}

export function getPointGivenDistanceAndDirectionFromOtherPoint(point: Coords, distance: number, direction: Angle): Coords{
  const hypotenuse = distance
  let {x, y} = point

  if(direction < 90){
    const angle = direction - 0
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x += Math.round(sinAngle * hypotenuse)
    y += Math.round(cosAngle * hypotenuse)
  }
  else if(direction < 180){
    const angle = direction - 90
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x += Math.round(cosAngle * hypotenuse)
    y -= Math.round(sinAngle * hypotenuse)
  }
  else if(direction < 270){
    const angle = direction - 180
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x -= Math.round(sinAngle * hypotenuse)
    y -= Math.round(cosAngle * hypotenuse)
  }
  else if(direction < 360){
    const angle = direction - 270
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x -= Math.round(cosAngle * hypotenuse)
    y += Math.round(sinAngle * hypotenuse)

  }






  const sinAngle = Math.sin(direction * (Math.PI/180))
  const cosAngle = Math.cos(direction * (Math.PI/180))

  
  return {x, y}
}


export const getDirectionOfPosition2FromPosition1 = (pos1: Coords, pos2: Coords): Angle => {
  let directionOfPosition2FromPosition1: Angle
  let xLength = pos2.x - pos1.x
  let yLength = pos2.y - pos1.y
  let adjacentSide
  let oppositeSide
  let addedDegrees
  if(xLength == 0 && yLength == 0)
    return 0
  if (xLength < 0 && yLength >= 0) {
    oppositeSide = yLength
    adjacentSide = xLength * -1
    addedDegrees = 270
  }
  if (xLength < 0 && yLength < 0) {
    adjacentSide = yLength * -1
    oppositeSide = xLength * -1
    addedDegrees = 180
  }
  if (xLength >= 0 && yLength < 0) {
    oppositeSide = yLength * -1
    adjacentSide = xLength
    addedDegrees = 90
  }
  if (xLength >= 0 && yLength >= 0) {
    adjacentSide = yLength
    oppositeSide = xLength
    addedDegrees = 0
  }

  const degrees = Math.round(Math.atan(oppositeSide / adjacentSide) * (180 / Math.PI))
  directionOfPosition2FromPosition1 = degrees + addedDegrees

  if(isNaN(directionOfPosition2FromPosition1))
    debugger

  if(degrees + addedDegrees == 360){
    directionOfPosition2FromPosition1 = 0
  }

  return directionOfPosition2FromPosition1
}

export function getSmallestAngleBetween2Directions(direction1: Angle, direction2: Angle){
  const {biggest, smallest} = direction1 > direction2 ? {biggest: direction1, smallest: direction2} : { biggest: direction2, smallest: direction1}
  
  if(biggest - smallest > 180)
    return 360 - biggest + smallest
  else
    return biggest - smallest
}

export function subtractAngle2FromAngle1(angle1: Angle, angle2: Angle): Angle {
  validateAngle(angle1)
  validateAngle(angle2)
  if(angle1 >= angle2)
    return angle1 - angle2
  else
    return 360 + angle1 - angle2
}

export function add2Angles(angle1: Angle, angle2: Angle) {
  validateAngle(angle1)
  validateAngle(angle2)

  let returnAngle
  const addedAngles = angle1 + angle2
  if(addedAngles >= 360)
    returnAngle = addedAngles % 360
  else
    returnAngle = addedAngles
  
  validateAngle(returnAngle)
  return returnAngle
}

export function validateAngle(angle: Angle): Angle{
  if(angle >= 360 || angle < 0)
    throw 'angle is invalid: ' + angle
  
  return angle
}


export const unwrapToBody = selector => {
  const element = document.querySelector(selector)
  const parentElement = element.parentElement
  if(parentElement.tagName.toLowerCase() == 'body') {
    const siblings = document.querySelectorAll(`body > *:not(${selector})`)
    siblings.forEach(sibling => sibling.remove())
    return
  }
  replaceParentWithElement()
  unwrapToBody(selector)


  function replaceParentWithElement(){
    parentElement.outerHTML = element.outerHTML
  }
}




