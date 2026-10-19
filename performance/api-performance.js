import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'https://the-internet.herokuapp.com').replace(/\/+$/, '');
const username = __ENV.USERNAME || 'tomsmith';
const password = __ENV.PASSWORD || 'SuperSecretPassword!';

const thresholds = {
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.99'],
};

const profiles = {
  smoke: {
    scenarios: {
      smoke: {
        executor: 'constant-vus',
        vus: 1,
        duration: '10s',
      },
    },
    thresholds: {
      ...thresholds,
      http_req_duration: ['p(95)<2500', 'p(99)<5000'],
    },
  },
  load: {
    scenarios: {
      load: {
        executor: 'ramping-vus',
        startVUs: 1,
        stages: [
          { duration: '30s', target: 5 },
          { duration: '1m', target: 20 },
          { duration: '30s', target: 0 },
        ],
        gracefulRampDown: '10s',
      },
    },
    thresholds: {
      ...thresholds,
      http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    },
  },
  stress: {
    scenarios: {
      stress: {
        executor: 'ramping-vus',
        startVUs: 1,
        stages: [
          { duration: '30s', target: 10 },
          { duration: '30s', target: 30 },
          { duration: '30s', target: 60 },
          { duration: '1m', target: 60 },
          { duration: '30s', target: 0 },
        ],
        gracefulRampDown: '10s',
      },
    },
    thresholds: {
      ...thresholds,
      http_req_duration: ['p(95)<5000', 'p(99)<10000'],
    },
  },
};

const profile = __ENV.PROFILE || 'smoke';
if (!profiles[profile]) {
  throw new Error(`Unknown PROFILE "${profile}". Use smoke, load, or stress.`);
}

export const options = profiles[profile];

function getAndCheck(path, expectedStatus, expectedText, name) {
  const response = http.get(`${baseUrl}${path}`, {
    tags: { name: `GET ${path}` },
    responseCallback: http.expectedStatuses(expectedStatus),
    redirects: 0,
  });

  check(response, {
    [`${name}: HTTP ${expectedStatus}`]: (res) => res.status === expectedStatus,
    [`${name}: expected page content`]: (res) => res.body.includes(expectedText),
  });
}

export default function () {
  getAndCheck('/', 200, 'Welcome to the-internet', 'home');
  getAndCheck('/add_remove_elements/', 200, 'Add/Remove Elements', 'add/remove page');
  getAndCheck('/checkboxes', 200, 'checkbox 1', 'checkboxes page');
  getAndCheck('/dropdown', 200, 'Option 1', 'dropdown page');
  getAndCheck('/login', 200, 'Login Page', 'login page');

  const authentication = http.post(
    `${baseUrl}/authenticate`,
    { username, password },
    {
      tags: { name: 'POST /authenticate' },
      responseCallback: http.expectedStatuses(200, 303),
    },
  );
  check(authentication, {
    'authentication: HTTP 200 after redirect': (res) => res.status === 200,
    'authentication: secure-area content': (res) =>
      res.body.includes('You logged into a secure area!'),
  });

  getAndCheck('/status_codes', 200, 'Status Codes', 'status-code index');
  for (const code of [200, 301, 404, 500]) {
    getAndCheck(
      `/status_codes/${code}`,
      code,
      `This page returned a ${code} status code.`,
      `status code ${code}`,
    );
  }

  sleep(1);
}
