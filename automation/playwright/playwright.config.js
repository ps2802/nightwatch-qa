const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const baseArtifactsDir = path.resolve(__dirname, '../../reports/raw/tmp');
const htmlReportDir = path.resolve(__dirname, '../../reports/html');

module.exports = defineConfig({
  testDir: path.resolve(__dirname, './tests'),
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: !process.env.CI,
  reporter: [
    ['list'],
    ['html', { outputFolder: htmlReportDir, open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: baseArtifactsDir,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
