// Tycoon Mode data for Acquire (2024)
// Structure: Array of objects for each hotel chain size bracket
// Each object: { sizeRange, buySellPrice, bonuses: { primary, secondary, tertiary } }

export const tycoonTable = [
  {
    sizeRange: '2',
    buySellPrice: 200,
    bonuses: { primary: 2000, secondary: 1500, tertiary: 1000 },
  },
  {
    sizeRange: '3',
    buySellPrice: 300,
    bonuses: { primary: 3000, secondary: 2200, tertiary: 1500 },
  },
  {
    sizeRange: '4',
    buySellPrice: 400,
    bonuses: { primary: 4000, secondary: 3000, tertiary: 2000 },
  },
  {
    sizeRange: '5',
    buySellPrice: 500,
    bonuses: { primary: 5000, secondary: 3700, tertiary: 2500 },
  },
  {
    sizeRange: '6-10',
    buySellPrice: 600,
    bonuses: { primary: 6000, secondary: 4200, tertiary: 3000 },
  },
  {
    sizeRange: '11-20',
    buySellPrice: 700,
    bonuses: { primary: 7000, secondary: 5000, tertiary: 3500 },
  },
  {
    sizeRange: '21-30',
    buySellPrice: 800,
    bonuses: { primary: 8000, secondary: 5700, tertiary: 4000 },
  },
  {
    sizeRange: '31-40',
    buySellPrice: 900,
    bonuses: { primary: 9000, secondary: 6200, tertiary: 4500 },
  },
  {
    sizeRange: '41 & over',
    buySellPrice: 1000,
    bonuses: { primary: 10000, secondary: 7000, tertiary: 5000 },
  },
  {
    sizeRange: '—',
    buySellPrice: 1100,
    bonuses: { primary: 11000, secondary: 7700, tertiary: 5500 },
  },
  {
    sizeRange: '—',
    buySellPrice: 1200,
    bonuses: { primary: 12000, secondary: 8200, tertiary: 6000 },
  },
];
