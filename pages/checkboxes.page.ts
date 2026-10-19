import type { Locator, Page } from '@playwright/test';

export class CheckboxesPage {
  readonly heading: Locator;
  readonly checkboxes: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Checkboxes' });
    this.checkboxes = page.locator('input[type="checkbox"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkboxes');
  }

  async check(index: number): Promise<void> {
    await this.checkboxes.nth(index).check();
  }

  async uncheck(index: number): Promise<void> {
    await this.checkboxes.nth(index).uncheck();
  }
}
