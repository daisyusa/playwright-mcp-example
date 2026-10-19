import { test as base, expect } from '@playwright/test';
import { AddRemoveElementsPage } from '../pages/add-remove-elements.page';
import { CheckboxesPage } from '../pages/checkboxes.page';
import { DropdownPage } from '../pages/dropdown.page';
import { LoginPage } from '../pages/login.page';
import { StatusCodesPage } from '../pages/status-codes.page';

type PageObjects = {
  addRemoveElementsPage: AddRemoveElementsPage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  loginPage: LoginPage;
  statusCodesPage: StatusCodesPage;
};

export const test = base.extend<PageObjects>({
  addRemoveElementsPage: async ({ page }, use) => {
    await use(new AddRemoveElementsPage(page));
  },
  checkboxesPage: async ({ page }, use) => {
    await use(new CheckboxesPage(page));
  },
  dropdownPage: async ({ page }, use) => {
    await use(new DropdownPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  statusCodesPage: async ({ page }, use) => {
    await use(new StatusCodesPage(page));
  },
});

export { expect };
