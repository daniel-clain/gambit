import * as express from 'express';
import App from './app';

console.clear()

const server = express()
server.use(express.static('compiled-code/client'))
const serverPort = 3302
server.listen(serverPort, () => console.log('server listening on port ' + serverPort))

new App()

