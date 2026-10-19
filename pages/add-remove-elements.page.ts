import type { Locator, Page } from '@playwright/test';

export class AddRemoveElementsPage {
  readonly heading: Locator;
  readonly addElementButton: Locator;
  readonly deleteButtons: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Add/Remove Elements' });
    this.addElementButton = page.getByRole('button', { name: 'Add Element' });
    this.deleteButtons = page.getByRole('button', { name: 'Delete' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/add_remove_elements/');
  }

  async addElement(): Promise<void> {
    await this.addElementButton.click();
  }

  async deleteElement(index = 0): Promise<void> {
    await this.deleteButtons.nth(index).click();
  }
}
