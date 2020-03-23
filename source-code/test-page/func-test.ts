type Cabbage = {
  ziCabbage: string
  sexy: boolean
}
export default function doThing(num: number): Cabbage{
  console.log('thing!');
  return {
    ziCabbage: 'chinatown',
    sexy: true
  }
}