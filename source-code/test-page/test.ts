const originalArray = [
  {name: 'bob', ears: 3},
  {name: 'jim', ears: 8}
]

const myArray = []
myArray.push(originalArray.find(x => x.name == 'bob'))

const bob = originalArray.find(x => x.name == 'bob')
bob.ears += 2

const bobIndex = originalArray.findIndex(x => x.name == 'bob')

originalArray.splice(bobIndex,1)
bob.ears += 7

console.log(myArray);