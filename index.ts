import * as express from 'express'
import * as env from 'dotenv'
import {GameHost} from './source-code/game-host/game-host';
env.config()

console.log('come on mate...')
new GameHost()

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('host-packages'));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(`${__dirname}/favicon.ico`)
})
app.get('*', (req, res) => {
  console.log('req.url :>> ', req.url);
  res.send('Hello World!')
})
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
