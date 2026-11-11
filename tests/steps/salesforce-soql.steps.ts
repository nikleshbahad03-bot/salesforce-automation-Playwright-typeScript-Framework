import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/test';
import { getSalesforceConnection } from '../../src/salesforce/connection';
import { authenticateSalesforceApi } from '../SF org Setup/envSetup';

const { Given, When, Then } = createBdd(test);

Given('the Salesforce API connection is authenticated', async ({ page }) => {
  await authenticateSalesforceApi(page.request);
});

When('I query Account records with SOQL', async ({ scenarioContext }) => {
  const connection = await getSalesforceConnection();
  const result = await connection.query<{ Id: string }>('SELECT Id FROM Account LIMIT 1');
  scenarioContext.soqlRecordCount = result.records.length;
});

Then('the SOQL query completes successfully', async ({ scenarioContext }) => {
  expect(scenarioContext.soqlRecordCount).not.toBeNull();
  expect(scenarioContext.soqlRecordCount).toBeGreaterThanOrEqual(0);
});
