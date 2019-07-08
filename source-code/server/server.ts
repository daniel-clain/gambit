import ServerWebsocketService from './server-websocket.service';
import * as express from 'express';

console.clear()
const app = express()
const serverPort = 4444
const websocketPort = 69
console.log(Date());
app.use(express.static('compiled-code/client'))
app.listen(serverPort, () => console.log('server listening on port ' + serverPort))
new ServerWebsocketService(websocketPort)