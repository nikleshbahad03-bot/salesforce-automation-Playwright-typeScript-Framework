import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../src/fixtures/test';
import { ContactPage } from '../pages/contact-page';

const { When, Then } = createBdd(test);

When('I open the Contacts page', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.contactsLink);
  await contactPage.click(contactPage.contactsLink);
});

Then('the contact {string} is present', async ({ page }, contactName: string) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForPresence(contactPage.contactLink(contactName));
});

When('I open the contact {string}', async ({ page }, contactName: string) => {
  const contactPage = new ContactPage(page);
  await contactPage.click(contactPage.contactLink(contactName));
});

Then('the contact details are displayed', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.detailsTab);
  await contactPage.click(contactPage.detailsTab);
});

Then('the contact email is {string}', async ({ page }, expectedEmail: string) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.emailField);
  expect(await contactPage.getText(contactPage.emailField)).toContain(expectedEmail);
  // const emailValue = contactPage.emailField.getByText(expectedEmail, { exact: true });
  // await contactPage.waitForVisible(emailValue);
  // expect(await contactPage.getText(emailValue)).toBe(expectedEmail);
});

Then('the contact name contains {string}', async ({ page }, expectedName: string) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.contactName);
  expect(await contactPage.getText(contactPage.contactName)).toContain(expectedName);
});

Then('the Show All Activities button is displayed', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.waitForVisible(contactPage.showAllActivitiesButton);
});
