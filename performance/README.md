# API performance tests

The k6 script exercises the main HTTP routes covered by `tests/api.spec.ts`:
the home page, Add/Remove Elements, Checkboxes, Dropdown, login/authentication,
the Status Codes index, and the 200/301/404/500 status endpoints. The first
three feature pages are HTML-only; their controls do not expose a REST API.
The status-code endpoints intentionally return their named non-2xx statuses.

## Requirements and configuration

Install [Grafana k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).
The default target is `https://the-internet.herokuapp.com`; override it with
`BASE_URL`. Choose a test profile with `PROFILE` or use one of the npm scripts:

- `smoke`: 1 virtual user for 10 seconds.
- `load`: ramp from 1 to 20 virtual users over two minutes.
- `stress`: ramp to and hold at 60 virtual users for a short stress run.

All profiles check HTTP status and page content, and apply thresholds to
request failures, checks, and response latency. Login uses the sample app
credentials; override them with `USERNAME` and `PASSWORD` if required.

```sh
npm run perf:smoke
BASE_URL=https://the-internet.herokuapp.com npm run perf:load
BASE_URL=https://the-internet.herokuapp.com npm run perf:stress
```

## Live web dashboard

Enable k6's local web dashboard, run a test, then open the dashboard URL in a
browser while the test is running:

```sh
K6_WEB_DASHBOARD=true npm run perf:load
```

Open <http://localhost:5665>. The dashboard listens on port `5665` by default.

## Save HTML and JSON reports

The HTML dashboard export is written when the run finishes. The JSON summary is
also written at the end of the run. Generated files are ignored by Git.

```sh
mkdir -p k6-reports
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_PERIOD=1s \
K6_WEB_DASHBOARD_EXPORT=k6-reports/api-performance.html \
npm run perf:load -- --summary-export=k6-reports/api-performance-summary.json
```

## Send results to Grafana Cloud k6

Authenticate the k6 CLI once with a Grafana Cloud k6 API token, then run the
script with the cloud output enabled:

```sh
k6 cloud login --token "$K6_CLOUD_TOKEN"
BASE_URL=https://the-internet.herokuapp.com \
k6 run --out cloud -e PROFILE=load performance/api-performance.js
```

Alternatively, use `k6 cloud run performance/api-performance.js` to execute
the test in Grafana Cloud. A cloud load generator must be able to reach the
configured `BASE_URL`.
