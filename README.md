# SFO Salesforce Playwright TypeScript Automation Framework

A reusable Salesforce UI and API automation framework built with Playwright, TypeScript, and Gherkin. It helps teams create and run readable end-to-end scenarios for Salesforce, including browser interactions and SOQL queries.

## Salesforce Automation Script Generator

This project includes a custom GitHub Copilot agent, **Write-Automation-Scripts**, located in `.github/agents/Write-Automation-Scripts.agent.md`.

Describe a Salesforce scenario in plain language and provide any relevant test data or expected results. The agent can help generate Playwright BDD automation scripts that follow this project’s structure and conventions. For example, you can describe a flow such as:

> Sign in to Salesforce, open Contacts, select a contact, and verify its name and email address.

You can also provide test data and expected values for the generated scenario. Review generated scripts and selectors before running them, especially when they depend on your org’s page layout, labels, or data.

## Framework Features

- **Gherkin scenarios** describe test cases in readable `Given`, `When`, and `Then` steps.
- **Playwright BDD** connects feature files to TypeScript step definitions.
- **Reusable UI actions** provide common operations such as clicking, typing, selecting options, and waiting for elements.
- **Page objects** keep page-specific locators and actions separate from test steps.
- **Data-driven testing** supports expected values stored in JSON files under `tests/testData/`.
- **Salesforce SOQL support** uses a shared jsforce connection initialized with an OAuth access token.
- **Multiple browser projects** are configured for Chromium, Firefox, and WebKit.

## Requirements

- Node.js 20 or newer
- Access to a Salesforce sandbox or org you are authorized to test
- Salesforce credentials and a Connected App configured for the OAuth flow used by this project

## Setup

1. Copy `.env.example` to `.env`.
2. Replace its placeholders with credentials and Salesforce URLs for your authorized org.
3. Install dependencies and Playwright browsers:

   ```sh
   npm install
   npx playwright install
   ```

4. Generate the BDD tests and run the scenarios:

   ```sh
   npm test
   ```

The UI login is handled in `tests/SF org Setup/envSetup.ts`. After login, the setup requests an OAuth access token and initializes the shared Salesforce API connection used by SOQL steps.

Configure the required values in `.env`:

- `BASE_URL` — Salesforce org URL used for UI login
- `SF_INSTANCE_URL` — API org URL; falls back to `BASE_URL` if unset
- `SF_USERNAME` and `SF_PASSWORD` — Salesforce test user credentials
- `SF_CLIENT_ID` and `SF_CLIENT_SECRET` — Connected App credentials
- `SF_SECURITY_TOKEN` — Optional; set if required by your org

To run only Chromium:

```sh
npm test -- --project=chromium
```

A valid Salesforce login and appropriate org data are required for the Salesforce scenarios to pass.

## Project Structure

- `.github/agents/` — Custom GitHub Copilot agents
- `src/salesforce/` — Shared Salesforce API connection
- `tests/features/` — Gherkin feature files
- `tests/steps/` — TypeScript step definitions
- `tests/pages/` — Page objects and Salesforce locators
- `tests/helpers/` — Reusable UI action helpers
- `tests/testData/` — JSON test data for data-driven scenarios
- `tests/enums/` — Shared enum-like constants
- `playwright.config.ts` — Browser projects, timeouts, and reporting configuration

## Add or Customize Scenarios

- Add a `.feature` file under `tests/features/`.
- Add or reuse step definitions under `tests/steps/`.
- Put page-specific locators in a page object under `tests/pages/`.
- Reuse common browser operations from `tests/helpers/ui-actions.ts`.
- Store reusable expected values in JSON files under `tests/testData/`.
- Use `src/salesforce/connection.ts` for SOQL after the Salesforce API connection has been initialized.

Keep SOQL static or construct it only from validated values. Never commit credentials or other secrets.

## Reports and Test Artifacts

Playwright writes test reports and artifacts under `tmp/`:

- HTML report: `tmp/playwright-report/`
- JSON report: `tmp/reports/results.json`
- JUnit report: `tmp/reports/results.xml`
- Test results, traces, screenshots, and videos: `tmp/test-results/`

Open the HTML report with:

```sh
npm run report
```

## Security

The local `.env` file and authenticated Playwright browser state are ignored by Git. Keep real credentials and session data local. Commit only the placeholder `.env.example`, and verify that no secrets are included before publishing.
