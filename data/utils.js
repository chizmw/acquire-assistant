import { tycoonTable, hotelNameToColumn } from './tycoon.js';
import { classicTable, classicHotelNameToColumn } from './classic.js';
// import { classicTable, hotelNameToColumn as classicHotelNameToColumn } from './classic.js'; // For future use

/**
 * Map an integer size to the correct size bracket key (works for all columns).
 * @param {number} size - The integer size of the hotel chain.
 * @returns {string|number|null} The correct key for the data table, or null if out of range.
 */
function getSizeBracketKey(size) {
  if (typeof size !== 'number' || size < 2) return null;
  if (size === 2) return 2;
  if (size === 3) return 3;
  if (size === 4) return 4;
  if (size === 5) return 5;
  if (size >= 6 && size <= 10) return '6-10';
  if (size >= 11 && size <= 20) return '11-20';
  if (size >= 21 && size <= 30) return '21-30';
  if (size >= 31 && size <= 40) return '31-40';
  if (size >= 41) return '41+';
  return null;
}

/**
 * Map an integer size to the correct sizeRange for classicTable.
 * @param {number} size - The integer size of the hotel chain.
 * @returns {string} The sizeRange string for classicTable.
 */
function getClassicSizeRange(size) {
  if (size === 2) return '2';
  if (size === 3) return '3';
  if (size === 4) return '4';
  if (size === 5) return '5';
  if (size >= 6 && size <= 10) return '6-10';
  if (size >= 11 && size <= 20) return '11-20';
  if (size >= 21 && size <= 30) return '21-30';
  if (size >= 31 && size <= 40) return '31-40';
  if (size >= 41) return '41 & over';
  return null;
}

/**
 * Get the data block for a hotel chain given the game mode, hotel name, and chain size.
 * @param {string} gameMode - The game mode ('tycoon' or 'classic').
 * @param {string} hotelName - The name of the hotel chain.
 * @param {number} chainSize - The integer size of the hotel chain (number of tiles).
 * @returns {object|null} The relevant data block, or null if not found.
 */
export function getHotelChainData(gameMode, hotelName, chainSize) {
  if (gameMode === 'tycoon') {
    const column = hotelNameToColumn[hotelName];
    if (!column) return null;
    const table = tycoonTable[column];
    if (!table) return null;
    const bracketKey = getSizeBracketKey(chainSize);
    if (!bracketKey) return null;
    return table[bracketKey] || null;
  }
  if (gameMode === 'classic') {
    const column = classicHotelNameToColumn[hotelName];
    if (!column) return null;
    const table = classicTable[column];
    if (!table) return null;
    const bracketKey = getSizeBracketKey(chainSize);
    if (!bracketKey) return null;
    return table[bracketKey] || null;
  }
  return null;
}
