import type { Locator, Page } from '@playwright/test';

export class StatusCodesPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Status Codes' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/status_codes');
  }

  async openStatusCode(code: number): Promise<void> {
    await this.page.getByRole('link', { name: String(code), exact: true }).click();
  }
}
