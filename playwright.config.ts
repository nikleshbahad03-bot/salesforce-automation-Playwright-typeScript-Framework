import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

dotenv.config();

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: ['tests/steps/**/*.ts', 'src/fixtures/test.ts'],
  outputDir: 'tests/.features-gen',
});

const reportsDir = path.resolve('tmp');

export default defineConfig({
  testDir,
  testMatch: '**/*.spec.js',
  timeout: 180_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: Number(process.env.RETRY ?? 0),
  workers: Number(process.env.MAX_INSTANCES ?? 1),
  outputDir: path.join(reportsDir, 'test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(reportsDir, 'playwright-report') }],
    ['json', { outputFile: path.join(reportsDir, 'reports', 'results.json') }],
    ['junit', { outputFile: path.join(reportsDir, 'reports', 'results.xml') }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
