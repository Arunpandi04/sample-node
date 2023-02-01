import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import getUserRoutes from './Service/userServicer';
import initializeDBConnection from './Config/db';
import * as dotenv from 'dotenv'

dotenv.config();

const port = 5000

const app = express();

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));

app.use('/api', getUserRoutes(router));

app.listen(port, async() => {
  await initializeDBConnection();
  console.log(`Example app listening at http://localhost:${port}`)
})