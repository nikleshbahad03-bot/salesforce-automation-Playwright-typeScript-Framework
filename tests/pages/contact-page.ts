import type { Locator, Page } from '@playwright/test';
import { UIActions } from '../helpers/ui-actions';

export class ContactPage extends UIActions {
  constructor(page: Page) {
    super(page);
  }

  get contactsLink(): Locator {
    return this.getByRole('link', { name: 'Contacts', exact: true });
  }

  get contactName(): Locator {
    return this.page.locator(
      'records-record-layout-item[field-label="Name"] lightning-formatted-name',
    );
  }

  get detailsTab(): Locator {
    return this.getByRole('tab', { name: 'Details', exact: true });
  }

  get emailField(): Locator {
    return this.page.locator(
      'records-record-layout-item[field-label="Email"] lightning-formatted-email',
    );
  }

  get showAllActivitiesButton(): Locator {
    return this.getByRole('button', { name: 'Show All Activities', exact: true });
  }

  contactLink(name: string): Locator {
    return this.getByRole('link', { name, exact: true });
  }
}
