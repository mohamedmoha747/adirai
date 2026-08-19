export default async (page) => {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://localhost:5173/customer/products/p1', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Add to Cart/i }).click();
  await page.waitForTimeout(800);

  const badge = await page.locator('a[href="/customer/cart"] span').textContent().catch(() => null);
  await page.goto('http://localhost:5173/customer/cart', { waitUntil: 'networkidle' });
  const cartText = await page.locator('body').innerText();
  const hasItem = cartText.includes('Fortune Sunflower Oil');
  const subtotal = cartText.match(/Subtotal[\s\S]*?₹(\d+)/)?.[1] || null;

  return {
    badgeAfterAdd: badge,
    cartHasItem: hasItem,
    subtotal,
    consoleErrors: errors,
  };
};
