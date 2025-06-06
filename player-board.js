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
  let mergeSelection = [];
  try {
    const storedMode = localStorage.getItem('acquire_mode');
    if (storedMode) mode = storedMode;
    const storedSizes = localStorage.getItem('acquire_hotelSizes');
    if (storedSizes) hotelSizes = JSON.parse(storedSizes);
    const storedMergeSelection = localStorage.getItem('acquire_mergeSelection');
    if (storedMergeSelection) mergeSelection = JSON.parse(storedMergeSelection);
  } catch (e) {}
  return { mode, hotelSizes, mergeSelection };
}

function saveState(state) {
  try {
    localStorage.setItem('acquire_mode', state.mode);
    localStorage.setItem(
      'acquire_hotelSizes',
      JSON.stringify(state.hotelSizes)
    );
    localStorage.setItem(
      'acquire_mergeSelection',
      JSON.stringify(state.mergeSelection)
    );
  } catch (e) {}
}

let state = loadState();

function renderPlayerBoard() {
  const root = document.getElementById('player-board-root');
  if (!root) return;

  // Hotel list
  const hotelRows = HOTEL_NAMES.map((hotel) => {
    const size = state.hotelSizes[hotel];
    let buySell = '-';
    let primary = '-';
    let secondary = '-';
    let tertiary = '-';
    if (size > 0) {
      const data = getHotelChainData(state.mode, hotel, size);
      if (data) {
        buySell =
          data.buySellPrice !== undefined && data.buySellPrice !== null
            ? `$${data.buySellPrice.toLocaleString('en-GB')}`
            : '-';
        primary =
          data.bonuses.primary !== undefined && data.bonuses.primary !== null
            ? `$${data.bonuses.primary.toLocaleString('en-GB')}`
            : '-';
        secondary =
          data.bonuses.secondary !== undefined &&
          data.bonuses.secondary !== null
            ? `$${data.bonuses.secondary.toLocaleString('en-GB')}`
            : '-';
        tertiary =
          data.bonuses.tertiary !== undefined && data.bonuses.tertiary !== null
            ? `$${data.bonuses.tertiary.toLocaleString('en-GB')}`
            : '-';
      }
    }
    const hotelStyle = HOTEL_STYLES[hotel] || '';
    const checked = state.mergeSelection.includes(hotel);
    const isActive = size > 0;
    const isSafe = size >= 11;
    const disabled =
      !isActive || (!checked && state.mergeSelection.length >= 2);
    // Reserve space for the safe icon (24px)
    const safeIcon = isSafe
      ? '<span class="inline-block align-middle ml-1 text-green-600" title="Safe"><svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm2-2a3 3 0 116 0v2H7V6z" clip-rule="evenodd"/></svg></span>'
      : '<span class="inline-block align-middle ml-1" style="width:24px;height:20px;"></span>';
    return `
      <tr class="border-b last:border-b-0">
        <td class="py-2 pr-4 w-32 whitespace-nowrap">
          <span class="${hotelStyle}">${hotel}</span>${safeIcon}
        </td>
        <td class="py-2 pr-4 flex items-center gap-2">
          <input type="number" min="2" max="99" step="1" value="${
            size > 0 ? size : ''
          }" data-hotel="${hotel}" class="w-14 text-center bg-gray-100 rounded px-2 py-1 border border-gray-200 focus:border-blue-400 focus:outline-none" aria-label="Set size for ${hotel}" />
          <button type="button" class="ml-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Increase size for ${hotel}" data-hotel="${hotel}">+</button>
        </td>
        <td class="py-2 pr-4 text-center">
          <input type="checkbox" data-hotel="${hotel}" class="merge-checkbox w-5 h-5" ${
      checked ? 'checked' : ''
    } ${disabled ? 'disabled' : ''} aria-label="Select ${hotel} for merge" />
        </td>
        <td class="py-2 text-right">${buySell}</td>
        <td class="py-2 text-right">${primary}</td>
        <td class="py-2 text-right">${secondary}</td>
        <td class="py-2 text-right">${tertiary}</td>
      </tr>
    `;
  }).join('');

  // Mode selector
  const modeSelector = `
    <div class="flex justify-end mt-8 mb-2">
      <div class="flex items-center gap-4">
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
    </div>
  `;

  root.innerHTML = `
    <table class="w-full text-left bg-white rounded shadow">
      <thead>
        <tr class="border-b">
          <th class="py-2 pr-4 w-32 whitespace-nowrap">Hotel</th>
          <th class="py-2 pr-4">Size</th>
          <th class="py-2 pr-4 text-center">Merge?</th>
          <th class="py-2 text-right">Buy/Sell</th>
          <th class="py-2 text-right">Primary</th>
          <th class="py-2 text-right">Secondary</th>
          <th class="py-2 text-right">Tertiary</th>
        </tr>
      </thead>
      <tbody>
        ${hotelRows}
      </tbody>
    </table>
    ${modeSelector}
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

  // Add event listeners for size inputs
  root.querySelectorAll('input[type="number"][data-hotel]').forEach((input) => {
    input.addEventListener('change', (e) => {
      const hotel = e.target.getAttribute('data-hotel');
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value < 2) value = 2;
      if (value > 99) value = 99;
      state.hotelSizes[hotel] = value;
      saveState(state);
      renderPlayerBoard();
    });
    input.addEventListener('blur', (e) => {
      const hotel = e.target.getAttribute('data-hotel');
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value < 2) value = 2;
      if (value > 99) value = 99;
      state.hotelSizes[hotel] = value;
      saveState(state);
      renderPlayerBoard();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    });
  });

  // Add event listeners for merge checkboxes
  root.querySelectorAll('.merge-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const hotel = e.target.getAttribute('data-hotel');
      if (e.target.checked) {
        if (state.mergeSelection.length < 2) {
          state.mergeSelection.push(hotel);
        }
      } else {
        state.mergeSelection = state.mergeSelection.filter((h) => h !== hotel);
      }
      saveState(state);
      renderPlayerBoard();
    });
  });
}

document.addEventListener('DOMContentLoaded', renderPlayerBoard);
