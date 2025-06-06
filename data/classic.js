// Classic Mode data for Acquire (2024)
// There are three columns of data, depending on hotel chain:
// column-1: Sackson, Tower
// column-2: American, Festival, Worldwide
// column-3: Continental, Imperial

export const classicHotelNameToColumn = {
  Sackson: 'column-1',
  Tower: 'column-1',
  American: 'column-2',
  Festival: 'column-2',
  Worldwide: 'column-2',
  Continental: 'column-3',
  Imperial: 'column-3',
};

export const classicTable = {
  'column-1': {
    2: {
      buySellPrice: 200,
      bonuses: { primary: 2000, secondary: 1000 },
      isSafe: false,
    },
    3: {
      buySellPrice: 300,
      bonuses: { primary: 3000, secondary: 1500 },
      isSafe: false,
    },
    4: {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 2000 },
      isSafe: false,
    },
    5: {
      buySellPrice: 500,
      bonuses: { primary: 5000, secondary: 2500 },
      isSafe: false,
    },
    '6-10': {
      buySellPrice: 600,
      bonuses: { primary: 6000, secondary: 3000 },
      isSafe: false,
    },
    '11-20': {
      buySellPrice: 700,
      bonuses: { primary: 7000, secondary: 3500 },
      isSafe: true,
    },
    '21-30': {
      buySellPrice: 800,
      bonuses: { primary: 8000, secondary: 4000 },
      isSafe: true,
    },
    '31-40': {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 4500 },
      isSafe: true,
    },
    '41+': {
      buySellPrice: 1000,
      bonuses: { primary: 10000, secondary: 5000 },
      isSafe: true,
    },
  },
  'column-2': {
    3: {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 2000 },
      isSafe: false,
    },
    4: {
      buySellPrice: 500,
      bonuses: { primary: 5000, secondary: 2500 },
      isSafe: false,
    },
    5: {
      buySellPrice: 600,
      bonuses: { primary: 6000, secondary: 3000 },
      isSafe: false,
    },
    '6-10': {
      buySellPrice: 700,
      bonuses: { primary: 7000, secondary: 3500 },
      isSafe: false,
    },
    '11-20': {
      buySellPrice: 800,
      bonuses: { primary: 8000, secondary: 4000 },
      isSafe: true,
    },
    '21-30': {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 4500 },
      isSafe: true,
    },
    '31-40': {
      buySellPrice: 1000,
      bonuses: { primary: 10000, secondary: 5000 },
      isSafe: true,
    },
    '41+': {
      buySellPrice: 1100,
      bonuses: { primary: 11000, secondary: 5500 },
      isSafe: true,
    },
    '41+_1': {
      buySellPrice: 1200,
      bonuses: { primary: 12000, secondary: 6000 },
      isSafe: true,
    },
  },
  'column-3': {
    4: {
      buySellPrice: 600,
      bonuses: { primary: 6000, secondary: 3000 },
      isSafe: false,
    },
    5: {
      buySellPrice: 700,
      bonuses: { primary: 7000, secondary: 3500 },
      isSafe: false,
    },
    '6-10': {
      buySellPrice: 800,
      bonuses: { primary: 8000, secondary: 4000 },
      isSafe: false,
    },
    '11-20': {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 4500 },
      isSafe: true,
    },
    '21-30': {
      buySellPrice: 1000,
      bonuses: { primary: 10000, secondary: 5000 },
      isSafe: true,
    },
    '31-40': {
      buySellPrice: 1100,
      bonuses: { primary: 11000, secondary: 5500 },
      isSafe: true,
    },
    '41+': {
      buySellPrice: 1200,
      bonuses: { primary: 12000, secondary: 6000 },
      isSafe: true,
    },
  },
};
