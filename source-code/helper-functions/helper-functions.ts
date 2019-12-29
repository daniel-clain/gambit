
export function random(number: number, startAtOne?: boolean){return Math.floor((Math.random() * (number + (startAtOne ? -1 : 0))) + (startAtOne ? 1 : 0))}

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

export const timer = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds))



