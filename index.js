const dotenv = require('dotenv');
dotenv.config();
const { startReportScan } = require('./reddit');

(async function () {
  setInterval(async () => {
    await startReportScan();
  }, 60000);
})();
