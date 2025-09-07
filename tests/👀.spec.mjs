import { test, expect } from '@playwright/test';
test('👀', async ({ page }) => {
    await page.goto('./tests/👀.html');
    // wait for 1 seconds
    await page.waitForTimeout(1000);
    const editor = page.locator('#target');
    await expect(editor).toHaveAttribute('mark', 'good');
});
