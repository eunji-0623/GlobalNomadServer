const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors()); // 어떤 주소로든 접근을 허용한다.

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to database'));
// then은 mongoose.connect가 실행됐다면 console.log를 수행하라는 의미

module.exports = app;
