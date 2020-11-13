const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const { startReportScan } = require('./reddit');

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await startReportScan()
    .then(() => {
      console.log('script complete');
    })
    .catch((err) => {
      console.log('no reports. script complete.');
    });
});