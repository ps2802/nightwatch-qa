import fs from 'fs';
import path from 'path';
import { Page, TestInfo } from '@playwright/test';

export interface EvidenceOptions {
  fullPage?: boolean;
}

export async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  label: string,
  options: EvidenceOptions = {},
) {
  const { fullPage = true } = options;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = testInfo.outputPath(`${label}-${timestamp}.png`);
  await page.screenshot({ fullPage, path: screenshotPath });

  const metadata = {
    label,
    url: page.url(),
    title: await page.title().catch(() => 'unknown'),
    timestamp,
    viewport: page.viewportSize(),
  };
  const metadataPath = testInfo.outputPath(`${label}-${timestamp}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  await testInfo.attach(`screenshot-${label}`, {
    path: screenshotPath,
    contentType: 'image/png',
  });
  await testInfo.attach(`metadata-${label}.json`, {
    path: metadataPath,
    contentType: 'application/json',
  });

  console.log(`[evidence] ${label} screenshot: ${path.relative(process.cwd(), screenshotPath)}`);
}
