import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import contactTestData from '../testData/contactPage.json';
import { test } from '../../src/fixtures/test';
import { ContactPage } from '../pages/contact-page';

const { When, Then } = createBdd(test);

When('I open Contacts using contact JSON data', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.contactsLink);
  await contactPage.click(contactPage.contactsLink);
});

Then('the JSON contact is present', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForPresence(contactPage.contactLink(contactTestData.contactLinkName));
});

When('I open the JSON contact', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.click(contactPage.contactLink(contactTestData.contactLinkName));
});

Then('the contact details match contactPage.json', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.detailsTab);
  await contactPage.click(contactPage.detailsTab);
  await contactPage.waitForVisible(contactPage.emailField);
  await contactPage.waitForVisible(contactPage.contactName);

  expect(await contactPage.getText(contactPage.emailField)).toContain(contactTestData.expectedEmail);
  expect(await contactPage.getText(contactPage.contactName)).toContain(contactTestData.expectedName);
});

Then('the Show All Activities button is displayed for the JSON contact', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.showAllActivitiesButton);
});
