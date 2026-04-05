const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const baseArtifactsDir = path.resolve(__dirname, '../../reports/raw/tmp');
const htmlReportDir = path.resolve(__dirname, '../../reports/html');
const defaultPort = process.env.PLAYWRIGHT_PORT || '3100';
const localBaseUrl = `http://127.0.0.1:${defaultPort}`;
const baseUrl = process.env.BASE_URL || localBaseUrl;
const shouldStartLocalServer = !process.env.BASE_URL || process.env.BASE_URL === localBaseUrl;
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === 'true';
const localServerCommand = [
  'NEXT_PUBLIC_PHASE_2A_DEBUG=true',
  'npm run dev -- --hostname 127.0.0.1',
  `--port ${defaultPort}`,
].join(' ');

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
  webServer: shouldStartLocalServer
    ? {
        command: localServerCommand,
        url: localBaseUrl,
        cwd: path.resolve(__dirname, '../..'),
        reuseExistingServer,
        timeout: 120_000,
      }
    : undefined,
  use: {
    baseURL: baseUrl,
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
