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

  assertEqual(
    getHotelChainData('classic', 'Sackson', 2),
    {
      buySellPrice: 200,
      bonuses: { primary: 2000, secondary: 1000 },
    },
    'Sackson, size 2 (classic) returns correct data'
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

  assertEqual(
    getHotelChainData('classic', 'American', 3),
    {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 2000 },
    },
    'American, size 3 (classic) returns correct data'
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
  assertEqual(
    getHotelChainData('classic', 'Imperial', 35),
    {
      buySellPrice: 1100,
      bonuses: { primary: 11000, secondary: 5500 },
    },
    'Imperial, size 35 (classic) returns correct data for 31-40 bracket'
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
  // Sackson, size 39 (column-1)
  assertEqual(
    getHotelChainData('tycoon', 'Sackson', 39),
    {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 6200, tertiary: 4500 },
    },
    'Sackson, size 39 (tycoon) returns correct data'
  );

  assertEqual(
    getHotelChainData('classic', 'Sackson', 39),
    {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 4500 },
    },
    'Sackson, size 39 (classic) returns correct data'
  );

  // large classic hotels
  // Loop through Sackson and Tower hotels
  const largeClassicColumn1Hotels = ['Sackson', 'Tower'];
  for (const hotel of largeClassicColumn1Hotels) {
    assertEqual(
      getHotelChainData('classic', hotel, 41),
      {
        buySellPrice: 1000,
        bonuses: { primary: 10000, secondary: 5000 },
      },
      `${hotel}, size 41 (classic) returns correct data for 41+ bracket [large, classic, column-1]`
    );
  }
  // loop through American, Festival, and Worldwide (column 2)
  const largeClassicColumn2Hotels = ['American', 'Festival', 'Worldwide'];
  for (const hotel of largeClassicColumn2Hotels) {
    assertEqual(
      getHotelChainData('classic', hotel, 41),
      {
        buySellPrice: 1100,
        bonuses: { primary: 11000, secondary: 5500 },
      },
      `${hotel}, size 41 (classic) returns correct data for 41+ bracket [large, classic, column-2]`
    );
  }
  // loop through Imperial, Tower, and Sackson (column 3)
  const largeClassicColumn3Hotels = ['Continental', 'Imperial'];
  for (const hotel of largeClassicColumn3Hotels) {
    assertEqual(
      getHotelChainData('classic', hotel, 41),
      {
        buySellPrice: 1200,
        bonuses: { primary: 12000, secondary: 6000 },
      },
      `${hotel}, size 41 (classic) returns correct data for 41+ bracket [large, classic, column-3]`
    );
  }

  // loop through large tycoon hotels
  const largeTycoonColumn1Hotels = ['Sackson', 'Tower'];
  for (const hotel of largeTycoonColumn1Hotels) {
    assertEqual(
      getHotelChainData('tycoon', hotel, 41),
      {
        buySellPrice: 1000,
        bonuses: { primary: 10000, secondary: 7000, tertiary: 5000 },
      },
      `${hotel}, size 41 (tycoon) returns correct data for 41+ bracket [large, tycoon, column-1]`
    );
  }
  // loop through large tycoon hotels
  const largeTycoonColumn2Hotels = ['American', 'Festival', 'Worldwide'];
  for (const hotel of largeTycoonColumn2Hotels) {
    assertEqual(
      getHotelChainData('tycoon', hotel, 41),
      {
        buySellPrice: 1100,
        bonuses: { primary: 11000, secondary: 7700, tertiary: 5500 },
      },
      `${hotel}, size 41 (tycoon) returns correct data for 41+ bracket [large, tycoon, column-2]`
    );
  }
  // loop through large tycoon hotels
  const largeTycoonColumn3Hotels = ['Continental', 'Imperial'];
  for (const hotel of largeTycoonColumn3Hotels) {
    assertEqual(
      getHotelChainData('tycoon', hotel, 41),
      {
        buySellPrice: 1200,
        bonuses: { primary: 12000, secondary: 8200, tertiary: 6000 },
      },
      `${hotel}, size 41 (tycoon) returns correct data for 41+ bracket [large, tycoon, column-3]`
    );
  }

  // we're seeing problems with Tycoon / American / 2 in the UI, so let's explicitly test it here
  assertEqual(
    getHotelChainData('tycoon', 'American', 2),
    {
      buySellPrice: 300,
      bonuses: { primary: 3000, secondary: 2200, tertiary: 1500 },
    },
    'American, size 2 (tycoon) returns correct data [ui confirmation]'
  );
  // we probably have a similar problem for Tycoon / Imperial / 2
  assertEqual(
    getHotelChainData('tycoon', 'Imperial', 2),
    {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 3000, tertiary: 2000 },
    },
    'Imperial, size 2 (tycoon) returns correct data [ui confirmation]'
  );
}
