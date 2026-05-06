import { test, expect } from '@playwright/test';

test.describe('Admin can manage master data setup', () => {
  test('Submit Kamus by Template', async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/setup-kamus...`);

    const response = await page.goto('/admin/setup-kamus');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/setup-kamus/);
    await expect(page.getByTestId('kamus-page-nav')).toBeVisible();

    // Wait for list to load
    await expect(page.getByTestId('kamus-list-container')).toBeVisible();

    const uniqueName = `E2E Kamus Template ${Date.now()}`;
    await page.getByTestId('kamus-template-input').fill(uniqueName);
    await page.getByTestId('submit-kamus-btn').click();

    await expect(page.getByTestId('kamus-created-alert')).toContainText('Kamus Submitted');
    console.log(`[Test: ${title}] Kamus created: ${uniqueName}`);
  });

  test('Submit Standar', async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/setup-standar-jabatan...`);

    const response = await page.goto('/admin/setup-standar-jabatan');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/setup-standar-jabatan/);
    await expect(page.getByTestId('standar-page-nav')).toBeVisible();

    await expect(page.getByTestId('standar-list-container')).toBeVisible();

    const uniqueName = `E2E Standar ${Date.now()}`;
    await page.getByTestId('standar-input').fill(uniqueName);
    await page.getByTestId('submit-standar-btn').click();

    await expect(page.getByTestId('standar-created-alert')).toContainText('Standar Submitted');
    console.log(`[Test: ${title}] Standar created: ${uniqueName}`);
  });

  test('Submit Scenario', async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/setup-scenario...`);

    const response = await page.goto('/admin/setup-scenario');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/setup-scenario/);
    await expect(page.getByTestId('scenario-page-nav')).toBeVisible();

    await expect(page.getByTestId('scenario-list-container')).toBeVisible();

    const uniqueName = `E2E Scenario ${Date.now()}`;
    await page.getByTestId('scenario-input').fill(uniqueName);
    await page.getByTestId('submit-scenario-btn').click();

    await expect(page.getByTestId('scenario-created-alert')).toContainText('Scenario Submitted');
    console.log(`[Test: ${title}] Scenario created: ${uniqueName}`);
  });

  test('Admin views the kamus list with seed data', async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/setup-kamus...`);

    await page.goto('/admin/setup-kamus');
    await expect(page.getByTestId('kamus-list-container')).toBeVisible();

    const firstItem = page.locator('[data-testid^="kamus-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="kamus-item-"]').count();
    console.log(`[Test: ${title}] Found ${count} kamus items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin views kamus potensi & kompetensi overview', async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/kamus-potensi-kompetensi...`);

    const response = await page.goto('/admin/kamus-potensi-kompetensi');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/kamus-potensi-kompetensi/);
    await expect(page.getByTestId('kpk-page-nav')).toBeVisible();
    await expect(page.getByTestId('kpk-summary')).toBeVisible({ timeout: 10000 });
  });
});
