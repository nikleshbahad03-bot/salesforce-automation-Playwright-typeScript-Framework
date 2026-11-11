import { expect } from '@playwright/test';
import { test as base } from 'playwright-bdd';

type ScenarioContext = {
  soqlRecordCount: number | null;
};

export const test = base.extend<{ scenarioContext: ScenarioContext }>({
  scenarioContext: async ({}, use) => {
    await use({ soqlRecordCount: null });
  },
});

export { expect };
