
import * as express from 'express';
import {GameHost} from './source-code/game-host/game-host';
import * as env from 'dotenv'
console.log('come on mate...')
env.config()

new GameHost()

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('host-packages'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));