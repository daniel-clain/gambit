import { random } from "../helper-functions/helper-functions"

let cancel
let knockedOut
const go = async () => {
	try{
		if(random(1)==1){
			knockedOut = true
			console.log('knocked out');
		}
		console.log('doing take hit');
		await new Promise((resolve, reject) => {
			cancel=reject
			setTimeout(() => {
				resolve()
			}, 4000);
		})
		.then(() => {
			console.log('take hit cooldown')
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					cancel=reject
					resolve()
				}, 1000);
			});
		})
		.finally(() => {
			if(knockedOut){
				console.warn(`fighter has been knocked out`);
			}
		})    
	}
	catch(reason){
		console.log(`take hit was interupted because ${reason}`);
		return
	}
	console.log('taking hit finished');
	if(knockedOut)
		console.log('no decide action becasue knocked out');
}

go()

setTimeout(() => {
	cancel('cock n balls')
}, 200);