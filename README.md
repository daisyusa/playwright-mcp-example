# Playwright MCP testing demo

This repository demonstrates a testing workflow using the [Playwright MCP
server](https://github.com/microsoft/playwright-mcp): after installing playwright mcp server in visual studio code, go to extensions in VSC, find playwright, click the gear icon and Start server first. Explore a web app in a
browser, turn observations into manual test cases, automate browser and HTTP
checks with Playwright, and measure endpoint performance with Grafana k6.

The example target is [The Internet](https://the-internet.herokuapp.com/).
It is a public demo site, so availability and performance depend on the
external service. The application is not hosted by this repository.

## What is included

- [Manual test cases](tests/manual-test-cases.md) for five app areas:
  Add/Remove Elements, Checkboxes, Dropdown, Form Authentication, and Status
  Codes.
- Playwright UI and HTTP/API tests in [`tests/`](tests/).
- Page objects with reusable page actions in [`pages/`](pages/) and shared
  Playwright fixtures in [`fixtures/`](fixtures/fixtures.ts).
- Grafana k6 performance profiles, export instructions, and Cloud guidance in
  [`performance/`](performance/).

The Add/Remove Elements, Checkboxes, and Dropdown examples do not expose
separate REST APIs. Their API tests check the HTTP response and HTML page;
the actual interactions are covered by browser UI tests.

## Requirements

- Node.js and npm
- Playwright browsers: install with `npx playwright install`
- Grafana k6 for performance tests: [installation instructions](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- A Playwright MCP-compatible client/server if you want to repeat the
  interactive browser exploration workflow. The automated test suite runs
  through Playwright Test and does not require an MCP server.

Install the JavaScript dependencies and browsers:

```sh
npm ci
npx playwright install
```

## Explore and create manual cases with Playwright MCP

Connect a Playwright MCP-compatible agent to
`https://the-internet.herokuapp.com`, inspect the page and interactions, then
record reproducible steps and expected outcomes in
[`tests/manual-test-cases.md`](tests/manual-test-cases.md). The existing manual
cases are the reference for the automated examples in this repository.

## Run Playwright automation

Run the UI and HTTP/API tests across Chromium, Firefox, and WebKit:

```sh
npm test
```

Run one browser project or one spec file:

```sh
npx playwright test --project=chromium
npx playwright test tests/ui.spec.ts
npx playwright test tests/api.spec.ts
```

The configured Playwright target is `https://the-internet.herokuapp.com` in
[`playwright.config.ts`](playwright.config.ts). Test files use page objects
from `pages/` and fixture setup from `fixtures/fixtures.ts`.

## Run k6 performance tests

Install Grafana k6 separately, then run a profile:

```sh
npm run perf:smoke
BASE_URL=https://the-internet.herokuapp.com npm run perf:load
BASE_URL=https://the-internet.herokuapp.com npm run perf:stress
```

`BASE_URL` configures the target. `USERNAME` and `PASSWORD` can override the
sample login credentials. The profiles and thresholds are:

- `smoke`: 1 virtual user for 10 seconds.
- `load`: ramp up to 20 virtual users, then ramp down.
- `stress`: ramp up to and hold at 60 virtual users, then ramp down.

Each profile checks expected status codes and response content, including the
intentionally non-2xx Status Codes examples, and enforces thresholds for
request failures, check success, and latency.

### Live dashboard

Start the k6 web dashboard with a performance run and open
<http://localhost:5665> while it is running:

```sh
K6_WEB_DASHBOARD=true npm run perf:load
```

### Export HTML and JSON reports

The generated `k6-reports/` directory is ignored by Git:

```sh
mkdir -p k6-reports
K6_WEB_DASHBOARD=true \
K6_WEB_DASHBOARD_PERIOD=1s \
K6_WEB_DASHBOARD_EXPORT=k6-reports/api-performance.html \
npm run perf:load -- --summary-export=k6-reports/api-performance-summary.json
```

### Send results to Grafana Cloud k6

Set up an API token in Grafana Cloud k6 and authenticate the local k6 CLI:

```sh
k6 cloud login --token "$K6_CLOUD_TOKEN"
BASE_URL=https://the-internet.herokuapp.com \
k6 run --out cloud -e PROFILE=load performance/api-performance.js
```

The `k6 cloud run` command can instead execute the test using Grafana Cloud
load generators. Those generators need network access to the configured
`BASE_URL`. See [performance/README.md](performance/README.md) for details.
