const express = require("express");
const port = 8000;

const app = express();

const prometheus = require("prom-client");
const register = new prometheus.Registry();

register.setDefaultLabels({
  app: "greeting-metric",
});

prometheus.collectDefaultMetrics({ register });

const httpRequestCounter = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "statusCode"],
  registers: [register],
});

register.registerMetric(httpRequestCounter);

const httpRequestHistogram = new prometheus.Histogram({
  name: "http_requests_duration",
  help: "Http requests duration counter",
  labelNames: ["method", "route", "statusCode"],
  buckets: [1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000],
});

register.registerMetric(httpRequestHistogram);

app.use((req, res, next) => {
  res.locals.startEpoch = Date.now();

  res.on("finish", () => {
    const responseTimeInMilliseconds = Date.now() - res.locals.startEpoch;

    httpRequestHistogram.observe(
      {
        method: req.method,
        route: req.originalUrl,
        statusCode: req.statusCode,
      },
      responseTimeInMilliseconds
    );

    httpRequestCounter.inc({
      method: req.method,
      route: req.originalUrl,
      statusCode: req.statusCode,
    });
  });

  next();
});

app.get("/healthz", (req, res) => {
  res.send("Hello World!");
});

app.get("/long-res", (req, res) => {
  setTimeout(() => {
    res.send("Hello World");
  }, 500);
});

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  const data = await register.metrics();
  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Metrics available at http://localhost:${port}/metrics`);
});
