const functionCounters = {}
export function count(key){
  functionCounters[key] = functionCounters[key] ? ++functionCounters[key] : 1
}
setInterval(() => {
  if(Object.keys(functionCounters).length)
    console.log('functionCounters :', functionCounters);
}, 3000);