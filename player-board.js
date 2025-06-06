import { getHotelChainData } from './data/utils.js';
import { tycoonTable, hotelNameToColumn } from './data/tycoon.js';
import { classicTable, classicHotelNameToColumn } from './data/classic.js';

const HOTEL_NAMES = [
  'Sackson',
  'Tower',
  'American',
  'Festival',
  'Worldwide',
  'Continental',
  'Imperial',
];

const MODES = [
  { value: 'tycoon', label: 'Tycoon Mode' },
  { value: 'classic', label: 'Classic Mode' },
];

let state = {
  mode: 'tycoon',
  hotelSizes: Object.fromEntries(HOTEL_NAMES.map((name) => [name, 0])),
};

function renderPlayerBoard() {
  const root = document.getElementById('player-board-root');
  if (!root) return;

  // Mode selector
  const modeSelector = `
    <div class="mb-6 flex items-center gap-4">
      <label for="mode-select" class="font-medium">Game mode:</label>
      <select id="mode-select" class="border rounded px-2 py-1">
        ${MODES.map(
          (m) =>
            `<option value="${m.value}"${
              state.mode === m.value ? ' selected' : ''
            }>${m.label}</option>`
        ).join('')}
      </select>
    </div>
  `;

  // Hotel list
  const hotelRows = HOTEL_NAMES.map((hotel) => {
    const size = state.hotelSizes[hotel];
    let info = '<span class="text-gray-400">No information</span>';
    if (size > 0) {
      const data = getHotelChainData(state.mode, hotel, size);
      if (data) {
        info = `
          <div class="flex flex-col gap-1">
            <span>Buy/Sell: <span class="font-semibold">$${data.buySellPrice.toLocaleString(
              'en-GB'
            )}</span></span>
            <span>Primary bonus: <span class="font-semibold">$${data.bonuses.primary.toLocaleString(
              'en-GB'
            )}</span></span>
            <span>Secondary bonus: <span class="font-semibold">$${data.bonuses.secondary.toLocaleString(
              'en-GB'
            )}</span></span>
            ${
              data.bonuses.tertiary !== undefined
                ? `<span>Tertiary bonus: <span class="font-semibold">$${data.bonuses.tertiary.toLocaleString(
                    'en-GB'
                  )}</span></span>`
                : ''
            }
          </div>
        `;
      } else {
        info = '<span class="text-red-500">No data for this size</span>';
      }
    }
    return `
      <tr class="border-b last:border-b-0">
        <td class="py-2 pr-4 font-medium">${hotel}</td>
        <td class="py-2 pr-4">
          <span class="inline-block w-10 text-center bg-gray-100 rounded px-2">${
            size > 0 ? size : '-'
          }</span>
        </td>
        <td class="py-2">${info}</td>
      </tr>
    `;
  }).join('');

  root.innerHTML = `
    ${modeSelector}
    <table class="w-full text-left bg-white rounded shadow">
      <thead>
        <tr class="border-b">
          <th class="py-2 pr-4">Hotel</th>
          <th class="py-2 pr-4">Size</th>
          <th class="py-2">Information</th>
        </tr>
      </thead>
      <tbody>
        ${hotelRows}
      </tbody>
    </table>
  `;

  // Add event listeners
  document.getElementById('mode-select').addEventListener('change', (e) => {
    state.mode = e.target.value;
    renderPlayerBoard();
  });
}

document.addEventListener('DOMContentLoaded', renderPlayerBoard);
