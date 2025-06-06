// Tycoon Mode data for Acquire (2024)
// There are three columns of data, depending on hotel chain:
// column-1: Sackson, Tower
// column-2: American, Festival, Worldwide
// column-3: Continental, Imperial

export const hotelNameToColumn = {
  Sackson: 'column-1',
  Tower: 'column-1',
  American: 'column-2',
  Festival: 'column-2',
  Worldwide: 'column-2',
  Continental: 'column-3',
  Imperial: 'column-3',
};

export const tycoonTable = {
  'column-1': {
    2: {
      buySellPrice: 200,
      bonuses: { primary: 2000, secondary: 1500, tertiary: 1000 },
    },
    3: {
      buySellPrice: 300,
      bonuses: { primary: 3000, secondary: 2200, tertiary: 1500 },
    },
    4: {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 3000, tertiary: 2000 },
    },
    5: {
      buySellPrice: 500,
      bonuses: { primary: 5000, secondary: 3700, tertiary: 2500 },
    },
    '6-10': {
      buySellPrice: 600,
      bonuses: { primary: 6000, secondary: 4200, tertiary: 3000 },
    },
    '11-20': {
      buySellPrice: 700,
      bonuses: { primary: 7000, secondary: 5000, tertiary: 3500 },
    },
    '21-30': {
      buySellPrice: 800,
      bonuses: { primary: 8000, secondary: 5700, tertiary: 4000 },
    },
    '31-40': {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 6200, tertiary: 4500 },
    },
    '41+': {
      buySellPrice: 1000,
      bonuses: { primary: 10000, secondary: 7000, tertiary: 5000 },
    },
  },
  'column-2': {
    2: {
      buySellPrice: 300,
      bonuses: { primary: 3000, secondary: 2200, tertiary: 1500 },
    },
    3: {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 3000, tertiary: 2000 },
    },
    4: {
      buySellPrice: 500,
      bonuses: { primary: 5000, secondary: 3700, tertiary: 2500 },
    },
    5: {
      buySellPrice: 600,
      bonuses: { primary: 6000, secondary: 4200, tertiary: 3000 },
    },
    '6-10': {
      buySellPrice: 700,
      bonuses: { primary: 7000, secondary: 5000, tertiary: 3500 },
    },
    '11-20': {
      buySellPrice: 800,
      bonuses: { primary: 8000, secondary: 5700, tertiary: 4000 },
    },
    '21-30': {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 6200, tertiary: 4500 },
    },
    '31-40': {
      buySellPrice: 1000,
      bonuses: { primary: 10000, secondary: 7000, tertiary: 5000 },
    },
    '41+': {
      buySellPrice: 1100,
      bonuses: { primary: 11000, secondary: 7700, tertiary: 5500 },
    },
  },
  'column-3': {
    2: {
      buySellPrice: 400,
      bonuses: { primary: 4000, secondary: 3000, tertiary: 2000 },
    },
    3: {
      buySellPrice: 500,
      bonuses: { primary: 5000, secondary: 3700, tertiary: 2500 },
    },
    4: {
      buySellPrice: 600,
      bonuses: { primary: 6000, secondary: 4200, tertiary: 3000 },
    },
    5: {
      buySellPrice: 700,
      bonuses: { primary: 7000, secondary: 5000, tertiary: 3500 },
    },
    '6-10': {
      buySellPrice: 800,
      bonuses: { primary: 8000, secondary: 5700, tertiary: 4000 },
    },
    '11-20': {
      buySellPrice: 900,
      bonuses: { primary: 9000, secondary: 6200, tertiary: 4500 },
    },
    '21-30': {
      buySellPrice: 1000,
      bonuses: { primary: 10000, secondary: 7000, tertiary: 5000 },
    },
    '31-40': {
      buySellPrice: 1100,
      bonuses: { primary: 11000, secondary: 7700, tertiary: 5500 },
    },
    '41+': {
      buySellPrice: 1200,
      bonuses: { primary: 12000, secondary: 8200, tertiary: 6000 },
    },
  },
};
