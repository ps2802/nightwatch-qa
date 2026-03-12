import { Page, TestInfo } from '@playwright/test';

export async function captureEvidence(page: Page, testInfo: TestInfo, label: string) {
  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach(`screenshot-${label}`, {
    body: screenshot,
    contentType: 'image/png',
  });
  const metadata = {
    url: page.url(),
    title: await page.title().catch(() => 'unknown'),
    timestamp: new Date().toISOString(),
  };
  await testInfo.attach(`metadata-${label}.json`, {
    body: Buffer.from(JSON.stringify(metadata, null, 2)),
    contentType: 'application/json',
  });
  console.log(`[evidence] ${label} → ${metadata.url}`);
}
