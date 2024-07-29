const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors()); // 어떤 주소로든 접근을 허용한다.

module.exports = app;
