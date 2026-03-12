const { defineConfig } = require('@playwright/test');
const path = require('path');

const baseArtifactsDir = path.resolve(__dirname, '../../reports/raw/tmp');

module.exports = defineConfig({
  testDir: path.resolve(__dirname, './tests'),
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  outputDir: baseArtifactsDir,
});
