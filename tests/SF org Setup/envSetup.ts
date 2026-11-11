import type { APIRequestContext, Page } from '@playwright/test';
import { initializeSalesforceConnection } from '../../src/salesforce/connection';

type SalesforceOAuthResponse = {
  access_token?: unknown;
  instance_url?: unknown;
};

function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function requiredEnv(name: string): string {
  const value = firstDefined(process.env[name]);
  if (!value) {
    throw new Error(`Missing ${name} in the Salesforce environment configuration.`);
  }
  return value;
}

export async function authenticateSalesforceApi(request: APIRequestContext): Promise<void> {
  const instanceUrl = firstDefined(process.env.SF_INSTANCE_URL, process.env.BASE_URL);
  if (!instanceUrl) {
    throw new Error('Set SF_INSTANCE_URL or BASE_URL before authenticating the Salesforce API.');
  }

  const tokenUrl = new URL('/services/oauth2/token', instanceUrl);
  const response = await request.post(tokenUrl.toString(), {
    form: {
      grant_type: 'client_credentials',
      client_id: requiredEnv('SF_CLIENT_ID'),
      client_secret: requiredEnv('SF_CLIENT_SECRET'),
      username: requiredEnv('SF_USERNAME'),
      password: requiredEnv('SF_PASSWORD') + (process.env.SF_SECURITY_TOKEN?.trim() || ''),
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Salesforce OAuth token request failed (${response.status()}): ${body}`);
  }

  const body: unknown = await response.json();
  if (!body || typeof body !== 'object') {
    throw new Error('Salesforce OAuth token response was not a JSON object.');
  }

  const tokenResponse = body as SalesforceOAuthResponse;
  if (
    typeof tokenResponse.access_token !== 'string' ||
    typeof tokenResponse.instance_url !== 'string'
  ) {
    throw new Error('Salesforce OAuth token response did not include access_token and instance_url.');
  }

  initializeSalesforceConnection(tokenResponse.access_token, tokenResponse.instance_url);
}

export async function authenticateAdmin(page: Page): Promise<void> {
  const loginUrl = firstDefined(process.env.BASE_URL);
  const username = firstDefined(process.env.SF_USERNAME);
  const basePassword = firstDefined(process.env.SF_PASSWORD);

  const password = basePassword;

  if (!loginUrl || !username || !password) {
    throw new Error(
      [
        'Missing Salesforce setup credentials for org authentication.',
        'Set SF_USERNAME/SF_PASSWORD in .env.',
        'Also ensure SF_INSTANCE_URL, BASE_URL are defined.',
      ].join(' '),
    );
  }

  const instanceUrl = new URL(loginUrl).origin;
  await page.goto(instanceUrl);
  await page.fill('#username', username);

  if (!(await page.locator('#password').isVisible())) {
    await page.click('#Login');
    await page.locator('#password').waitFor({ state: 'visible', timeout: 30_000 });
  }

  await page.fill('#password', password);
  await page.click('#Login');

  await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 99_000 });
  await authenticateSalesforceApi(page.request);
}
