import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/test';
import { getSalesforceConnection } from '../../src/salesforce/connection';
import { authenticateAdmin } from '../SF org Setup/envSetup';

const { Given, When, Then } = createBdd(test);

Given('I sign in to Salesforce as the admin', async ({ page }) => {
  await authenticateAdmin(page);
});

When('the Salesforce home page loads', async ({ page, scenarioContext }) => {
  await page.waitForLoadState('domcontentloaded');
  const connection = await getSalesforceConnection();
  const result = await connection.query<{ Id: string }>('SELECT Id FROM Account LIMIT 1');
  scenarioContext.soqlRecordCount = result.records.length;

  const contacts = await connection.query<{ Id: string; Name: string }>(
  "SELECT Id, Name FROM Contact WHERE Email = 'test@example.com' LIMIT 10",
);
console.log(contacts);
console.log(contacts.records.toString());
});

Then('the login page is no longer displayed', async ({ page }) => {
  await expect(page).not.toHaveURL(/\/login/i);
});
