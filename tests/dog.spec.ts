import { test, expect } from '@playwright/test';

test.describe('Dog image functionality ', () => {
  
  test('dog image loads successfully on page load', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.waitForResponse(response =>
      response.url().includes('/api/dogs/random') && response.status() === 200
    );
    
    const dogImage = page.locator('img.dog-image');

    await expect(dogImage).toBeVisible();

    const src = await dogImage.getAttribute('src');

    expect(src).toBeTruthy();
    expect(src).toMatch(/^https:\/\//);
  });

  test('loads dog image when button clicked', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.waitForResponse(r =>
      r.url().includes('/api/dogs/random') && r.status() === 200
    );

    const responsePromise = page.waitForResponse(r =>
      r.url().includes('/api/dogs/random') && r.status() === 200
    );

    await page.click('button.fetch-button');
    await responsePromise;

    const img = page.locator('img.dog-image');
    const src = await img.getAttribute('src');

    expect(src).toBeTruthy();
    expect(src).toMatch(/^https:\/\//);
  });

  test('displays error when API call fails', async ({ page }) => {
  await page.route('**/api/dogs/random', route => route.abort());

  await page.goto('http://localhost:5173');

  const errorElement = page.locator('div.error');

  await expect(errorElement).toContainText(/error/i);
  await expect(errorElement).toBeVisible();
});

});