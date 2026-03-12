import fs from 'fs';
import path from 'path';
import { Page, TestInfo } from '@playwright/test';

export async function captureEvidence(page: Page, testInfo: TestInfo, label: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = testInfo.outputPath(`${label}-${timestamp}.png`);
  await page.screenshot({ fullPage: true, path: screenshotPath });

  const metadata = {
    url: page.url(),
    title: await page.title().catch(() => 'unknown'),
    timestamp,
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
