const { test, expect } = require('@playwright/test');

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 }
];

async function trackConsoleErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test('home page renders summary and day cards and can open a day', async ({ page }) => {
  const errors = await trackConsoleErrors(page);
  await page.goto('/index.html');

  await expect(page.locator('[data-done-count]')).toBeVisible();
  await expect(page.locator('[data-active-day]')).toBeVisible();
  await expect(page.locator('[data-total-time]')).toBeVisible();
  await expect(page.locator('[data-day-grid] .day-card')).toHaveCount(15);

  await page.locator('[data-day-grid] .day-card').first().click();
  await expect(page).toHaveURL(/day-01\.html/);
  expect(errors).toEqual([]);
});

test('day page supports navigation, session flow, and finish day gating', async ({ page }) => {
  const errors = await trackConsoleErrors(page);
  await page.goto('/days/day-01.html');

  await expect(page.locator('[data-day-title]')).toContainText('Day 1');

  await page.locator('[data-next-day]').click();
  await expect(page).toHaveURL(/day-02\.html/);
  await page.locator('[data-prev-day]').click();
  await expect(page).toHaveURL(/day-01\.html/);

  await page.selectOption('[data-day-jump]', { label: 'Day 3' });
  await expect(page).toHaveURL(/day-03\.html/);

  await page.locator('[data-start-session="morning"]').click();
  await expect(page.locator('[data-session-title]')).toContainText('Morning Session');
  await expect(page.locator('[data-session-content] .question-card')).toBeVisible();

  await page.locator('[data-next-section]').click();
  await expect(page.locator('[data-session-content] .question-card h3')).toContainText('Intermediate');

  await expect(page.locator('[data-finish-day]')).toBeHidden();
  expect(errors).toEqual([]);
});

test('invalid day value does not crash and parent page navigation works', async ({ page }) => {
  const errors = await trackConsoleErrors(page);
  await page.goto('/days/day-01.html');
  await page.evaluate(() => {
    document.body.dataset.day = '999';
    window.location.reload();
  });
  await expect(page.locator('[data-day-title]')).toContainText('Day 1');

  await page.goto('/parent.html');
  await expect(page.locator('h1')).toContainText('Score History & Trends');
  await page.getByRole('link', { name: /home/i }).first().click();
  await expect(page).toHaveURL(/index\.html/);
  expect(errors).toEqual([]);
});

for (const viewport of viewports) {
  test(`responsive layout has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/days/day-01.html');
    await page.locator('[data-start-session="morning"]').click();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBeFalsy();

    const navHeight = await page.locator('.top-nav').boundingBox();
    expect(navHeight?.height || 0).toBeGreaterThan(40);
  });
}
