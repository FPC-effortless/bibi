import { test, expect, Page } from '@playwright/test';

/**
 * Screen Reader Compatibility Tests
 * 
 * This test suite validates screen reader accessibility across the application,
 * ensuring proper ARIA labels, semantic HTML structure, and assistive technology
 * compatibility for users with visual impairments.
 * 
 * Requirements: 9.2, 9.3, 9.5, 9.6
 */

test.describe('Screen Reader Compatibility', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
  });

  test.describe('ARIA Labels and Attributes', () => {
    test('should have proper ARIA labels on interactive elements', async () => {
      // Check header navigation elements
      const logo = page.locator('[data-testid="brand-logo"]');
      await expect(logo).toHaveAttribute('aria-label', /.*home.*/i);
      
      const searchButton = page.locator('[data-testid="search-button"]');
      await expect(searchButton).toHaveAttribute('aria-label', /.*search.*/i);
      
      const cartButton = page.locator('[data-testid="cart-button"]');
      await expect(cartButton).toHaveAttribute('aria-label', /.*cart.*/i);
      
      const wishlistButton = page.locator('[data-testid="wishlist-button"]');
      await expect(wishlistButton).toHaveAttribute('aria-label', /.*wishlist.*/i);
      
      // Check mobile menu button
      await page.setViewportSize({ width: 375, height: 667 });
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(mobileMenuButton).toHaveAttribute('aria-label', /.*menu.*/i);
      await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have proper ARIA states for interactive components', async () => {
      // Test search modal ARIA states
      const searchButton = page.locator('[data-testid="search-button"]');
      await searchButton.click();
      
      const searchModal = page.locator('[data-testid="search-modal"]');
      await expect(searchModal).toHaveAttribute('role', 'dialog');
      await expect(searchModal).toHaveAttribute('aria-modal', 'true');
      await expect(searchModal).toHaveAttribute('aria-labelledby');
      
      // Test cart drawer ARIA states
      await page.locator('[data-testid="search-close-button"]').click();
      await page.locator('[data-testid="cart-button"]').click();
      
      const cartDrawer = page.locator('[data-testid="cart-drawer"]');
      await expect(cartDrawer).toHaveAttribute('role', 'dialog');
      await expect(cartDrawer).toHaveAttribute('aria-modal', 'true');
      await expect(cartDrawer).toHaveAttribute('aria-labelledby');
    });

    test('should have proper ARIA labels for product cards', async () => {
      await page.goto('/collections');
      
      const productCards = page.locator('[data-testid="product-card"]');
      const firstCard = productCards.first();
      
      // Product card should have accessible name
      await expect(firstCard).toHaveAttribute('aria-label');
      
      // Product image should have alt text
      const productImage = firstCard.locator('img');
      await expect(productImage).toHaveAttribute('alt');
      
      // Add to cart button should have aria-label
      const addToCartButton = firstCard.locator('[data-testid="add-to-cart-button"]');
      await expect(addToCartButton).toHaveAttribute('aria-label');
      
      // Add to wishlist button should have aria-label
      const addToWishlistButton = firstCard.locator('[data-testid="add-to-wishlist-button"]');
      await expect(addToWishlistButton).toHaveAttribute('aria-label');
    });

    test('should have proper ARIA live regions for dynamic content', async () => {
      // Check for cart count live region
      const cartCount = page.locator('[data-testid="cart-count"]');
      await expect(cartCount).toHaveAttribute('aria-live', 'polite');
      
      // Check for wishlist count live region
      const wishlistCount = page.locator('[data-testid="wishlist-count"]');
      await expect(wishlistCount).toHaveAttribute('aria-live', 'polite');
      
      // Test live region updates
      await page.goto('/collections');
      await page.locator('[data-testid="add-to-cart-button"]').first().click();
      
      // Cart count should update and announce to screen readers
      await expect(cartCount).toHaveText('1');
    });
  });

  test.describe('Semantic HTML Structure', () => {
    test('should use proper heading hierarchy', async () => {
      // Check for h1 on homepage
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Check heading hierarchy (h1 -> h2 -> h3, etc.)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      let previousLevel = 0;
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const currentLevel = parseInt(tagName.charAt(1));
        
        // Heading levels should not skip (e.g., h1 -> h3)
        if (previousLevel > 0) {
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = currentLevel;
      }
    });

    test('should use semantic landmarks', async () => {
      // Check for main landmark
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Check for navigation landmark
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Check for header landmark
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check for footer landmark
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Check for complementary content (aside)
      const aside = page.locator('aside');
      if (await aside.count() > 0) {
        await expect(aside.first()).toBeVisible();
      }
    });

    test('should use proper list markup for navigation', async () => {
      // Main navigation should use list markup
      const navList = page.locator('nav ul, nav ol');
      await expect(navList).toBeVisible();
      
      const navItems = page.locator('nav li');
      expect(await navItems.count()).toBeGreaterThan(0);
      
      // Footer navigation should use list markup
      const footerNavList = page.locator('footer ul, footer ol');
      await expect(footerNavList).toBeVisible();
      
      const footerNavItems = page.locator('footer li');
      expect(await footerNavItems.count()).toBeGreaterThan(0);
    });

    test('should use proper button and link semantics', async () => {
      // Interactive elements that trigger actions should be buttons
      const actionButtons = page.locator('[data-testid="search-button"], [data-testid="cart-button"], [data-testid="mobile-menu-button"]');
      
      for (let i = 0; i < await actionButtons.count(); i++) {
        const button = actionButtons.nth(i);
        const tagName = await button.evaluate(el => el.tagName.toLowerCase());
        expect(tagName).toBe('button');
      }
      
      // Navigation elements should be links
      const navLinks = page.locator('nav a');
      for (let i = 0; i < Math.min(await navLinks.count(), 5); i++) {
        const link = navLinks.nth(i);
        const tagName = await link.evaluate(el => el.tagName.toLowerCase());
        expect(tagName).toBe('a');
        
        // Links should have href attribute
        await expect(link).toHaveAttribute('href');
      }
    });
  });

  test.describe('Form Labels and Associations', () => {
    test('should have properly associated form labels', async () => {
      // Test newsletter subscription form
      const newsletterInput = page.locator('[data-testid="newsletter-input"]');
      const newsletterLabel = page.locator('label[for="newsletter-email"]');
      
      if (await newsletterInput.count() > 0) {
        await expect(newsletterLabel).toBeVisible();
        
        // Check label association
        const inputId = await newsletterInput.getAttribute('id');
        const labelFor = await newsletterLabel.getAttribute('for');
        expect(inputId).toBe(labelFor);
      }
      
      // Test search form
      await page.locator('[data-testid="search-button"]').click();
      const searchInput = page.locator('[data-testid="search-input"]');
      
      // Search input should have aria-label or associated label
      const hasAriaLabel = await searchInput.getAttribute('aria-label');
      const hasAriaLabelledBy = await searchInput.getAttribute('aria-labelledby');
      
      expect(hasAriaLabel || hasAriaLabelledBy).toBeTruthy();
    });

    test('should have proper form validation feedback', async () => {
      // Go to checkout to test form validation
      await page.goto('/collections');
      await page.locator('[data-testid="add-to-cart-button"]').first().click();
      await page.locator('[data-testid="cart-button"]').click();
      await page.locator('[data-testid="proceed-to-checkout"]').click();
      
      // Try to submit form without required fields
      const continueButton = page.locator('[data-testid="continue-to-payment"]');
      await continueButton.click();
      
      // Check for error messages with proper ARIA attributes
      const errorMessages = page.locator('[role="alert"], [aria-live="assertive"]');
      if (await errorMessages.count() > 0) {
        await expect(errorMessages.first()).toBeVisible();
      }
      
      // Required fields should have aria-required
      const requiredInputs = page.locator('input[required]');
      for (let i = 0; i < await requiredInputs.count(); i++) {
        const input = requiredInputs.nth(i);
        await expect(input).toHaveAttribute('aria-required', 'true');
      }
    });

    test('should provide helpful form instructions', async () => {
      await page.goto('/checkout');
      
      // Form sections should have descriptive headings
      const formHeadings = page.locator('fieldset legend, .form-section h2, .form-section h3');
      expect(await formHeadings.count()).toBeGreaterThan(0);
      
      // Complex inputs should have aria-describedby for additional instructions
      const complexInputs = page.locator('input[type="email"], input[type="tel"], input[type="password"]');
      
      for (let i = 0; i < await complexInputs.count(); i++) {
        const input = complexInputs.nth(i);
        const hasDescription = await input.getAttribute('aria-describedby');
        
        if (hasDescription) {
          const descriptionElement = page.locator(`#${hasDescription}`);
          await expect(descriptionElement).toBeVisible();
        }
      }
    });
  });

  test.describe('Image Alt Text and Descriptions', () => {
    test('should have descriptive alt text for product images', async () => {
      await page.goto('/collections');
      
      const productImages = page.locator('[data-testid="product-card"] img');
      
      for (let i = 0; i < Math.min(await productImages.count(), 5); i++) {
        const image = productImages.nth(i);
        const altText = await image.getAttribute('alt');
        
        // Alt text should be descriptive (more than just filename)
        expect(altText).toBeTruthy();
        expect(altText.length).toBeGreaterThan(5);
        expect(altText).not.toMatch(/\.(jpg|jpeg|png|gif|webp)$/i);
      }
    });

    test('should have proper alt text for decorative images', async () => {
      // Decorative images should have empty alt text
      const decorativeImages = page.locator('img[role="presentation"], .decorative img');
      
      for (let i = 0; i < await decorativeImages.count(); i++) {
        const image = decorativeImages.nth(i);
        const altText = await image.getAttribute('alt');
        expect(altText).toBe('');
      }
    });

    test('should provide image descriptions for complex images', async () => {
      await page.goto('/product/1');
      
      // Product detail images should have comprehensive alt text
      const productImages = page.locator('[data-testid="product-image-gallery"] img');
      
      for (let i = 0; i < await productImages.count(); i++) {
        const image = productImages.nth(i);
        const altText = await image.getAttribute('alt');
        
        // Alt text should describe the product and view
        expect(altText).toBeTruthy();
        expect(altText.length).toBeGreaterThan(10);
      }
    });
  });

  test.describe('Skip Links and Navigation Aids', () => {
    test('should provide skip to main content link', async () => {
      // Skip link should be first focusable element
      await page.keyboard.press('Tab');
      
      const skipLink = page.locator('[data-testid="skip-to-main"]');
      await expect(skipLink).toBeFocused();
      
      // Skip link should have descriptive text
      const linkText = await skipLink.textContent();
      expect(linkText).toMatch(/skip.*main.*content/i);
      
      // Skip link should navigate to main content
      await skipLink.click();
      const mainContent = page.locator('main');
      await expect(mainContent).toBeFocused();
    });

    test('should provide breadcrumb navigation where appropriate', async () => {
      await page.goto('/collections/dresses');
      
      // Check for breadcrumb navigation
      const breadcrumbs = page.locator('[aria-label="Breadcrumb"], nav[role="navigation"] ol');
      
      if (await breadcrumbs.count() > 0) {
        await expect(breadcrumbs.first()).toBeVisible();
        
        // Breadcrumb items should be properly marked up
        const breadcrumbItems = page.locator('[aria-label="Breadcrumb"] li, nav[role="navigation"] li');
        expect(await breadcrumbItems.count()).toBeGreaterThan(1);
        
        // Current page should be marked with aria-current
        const currentPage = page.locator('[aria-current="page"]');
        await expect(currentPage).toBeVisible();
      }
    });

    test('should provide clear page titles and descriptions', async () => {
      // Check page title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(5);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(20);
    });
  });

  test.describe('Screen Reader Announcements', () => {
    test('should announce dynamic content changes', async () => {
      // Test cart updates
      await page.goto('/collections');
      
      // Add item to cart
      await page.locator('[data-testid="add-to-cart-button"]').first().click();
      
      // Check for success announcement
      const announcement = page.locator('[role="status"], [aria-live="polite"]');
      await expect(announcement).toBeVisible();
      
      const announcementText = await announcement.textContent();
      expect(announcementText).toMatch(/added.*cart/i);
    });

    test('should announce search results', async () => {
      // Open search and perform search
      await page.locator('[data-testid="search-button"]').click();
      await page.locator('[data-testid="search-input"]').fill('dress');
      
      // Wait for search results
      await page.waitForSelector('[data-testid="search-results"]');
      
      // Check for results announcement
      const resultsAnnouncement = page.locator('[aria-live="polite"]');
      const announcementText = await resultsAnnouncement.textContent();
      expect(announcementText).toMatch(/\d+.*results?/i);
    });

    test('should announce loading states', async () => {
      // Test loading announcement
      await page.goto('/collections');
      
      // Check for loading announcement
      const loadingAnnouncement = page.locator('[aria-live="polite"][aria-busy="true"], [role="status"]');
      
      if (await loadingAnnouncement.count() > 0) {
        const loadingText = await loadingAnnouncement.textContent();
        expect(loadingText).toMatch(/loading|please wait/i);
      }
    });
  });

  test.describe('Focus Management in Dynamic Content', () => {
    test('should manage focus when opening modals', async () => {
      // Open search modal
      await page.locator('[data-testid="search-button"]').click();
      
      // Focus should move to search input
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeFocused();
      
      // Close modal and focus should return to trigger
      await page.keyboard.press('Escape');
      const searchButton = page.locator('[data-testid="search-button"]');
      await expect(searchButton).toBeFocused();
    });

    test('should manage focus when navigating between pages', async () => {
      // Navigate to collections page
      await page.locator('nav a[href="/collections"]').click();
      
      // Focus should be on main content or h1
      const mainHeading = page.locator('h1');
      const mainContent = page.locator('main');
      
      const h1Focused = await mainHeading.evaluate(el => document.activeElement === el);
      const mainFocused = await mainContent.evaluate(el => document.activeElement === el);
      
      expect(h1Focused || mainFocused).toBeTruthy();
    });

    test('should announce page changes for single-page app navigation', async () => {
      // Navigate to different page
      await page.locator('nav a[href="/collections"]').click();
      
      // Check for page change announcement
      const pageAnnouncement = page.locator('[aria-live="assertive"], [role="alert"]');
      
      if (await pageAnnouncement.count() > 0) {
        const announcementText = await pageAnnouncement.textContent();
        expect(announcementText).toMatch(/navigated|page.*loaded/i);
      }
    });
  });
});