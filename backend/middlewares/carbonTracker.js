const { co2 } = require('@tgwf/co2');

// Initialize CO2.js with the Sustainable Web Design model
const co2Emission = new co2({ model: 'swd' });

/**
 * Middleware to track data transfer size and estimate carbon emissions
 * for each HTTP request/response cycle.
 * 
 * Logs the total bytes transferred and estimated CO2 emissions to the console.
 */
const carbonTracker = (req, res, next) => {
  let requestBytes = 0;
  let responseBytes = 0;

  // Calculate request size
  if (req.body) {
    requestBytes = Buffer.byteLength(JSON.stringify(req.body), 'utf8');
  }
  if (req.query) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.query), 'utf8');
  }
  if (req.headers) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.headers), 'utf8');
  }

  // Override res.write to calculate response size
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8');
    }
    originalWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8');
    }

    // Store total bytes
    const totalBytes = requestBytes + responseBytes;

    // Calculate carbon emissions
    // Set to true if your server is hosted on a green host
    const greenHost = false;
    const emissions = co2Emission.perByte(totalBytes, greenHost);

    console.log(`[Carbon Tracker] ${req.method} ${req.originalUrl} — Data transferred: ${totalBytes} bytes — Estimated CO2 emissions: ${emissions.toFixed(5)} grams`);

    originalEnd.apply(res, arguments);
  };

  next();
};

module.exports = carbonTracker;
