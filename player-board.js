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

const HOTEL_STYLES = {
  Sackson: 'bg-red-700 text-white font-bold px-2 rounded',
  Tower: 'bg-yellow-300 text-black font-bold px-2 rounded',
  American: 'bg-blue-100 text-blue-900 font-bold px-2 rounded',
  Festival: 'bg-green-700 text-white font-bold px-2 rounded',
  Worldwide: 'bg-purple-800 text-white font-bold px-2 rounded',
  Continental: 'bg-blue-500 text-white font-bold px-2 rounded',
  Imperial: 'bg-orange-500 text-white font-bold px-2 rounded',
};

const MODES = [
  { value: 'tycoon', label: 'Tycoon Mode' },
  { value: 'classic', label: 'Classic Mode' },
];

function loadState() {
  let mode = 'tycoon';
  let hotelSizes = Object.fromEntries(HOTEL_NAMES.map((name) => [name, 0]));
  try {
    const storedMode = localStorage.getItem('acquire_mode');
    if (storedMode) mode = storedMode;
    const storedSizes = localStorage.getItem('acquire_hotelSizes');
    if (storedSizes) hotelSizes = JSON.parse(storedSizes);
  } catch (e) {}
  return { mode, hotelSizes };
}

function saveState(state) {
  try {
    localStorage.setItem('acquire_mode', state.mode);
    localStorage.setItem(
      'acquire_hotelSizes',
      JSON.stringify(state.hotelSizes)
    );
  } catch (e) {}
}

let state = loadState();

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
    const hotelStyle = HOTEL_STYLES[hotel] || '';
    return `
      <tr class="border-b last:border-b-0">
        <td class="py-2 pr-4 w-32 whitespace-nowrap">
          <span class="${hotelStyle}">${hotel}</span>
        </td>
        <td class="py-2 pr-4 flex items-center gap-2">
          <span class="inline-block w-10 text-center bg-gray-100 rounded px-2">${
            size > 0 ? size : '-'
          }</span>
          <button type="button" class="ml-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Increase size for ${hotel}" data-hotel="${hotel}">+</button>
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
          <th class="py-2 pr-4 w-32 whitespace-nowrap">Hotel</th>
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
    saveState(state);
    renderPlayerBoard();
  });

  // Add event listeners for + buttons
  root.querySelectorAll('button[data-hotel]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const hotel = e.currentTarget.getAttribute('data-hotel');
      const current = state.hotelSizes[hotel] || 0;
      state.hotelSizes[hotel] = current === 0 ? 2 : current + 1;
      saveState(state);
      renderPlayerBoard();
    });
  });
}

document.addEventListener('DOMContentLoaded', renderPlayerBoard);
