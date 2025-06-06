import { getHotelChainData } from './utils.js';

function assertEqual(actual, expected, message) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (pass) {
    console.log(`PASS: ${message}`);
  } else {
    console.error(
      `FAIL: ${message}\n  Expected: ${JSON.stringify(
        expected
      )}\n  Actual:   ${JSON.stringify(actual)}`
    );
  }
}

// Basic test cases for Tycoon Mode
// All tests now use integer chain sizes

defaultTests();

function defaultTests() {
  // Test 1: Sackson, size 2 (column-1)
  assertEqual(
    getHotelChainData('tycoon', 'Sackson', 2),
    {
      buySellPrice: 200,
      bonuses: { primary: 2000, secondary: 1500, tertiary: 1000 },
    },
    'Sackson, size 2 (tycoon) returns correct data'
  );

  // Test 2: American, size 3 (column-2)
  assertEqual(
    getHotelChainData('tycoon', 'American', 3),
    {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 3000, tertiary: 2000 },
    },
    'American, size 3 (tycoon) returns correct data'
  );

  // Test 3: Imperial, size 35 (column-3, should map to '31-40')
  assertEqual(
    getHotelChainData('tycoon', 'Imperial', 35),
    {
      buySellPrice: 1100,
      bonuses: { primary: 11000, secondary: 7700, tertiary: 5500 },
    },
    'Imperial, size 35 (tycoon) returns correct data for 31-40 bracket'
  );

  // Test 4: Unknown hotel name
  assertEqual(
    getHotelChainData('tycoon', 'Nonexistent', 2),
    null,
    'Unknown hotel name returns null'
  );

  // Test 5: Invalid size (below minimum)
  assertEqual(
    getHotelChainData('tycoon', 'Sackson', 1),
    null,
    'Invalid size (below 2) returns null'
  );

  // Add more tests below as needed...
}
