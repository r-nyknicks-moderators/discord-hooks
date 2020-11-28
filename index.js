const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const { startReportScan } = require('./reddit');
const { connectToDataBase } = require('./database');

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await startReportScan();
});
