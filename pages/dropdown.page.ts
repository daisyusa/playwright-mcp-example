import type { Locator, Page } from '@playwright/test';

export class DropdownPage {
  readonly heading: Locator;
  readonly dropdown: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dropdown List' });
    this.dropdown = page.getByRole('combobox');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dropdown');
  }

  async selectOption(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }
}
