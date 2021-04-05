import * as express from 'express'
import * as env from 'dotenv'
env.config()

console.log('come on mate...')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('host-packages'));
app.get('*', (req, res) => {
  console.log('req.url :>> ', req.url);
  res.send('Hello World!')
})
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
