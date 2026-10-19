import { test, expect } from '@playwright/test';

test('API-01: Add/Remove Elements page returns its HTML', async ({ request }) => {
  const response = await request.get('/add_remove_elements/');
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(body).toContain('Add/Remove Elements');
  expect(body).toContain('Add Element');
});

test('API-02: Checkboxes page returns the expected initial HTML state', async ({ request }) => {
  const response = await request.get('/checkboxes');
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(body).toContain('Checkboxes');
  expect(body.match(/type="checkbox"/g)).toHaveLength(2);
  expect(body).toContain('<input type="checkbox">');
  expect(body).toContain('<input type="checkbox" checked>');
});

test('API-03: Dropdown page returns the available HTML options', async ({ request }) => {
  const response = await request.get('/dropdown');
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(body).toContain('Dropdown List');
  expect(body).toContain('Please select an option');
  expect(body).toContain('Option 1');
  expect(body).toContain('Option 2');
});

test('API-04: authenticate valid and invalid credentials', async ({ playwright, baseURL }) => {
  if (!baseURL) {
    throw new Error('Playwright baseURL must be configured for authentication API tests');
  }

  const loginUrl = new URL('/login', baseURL);
  const validContext = await playwright.request.newContext({ baseURL });
  const invalidContext = await playwright.request.newContext({ baseURL });

  try {
    const loginPage = await validContext.get(loginUrl.href);
    expect(loginPage.status()).toBe(200);
    const loginHtml = await loginPage.text();
    expect(loginHtml).toContain('Login Page');
    expect(loginHtml).toContain('action="/authenticate"');
    expect(loginHtml).toMatch(/method="post"/i);

    const validResponse = await validContext.post('/authenticate', {
      form: { username: 'tomsmith', password: 'SuperSecretPassword!' },
    });
    expect(validResponse.status()).toBe(200);
    expect(validResponse.url()).toMatch(/\/secure$/);
    expect(await validResponse.text()).toContain('You logged into a secure area!');
    expect(await validResponse.text()).toContain('Logout');

    const invalidResponse = await invalidContext.post('/authenticate', {
      form: { username: 'wrong', password: 'wrong' },
    });
    expect(invalidResponse.status()).toBe(200);
    expect(invalidResponse.url()).toMatch(/\/login$/);
    expect(await invalidResponse.text()).toContain('Your username is invalid!');
  } finally {
    await validContext.dispose();
    await invalidContext.dispose();
  }
});

test('API-05: each status-code endpoint returns the matching HTTP code and body', async ({ request }) => {
  for (const code of [200, 301, 404, 500]) {
    const response = await request.get(`/status_codes/${code}`, { maxRedirects: 0 });
    const body = await response.text();

    expect(response.status(), `HTTP status from /status_codes/${code}`).toBe(code);
    expect(response.url()).toMatch(new RegExp(`/status_codes/${code}$`));
    expect(body).toContain(`This page returned a ${code} status code.`);
  }
});
