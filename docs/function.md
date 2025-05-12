# PromQL function

## Time series Queries

### Rate

- `rate(range vector)`: checks for frequency.
- `irate(range vector)`: checks for volatility.

> Rate !+ Counter, Histogram

### Delta

- `delta(range vector)`: difference between first and last.

> Delta !+ Gauge

## Aggregate functions

### Sum

- `sum(range vector)`: Get sum.

### Sum by

- `sum by(fields) (range vector)`: Get sum by fields.

### Avg

- `avg(range vector)`: Get avg.

### Max

- `max(range vector)`: Get max.

### Min

- `min(range vector)`: Get min.

## Aggregation over time functions

### Sum over time

- `sum_over_time(range vector)`: Get sum overtime.

### Avg over time

- `avg_over_time(range vector)`: Get avg overtime.

### Min over time

- `min_over_time(range vector)`: Get min overtime.

### Max over time

- `max_over_time(range vector)`: Get max overtime.

## Histogram queries

### Histogram quantile

- Given distribution (http request duration)

```
sum by (le) (http_requests_duration_bucket{route="/healthz"})
```

Calculate time execution for x% of requests

```
histogram_quantile(x, sum by (le) (http_requests_duration_bucket{route="/healthz"}))
```

## Averages and totals

e.g.

```
seconds / request = rate(request_duration[5m]) / rate(total_requests[5m])
```

### Increase

`increase (range vector)`: Get increase between first and last.

> Increase !+ Counter

## Label Manipulation

### Label replace

`label_replace(metric, new_label, value, old_label, regex)`
