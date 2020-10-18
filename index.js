const { startReportScan } = require('./reddit');
const { closeConnection } = require('./database');

(async function() {
  setInterval(async () => {
    await startReportScan();
  }, 60000);
})();