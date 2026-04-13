import { test, expect } from '@playwright/test';

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 }
];

test('home links to day template', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('[data-day-grid] .day-card')).toHaveCount(15);
  await expect(page.locator('[data-day-grid] .day-card').first()).toHaveAttribute('href', /day\.html\?day=1/);
});

test('day flow handles query, session, bonus, completion persistence', async ({ page }) => {
  await page.goto('/day.html?day=999');
  await expect(page).toHaveURL(/day\.html\?day=999/);
  await expect(page.locator('[data-day-title]')).toContainText('Day 15');
  await page.locator('[data-prev-day]').click();
  await expect(page).toHaveURL(/day=14/);
  await page.selectOption('[data-day-jump]', '2');
  await expect(page).toHaveURL(/day=2/);
  await page.locator('[data-start-session="morning"]').click();
  await page.locator('[data-get-bonus]').click();
  await expect(page.locator('.bonus-panel')).toHaveCount(1);
  await page.locator('[data-get-bonus]').click();
  await expect(page.locator('.bonus-panel')).toHaveCount(2);
  await expect(page.locator('[data-session-content] ol').first()).toBeVisible();
});

test('parent dashboard CRUD/filter/trend render', async ({ page }) => {
  await page.goto('/parent.html');
  await page.selectOption('select[name="day"]', '2');
  await page.selectOption('select[name="session"]', 'morning');
  await page.fill('input[name="score"]', '4');
  await page.fill('input[name="maxScore"]', '5');
  await page.fill('textarea[name="notes"]', 'good work');
  await page.click('button[type="submit"]');
  await expect(page.locator('[data-history-body] tr')).toHaveCount(1);
  await page.click('[data-edit]');
  await page.fill('input[name="score"]', '5');
  await page.click('button[type="submit"]');
  await expect(page.locator('[data-history-body]')).toContainText('100%');
  await page.selectOption('[data-filter-day]', '2');
  await expect(page.locator('[data-history-body] tr')).toHaveCount(1);
  await page.click('[data-del]');
  await expect(page.locator('[data-history-body] tr')).toHaveCount(0);
  await expect(page.locator('[data-score-trend]')).toBeVisible();
});

for (const viewport of viewports) {
  test(`responsive no overflow ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/day.html?day=1');
    await page.locator('[data-start-session="morning"]').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBeFalsy();
  });
}
