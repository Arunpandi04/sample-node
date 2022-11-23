const express = require('express');
const bodyParser =  require('body-parser');
const cors = require('cors');
const app = express();
const getUserRoutes = require('./Service/userServicer');
const initializeDBConnection = require('./Config/db');
require('dotenv').config();

const port = 3003

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));

app.use('/api', getUserRoutes(router));

app.listen(port, async() => {
  await initializeDBConnection();
  console.log(`Example app listening at http://localhost:${port}`)
})