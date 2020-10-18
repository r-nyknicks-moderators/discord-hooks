const { startReportScan } = require('./reddit');
const { closeConnection } = require('./database');

(async function() {
  await startReportScan();
})();