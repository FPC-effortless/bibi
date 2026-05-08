/**
 * Pre-defined Test Cases for User Flow Validation
 * Based on requirements from the specification
 */

import { TestCase } from '../framework/test-case-manager';

export const navigationTestCases: TestCase[] = [
  {
    id: 'nav-001',
    name: 'Header Navigation - Logo Click',
    description: 'Verify logo click navigates to homepage',
    userType: 'both',
    category: 'navigation',
    priority: 'high',
    status: 'pending',
    requirements: ['1.1', '1.2'],
    steps: [
      {
        action: 'Navigate to any page',
        element: 'browser',
        expectedBehavior: 'Page loads successfully',
        validationCriteria: ['Page is accessible', 'No console errors']
      },
      {
        action: 'Click on logo',
        element: 'header .logo',
        expectedBehavior: 'Navigates to homepage',
        validationCriteria: ['URL changes to homepage', 'Homepage content loads']
      }
    ],
    expectedResults: [
      'Logo is clickable and visible',
      'Click navigates to homepage',
      'Navigation is smooth without errors'
    ]
  },
  {
    id: 'nav-002',
    name: 'Header Navigation - Main Menu Links',
    description: 'Verify all main navigation menu links work correctly',
    userType: 'both',
    category: 'navigation',
    priority: 'high',
    status: 'pending',
    requirements: ['1.1', '1.2'],
    steps: [
      {
        action: 'Navigate to homepage',
        element: 'browser',
        expectedBehavior: 'Homepage loads',
        validationCriteria: ['Page loads without errors']
      },
      {
        action: 'Click New Arrivals link',
        element: 'nav a[href*="new-arrivals"]',
        expectedBehavior: 'Navigates to new arrivals page',
        validationCriteria: ['URL changes', 'Page content loads']
      },
      {
        action: 'Click Dresses link',
        element: 'nav a[href*="dresses"]',
        expectedBehavior: 'Navigates to dresses collection',
        validationCriteria: ['URL changes', 'Collection page loads']
      },
      {
        action: 'Click Lookbook link',
        element: 'nav a[href*="lookbook"]',
        expectedBehavior: 'Navigates to lookbook page',
        validationCriteria: ['URL changes', 'Lookbook content loads']
      },
      {
        action: 'Click Journal link',
        element: 'nav a[href*="journal"]',
        expectedBehavior: 'Navigates to journal page',
        validationCriteria: ['URL changes', 'Journal content loads']
      }
    ],
    expectedResults: [
      'All navigation links are functional',
      'Each link navigates to correct page',
      'No broken links or 404 errors'
    ]
  },
  {
    id: 'nav-003',
    name: 'Mobile Navigation Menu',
    description: 'Verify mobile menu toggle and navigation functionality',
    userType: 'both',
    category: 'navigation',
    priority: 'high',
    status: 'pending',
    requirements: ['1.3', '7.3'],
    steps: [
      {
        action: 'Navigate to homepage on mobile viewport',
        element: 'browser',
        expectedBehavior: 'Mobile layout loads',
        validationCriteria: ['Mobile viewport active', 'Mobile menu button visible']
      },
      {
        action: 'Click mobile menu toggle button',
        element: '.mobile-menu-toggle',
        expectedBehavior: 'Mobile menu opens',
        validationCriteria: ['Menu slides out', 'Navigation links visible']
      },
      {
        action: 'Click navigation link in mobile menu',
        element: '.mobile-menu a',
        expectedBehavior: 'Navigates to selected page',
        validationCriteria: ['Page navigation works', 'Menu closes after navigation']
      }
    ],
    expectedResults: [
      'Mobile menu toggle is accessible',
      'Menu opens and closes properly',
      'All navigation links work in mobile menu'
    ]
  }
];

export const searchTestCases: TestCase[] = [
  {
    id: 'search-001',
    name: 'Search Modal Opening',
    description: 'Verify search icon opens search modal correctly',
    userType: 'both',
    category: 'product-discovery',
    priority: 'high',
    status: 'pending',
    requirements: ['3.1'],
    steps: [
      {
        action: 'Navigate to homepage',
        element: 'browser',
        expectedBehavior: 'Homepage loads',
        validationCriteria: ['Page loads successfully']
      },
      {
        action: 'Click search icon',
        element: '.search-icon',
        expectedBehavior: 'Search modal opens',
        validationCriteria: ['Modal appears', 'Search input is focused', 'Modal overlay visible']
      },
      {
        action: 'Type search query',
        element: '.search-input',
        expectedBehavior: 'Text appears in input field',
        validationCriteria: ['Input accepts text', 'Search suggestions may appear']
      }
    ],
    expectedResults: [
      'Search icon is clickable',
      'Modal opens smoothly',
      'Search input is functional'
    ]
  },
  {
    id: 'search-002',
    name: 'Search Functionality and Results',
    description: 'Verify search input, suggestions, and results display',
    userType: 'both',
    category: 'product-discovery',
    priority: 'high',
    status: 'pending',
    requirements: ['3.2', '3.5'],
    steps: [
      {
        action: 'Open search modal',
        element: '.search-icon',
        expectedBehavior: 'Search modal opens',
        validationCriteria: ['Modal is visible']
      },
      {
        action: 'Type "dress" in search field',
        element: '.search-input',
        expectedBehavior: 'Search suggestions appear',
        validationCriteria: ['Suggestions dropdown visible', 'Relevant suggestions shown']
      },
      {
        action: 'Press Enter or click search',
        element: '.search-input',
        expectedBehavior: 'Search results display',
        validationCriteria: ['Results page loads', 'Products matching query shown']
      },
      {
        action: 'Click on a search result',
        element: '.search-result-item',
        expectedBehavior: 'Navigates to product page',
        validationCriteria: ['Product page loads', 'Correct product displayed']
      }
    ],
    expectedResults: [
      'Search input is responsive',
      'Search suggestions are relevant',
      'Search results display correctly',
      'Result navigation works'
    ]
  }
];

export const productTestCases: TestCase[] = [
  {
    id: 'product-001',
    name: 'Product Card Interactions',
    description: 'Verify product card display and interaction functionality',
    userType: 'both',
    category: 'product-discovery',
    priority: 'high',
    status: 'pending',
    requirements: ['2.1', '2.2', '2.3'],
    steps: [
      {
        action: 'Navigate to collections page',
        element: 'browser',
        expectedBehavior: 'Collections page loads with product grid',
        validationCriteria: ['Product cards visible', 'Images load', 'Prices display']
      },
      {
        action: 'Hover over product card',
        element: '.product-card',
        expectedBehavior: 'Hover effects activate',
        validationCriteria: ['Visual feedback on hover', 'Additional buttons may appear']
      },
      {
        action: 'Click Add to Cart button',
        element: '.product-card .add-to-cart',
        expectedBehavior: 'Item added to cart',
        validationCriteria: ['Cart count updates', 'Success feedback shown']
      },
      {
        action: 'Click Add to Wishlist button',
        element: '.product-card .add-to-wishlist',
        expectedBehavior: 'Item added to wishlist',
        validationCriteria: ['Wishlist count updates', 'Heart icon changes state']
      }
    ],
    expectedResults: [
      'Product cards display correctly',
      'Hover effects work properly',
      'Add to cart functionality works',
      'Add to wishlist functionality works'
    ]
  },
  {
    id: 'product-002',
    name: 'Product Detail Page Functionality',
    description: 'Verify product detail page displays and functions correctly',
    userType: 'both',
    category: 'product-discovery',
    priority: 'high',
    status: 'pending',
    requirements: ['2.4', '2.5', '2.6'],
    steps: [
      {
        action: 'Click on product card',
        element: '.product-card',
        expectedBehavior: 'Navigates to product detail page',
        validationCriteria: ['Product page loads', 'URL changes to product route']
      },
      {
        action: 'Verify product information display',
        element: '.product-details',
        expectedBehavior: 'All product info is visible',
        validationCriteria: ['Name, price, description visible', 'Images load properly']
      },
      {
        action: 'Click size selector',
        element: '.size-selector',
        expectedBehavior: 'Size options display',
        validationCriteria: ['Size options are clickable', 'Selection updates']
      },
      {
        action: 'Select color option',
        element: '.color-selector',
        expectedBehavior: 'Color selection updates',
        validationCriteria: ['Color changes', 'Product images may update']
      },
      {
        action: 'Adjust quantity',
        element: '.quantity-selector',
        expectedBehavior: 'Quantity updates',
        validationCriteria: ['Number changes', 'Buttons are functional']
      },
      {
        action: 'Click Add to Cart',
        element: '.add-to-cart-button',
        expectedBehavior: 'Item added to cart',
        validationCriteria: ['Cart updates', 'Success message shown']
      }
    ],
    expectedResults: [
      'Product detail page loads completely',
      'All selectors function properly',
      'Add to cart works with selected options'
    ]
  }
];

export const cartTestCases: TestCase[] = [
  {
    id: 'cart-001',
    name: 'Cart Drawer Functionality',
    description: 'Verify cart drawer opens and displays items correctly',
    userType: 'both',
    category: 'shopping',
    priority: 'high',
    status: 'pending',
    requirements: ['4.1', '4.2'],
    steps: [
      {
        action: 'Add item to cart',
        element: '.add-to-cart',
        expectedBehavior: 'Item added to cart',
        validationCriteria: ['Cart count updates']
      },
      {
        action: 'Click cart icon',
        element: '.cart-icon',
        expectedBehavior: 'Cart drawer opens',
        validationCriteria: ['Drawer slides out', 'Cart items visible']
      },
      {
        action: 'Verify cart item display',
        element: '.cart-item',
        expectedBehavior: 'Item details are shown',
        validationCriteria: ['Image, name, price, quantity visible']
      },
      {
        action: 'Update item quantity',
        element: '.quantity-controls',
        expectedBehavior: 'Quantity and total update',
        validationCriteria: ['Numbers change', 'Subtotal recalculates']
      },
      {
        action: 'Remove item from cart',
        element: '.remove-item',
        expectedBehavior: 'Item is removed',
        validationCriteria: ['Item disappears', 'Total updates']
      }
    ],
    expectedResults: [
      'Cart drawer opens properly',
      'Items display with correct information',
      'Quantity controls work',
      'Item removal works'
    ]
  }
];

export const checkoutTestCases: TestCase[] = [
  {
    id: 'checkout-001',
    name: 'Checkout Process Flow',
    description: 'Verify complete checkout process from cart to confirmation',
    userType: 'both',
    category: 'shopping',
    priority: 'high',
    status: 'pending',
    requirements: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6'],
    steps: [
      {
        action: 'Click Proceed to Checkout',
        element: '.proceed-to-checkout',
        expectedBehavior: 'Navigates to checkout page',
        validationCriteria: ['Checkout page loads', 'Progress indicator visible']
      },
      {
        action: 'Fill shipping information',
        element: '.shipping-form',
        expectedBehavior: 'Form accepts input',
        validationCriteria: ['All fields are fillable', 'Validation works']
      },
      {
        action: 'Click Continue to Payment',
        element: '.continue-to-payment',
        expectedBehavior: 'Advances to payment step',
        validationCriteria: ['Payment form loads', 'Progress updates']
      },
      {
        action: 'Fill payment information',
        element: '.payment-form',
        expectedBehavior: 'Payment form accepts input',
        validationCriteria: ['Card fields work', 'Validation active']
      },
      {
        action: 'Click Review Order',
        element: '.review-order',
        expectedBehavior: 'Shows order review',
        validationCriteria: ['Order summary visible', 'All details correct']
      },
      {
        action: 'Complete order',
        element: '.complete-order',
        expectedBehavior: 'Order confirmation shown',
        validationCriteria: ['Success message', 'Order number provided']
      }
    ],
    expectedResults: [
      'Checkout flow progresses smoothly',
      'All forms validate properly',
      'Order completion works',
      'Confirmation is displayed'
    ]
  }
];

export const accountTestCases: TestCase[] = [
  {
    id: 'account-001',
    name: 'Account Page Navigation',
    description: 'Verify account page access and navigation',
    userType: 'registered',
    category: 'account',
    priority: 'medium',
    status: 'pending',
    requirements: ['5.1', '5.2'],
    steps: [
      {
        action: 'Click account/user icon',
        element: '.account-icon',
        expectedBehavior: 'Navigates to account page',
        validationCriteria: ['Account page loads', 'User is authenticated']
      },
      {
        action: 'Verify account sidebar',
        element: '.account-sidebar',
        expectedBehavior: 'Sidebar navigation is visible',
        validationCriteria: ['Navigation options visible', 'Current section highlighted']
      },
      {
        action: 'Click Wishlist in sidebar',
        element: '.sidebar-wishlist',
        expectedBehavior: 'Wishlist view loads',
        validationCriteria: ['Wishlist items display', 'View switches correctly']
      },
      {
        action: 'Click My Wardrobe in sidebar',
        element: '.sidebar-wardrobe',
        expectedBehavior: 'Wardrobe view loads',
        validationCriteria: ['Purchased items display', 'View switches correctly']
      }
    ],
    expectedResults: [
      'Account page is accessible',
      'Sidebar navigation works',
      'View switching functions properly'
    ]
  }
];

export const mobileTestCases: TestCase[] = [
  {
    id: 'mobile-001',
    name: 'Mobile Touch Interactions',
    description: 'Verify touch interactions work properly on mobile devices',
    userType: 'both',
    category: 'mobile',
    priority: 'high',
    status: 'pending',
    requirements: ['7.1', '7.2', '7.4'],
    steps: [
      {
        action: 'Navigate to homepage on mobile',
        element: 'browser',
        expectedBehavior: 'Mobile layout loads',
        validationCriteria: ['Responsive layout active', 'Touch targets adequate size']
      },
      {
        action: 'Tap product card',
        element: '.product-card',
        expectedBehavior: 'Product page loads',
        validationCriteria: ['Touch response immediate', 'Navigation works']
      },
      {
        action: 'Swipe product image gallery',
        element: '.product-gallery',
        expectedBehavior: 'Images change with swipe',
        validationCriteria: ['Swipe gestures work', 'Images transition smoothly']
      },
      {
        action: 'Tap size and color selectors',
        element: '.mobile-selectors',
        expectedBehavior: 'Selectors respond to touch',
        validationCriteria: ['Touch targets work', 'Visual feedback provided']
      }
    ],
    expectedResults: [
      'Mobile layout is responsive',
      'Touch interactions are smooth',
      'All touch targets are accessible'
    ]
  }
];

export const accessibilityTestCases: TestCase[] = [
  {
    id: 'a11y-001',
    name: 'Keyboard Navigation',
    description: 'Verify all functionality is accessible via keyboard',
    userType: 'both',
    category: 'accessibility',
    priority: 'high',
    status: 'pending',
    requirements: ['9.1', '9.4'],
    steps: [
      {
        action: 'Navigate using Tab key',
        element: 'keyboard',
        expectedBehavior: 'Focus moves through interactive elements',
        validationCriteria: ['Tab order is logical', 'Focus indicators visible']
      },
      {
        action: 'Press Enter on focused button',
        element: 'keyboard',
        expectedBehavior: 'Button action executes',
        validationCriteria: ['Keyboard activation works', 'Same as mouse click']
      },
      {
        action: 'Use arrow keys in menus',
        element: 'keyboard',
        expectedBehavior: 'Menu navigation works',
        validationCriteria: ['Arrow key navigation functional']
      },
      {
        action: 'Press Escape in modal',
        element: 'keyboard',
        expectedBehavior: 'Modal closes',
        validationCriteria: ['Escape key closes modal', 'Focus returns properly']
      }
    ],
    expectedResults: [
      'All interactive elements are keyboard accessible',
      'Tab order is logical and complete',
      'Keyboard shortcuts work as expected'
    ]
  }
];

// Export all test case collections
export const allTestCases: TestCase[] = [
  ...navigationTestCases,
  ...searchTestCases,
  ...productTestCases,
  ...cartTestCases,
  ...checkoutTestCases,
  ...accountTestCases,
  ...mobileTestCases,
  ...accessibilityTestCases
];

// Export test cases by category
export const testCasesByCategory = {
  navigation: navigationTestCases,
  'product-discovery': [...searchTestCases, ...productTestCases],
  shopping: [...cartTestCases, ...checkoutTestCases],
  account: accountTestCases,
  mobile: mobileTestCases,
  accessibility: accessibilityTestCases
};

// Export test cases by priority
export const testCasesByPriority = {
  high: allTestCases.filter(tc => tc.priority === 'high'),
  medium: allTestCases.filter(tc => tc.priority === 'medium'),
  low: allTestCases.filter(tc => tc.priority === 'low')
};