import { test, expect } from '../fixtures/fixtures';

test('UI-01: add and remove elements', async ({ addRemoveElementsPage }) => {
  await addRemoveElementsPage.goto();
  await expect(addRemoveElementsPage.heading).toBeVisible();
  await expect(addRemoveElementsPage.addElementButton).toBeVisible();
  await expect(addRemoveElementsPage.deleteButtons).toHaveCount(0);

  await addRemoveElementsPage.addElement();
  await addRemoveElementsPage.addElement();
  await expect(addRemoveElementsPage.deleteButtons).toHaveCount(2);

  await addRemoveElementsPage.deleteElement();
  await expect(addRemoveElementsPage.deleteButtons).toHaveCount(1);
});

test('UI-02: toggle checkbox states', async ({ checkboxesPage, page }) => {
  await checkboxesPage.goto();
  await expect(checkboxesPage.heading).toBeVisible();
  await expect(checkboxesPage.checkboxes).toHaveCount(2);
  await expect(checkboxesPage.checkboxes.nth(0)).not.toBeChecked();
  await expect(checkboxesPage.checkboxes.nth(1)).toBeChecked();

  await checkboxesPage.check(0);
  await expect(checkboxesPage.checkboxes.nth(0)).toBeChecked();
  await expect(checkboxesPage.checkboxes.nth(1)).toBeChecked();

  await checkboxesPage.uncheck(1);
  await expect(checkboxesPage.checkboxes.nth(0)).toBeChecked();
  await expect(checkboxesPage.checkboxes.nth(1)).not.toBeChecked();
  await expect(page).toHaveURL(/\/checkboxes$/);
});

test('UI-03: select each available dropdown option', async ({ dropdownPage, page }) => {
  await dropdownPage.goto();
  await expect(dropdownPage.heading).toBeVisible();
  await expect(dropdownPage.dropdown).toHaveValue('');

  await dropdownPage.selectOption('1');
  await expect(dropdownPage.dropdown).toHaveValue('1');
  await dropdownPage.selectOption('2');
  await expect(dropdownPage.dropdown).toHaveValue('2');
  await expect(page).toHaveURL(/\/dropdown$/);
});

test('UI-04: reject invalid login credentials', async ({ loginPage, page }) => {
  await loginPage.goto();
  await expect(loginPage.heading).toBeVisible();
  await loginPage.login('wrong', 'wrong');

  await expect(loginPage.notification).toContainText('Your username is invalid!');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toHaveCount(0);
});

test('UI-05: log in with valid credentials', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('tomsmith', 'SuperSecretPassword!');

  await expect(page).toHaveURL(/\/secure$/);
  await expect(loginPage.notification).toContainText('You logged into a secure area!');
  await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});

test('UI-06: open each status-code example', async ({ statusCodesPage, page }) => {
  for (const code of [200, 301, 404, 500]) {
    await statusCodesPage.goto();
    await expect(statusCodesPage.heading).toBeVisible();
    await statusCodesPage.openStatusCode(code);

    await expect(page).toHaveURL(new RegExp(`/status_codes/${code}$`));
    await expect(page.locator('body')).toContainText(`This page returned a ${code} status code.`);
  }
});
