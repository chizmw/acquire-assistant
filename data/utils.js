import { tycoonTable, hotelNameToColumn } from './tycoon.js';
// import { classicTable, hotelNameToColumn as classicHotelNameToColumn } from './classic.js'; // For future use

/**
 * Get the data block for a hotel chain given the game mode, hotel name, and chain size.
 * @param {string} gameMode - The game mode ('tycoon' or 'classic').
 * @param {string} hotelName - The name of the hotel chain.
 * @param {number|string} chainSize - The size of the hotel chain (number or size bracket string).
 * @returns {object|null} The relevant data block, or null if not found.
 */
export function getHotelChainData(gameMode, hotelName, chainSize) {
  if (gameMode === 'tycoon') {
    const column = hotelNameToColumn[hotelName];
    if (!column) return null;
    const table = tycoonTable[column];
    if (!table) return null;
    // Try direct match, then string match for bracketed sizes
    return table[chainSize] || table[String(chainSize)] || null;
  }
  // else if (gameMode === 'classic') {
  //   // Implement similar logic for classic mode when ready
  // }
  return null;
}
