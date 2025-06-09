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

const DEFAULT_PLAYER_COUNT = 6;
const PLAYER_MIN = 1;
const PLAYER_MAX = 6;

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

function loadPlayersState() {
  let players = [];
  try {
    const stored = localStorage.getItem('acquire_players');
    if (stored) players = JSON.parse(stored);
  } catch (e) {}
  if (
    !Array.isArray(players) ||
    players.length < PLAYER_MIN ||
    players.length > PLAYER_MAX
  ) {
    players = Array.from({ length: DEFAULT_PLAYER_COUNT }, (_, i) => ({
      name: `Player ${i + 1}`,
      cash: 0,
      shares: Object.fromEntries(HOTEL_NAMES.map((h) => [h, 0])),
    }));
  }
  return players;
}

function savePlayersState(players) {
  try {
    localStorage.setItem('acquire_players', JSON.stringify(players));
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
    let isSafe = false;
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
        isSafe = !!data.isSafe;
      }
    }
    const hotelStyle = HOTEL_STYLES[hotel] || '';
    const checked = state.mergeSelection.includes(hotel);
    const isActive = size > 0;
    // Only allow at most one 'safe' hotel to be selected for merging
    const numSafeSelected = state.mergeSelection.filter((h) => {
      const s = state.hotelSizes[h];
      const d = getHotelChainData(state.mode, h, s);
      return d && d.isSafe;
    }).length;
    const wouldBeSecondSafe = !checked && isSafe && numSafeSelected >= 1;
    const disabled =
      !isActive ||
      (!checked && state.mergeSelection.length >= 2) ||
      wouldBeSecondSafe;
    // Reserve space for the safe icon (24px)
    const safeIcon = isSafe
      ? '<span class="inline-block align-middle ml-1 text-green-600" title="Safe"><svg xmlns="http://www.w3.org/2000/svg" class="inline w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm2-2a3 3 0 116 0v2H7V6z" clip-rule="evenodd"/></svg></span>'
      : '<span class="inline-block align-middle ml-1" style="width:24px;height:20px;"></span>';
    const rowHighlight = checked ? 'bg-yellow-100' : '';
    return `
      <tr class="border-b last:border-b-0 ${rowHighlight}">
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

  // Merge button row (centred under Size and Merge? columns)
  const mergeButtonActive = state.mergeSelection.length === 2;
  const mergeButton = `
    <button id="merge-btn" class="mx-auto px-4 py-2 rounded font-semibold shadow transition-colors block
      ${
        mergeButtonActive
          ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }"
      ${mergeButtonActive ? '' : 'disabled'}
      style="min-width: 90px;"
    >Merge</button>
  `;
  const mergeButtonRow = `
    <tr>
      <td></td>
      <td colspan="2" class="py-3 text-center">${mergeButton}</td>
      <td colspan="4"></td>
    </tr>
  `;

  // Mode selector row (as before), now with Reset button
  const modeSelector = `
    <div class="flex justify-end mt-8 mb-2">
      <div class="flex items-center gap-4">
        <button id="reset-btn" class="px-3 py-1 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-red-500 hover:text-white transition-colors">Reset</button>
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
        ${mergeButtonRow}
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

  // Reset button event
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Show confirmation modal
      const existing = document.getElementById('reset-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'reset-modal';
      modal.className =
        'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
      modal.innerHTML = `
        <div class="bg-white rounded shadow-lg p-6 max-w-xs w-auto mx-auto relative">
          <div class="mb-4 text-lg font-semibold">Clear current game state?</div>
          <div class="flex gap-4 justify-end mt-4">
            <button id="reset-no" class="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400">No</button>
            <button id="reset-yes" class="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700">Yes</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('reset-no').onclick = () => modal.remove();
      document.getElementById('reset-yes').onclick = () => {
        // Clear all hotel sizes and merge selection
        state.hotelSizes = Object.fromEntries(
          HOTEL_NAMES.map((name) => [name, 0])
        );
        state.mergeSelection = [];
        saveState(state);
        modal.remove();
        renderPlayerBoard();
      };
    });
  }

  // Merge button event
  const mergeBtn = document.getElementById('merge-btn');
  if (mergeBtn) {
    mergeBtn.addEventListener('click', () => {
      if (state.mergeSelection.length === 2) {
        renderMergeModal();
      }
    });
  }

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

// Modal rendering and logic
function renderMergeModal(acquireState) {
  // Remove any existing modal
  const existing = document.getElementById('merge-modal');
  if (existing) existing.remove();

  const [hotel1, hotel2] = state.mergeSelection;
  const size1 = state.hotelSizes[hotel1];
  const size2 = state.hotelSizes[hotel2];
  let acquired = null;
  let survivor = null;
  let needChoice = false;
  if (size1 === size2) {
    needChoice = true;
  } else if (size1 > size2) {
    survivor = hotel1;
    acquired = hotel2;
  } else {
    survivor = hotel2;
    acquired = hotel1;
  }

  // Always use chosen if present after tie-breaker
  if (needChoice && acquireState?.chosen) {
    acquired = acquireState.chosen;
    survivor = hotel1 === acquired ? hotel2 : hotel1;
  }

  // If not a tie, always set chosen to acquired for downstream steps
  if (!needChoice && !acquireState?.chosen) {
    acquireState = { ...acquireState, chosen: acquired };
  }

  // Step logic
  const step = acquireState?.step || 'choose';

  // Modal content
  let modalContent = '';
  if (needChoice && !acquireState?.chosen) {
    modalContent = `
      <div class="mb-4 text-lg font-semibold">Both hotel chains are the same size. The active player must choose which hotel chain is being <u>acquired</u>:</div>
      <form id="choose-acquired-form" class="flex flex-col gap-2 mb-4">
        <label class="flex items-center gap-2">
          <inpt diff
          ut type="radio" name="acquired" value="${hotel1}" required />
          <span class="${HOTEL_STYLES[hotel1]}">${hotel1}</span>
          will cease to exist - long live
          <span class="${HOTEL_STYLES[hotel2]}">${hotel2}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" name="acquired" value="${hotel2}" required />
          <span class="${HOTEL_STYLES[hotel2]}">${hotel2}</span>
          will cease to exist - long live
          <span class="${HOTEL_STYLES[hotel1]}">${hotel1}</span>
        </label>
        <button type="submit" class="mt-4 px-4 py-2 bg-teal-600 text-white rounded font-semibold hover:bg-teal-700">Continue</button>
      </form>
    `;
  } else if (!acquireState?.bonusesShown) {
    // Show stockholder bonus step
    if (needChoice) {
      acquired = acquireState.chosen;
      survivor = hotel1 === acquired ? hotel2 : hotel1;
    }
    const acquiredSize = state.hotelSizes[acquired];
    const acquiredData = getHotelChainData(state.mode, acquired, acquiredSize);
    const bonuses = acquiredData?.bonuses || {};
    modalContent = `
      <div class="mb-4 text-lg font-semibold"><span class="${
        HOTEL_STYLES[survivor]
      }">${survivor}</span> is acquiring <span class="${
      HOTEL_STYLES[acquired]
    }">${acquired}</span></div>
      <div class="mb-4">It's time to pay stockholder bonuses. <span class="${
        HOTEL_STYLES[acquired]
      }">${acquired}</span> will pay:</div>
      <table class="mb-6 text-base">
        <tbody>
          <tr><td class="font-bold pr-4">Primary:</td><td>$${
            bonuses.primary?.toLocaleString('en-GB') || '-'
          }</td></tr>
          <tr><td class="font-bold pr-4">Secondary:</td><td>$${
            bonuses.secondary?.toLocaleString('en-GB') || '-'
          }</td></tr>
          ${
            state.mode === 'tycoon' && bonuses.tertiary !== undefined
              ? `<tr><td class="font-bold pr-4">Tertiary:</td><td>$${bonuses.tertiary?.toLocaleString(
                  'en-GB'
                )}</td></tr>`
              : ''
          }
        </tbody>
      </table>
      <div class="flex gap-4 justify-end mt-4">
        <button id="abort-merge-modal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400">Abort</button>
        <button id="continue-bonuses-modal" class="px-4 py-2 bg-teal-600 text-white rounded font-semibold hover:bg-teal-700">Continue</button>
      </div>
    `;
  } else {
    // Get sell price for acquired hotel
    const acquiredSize = state.hotelSizes[acquired];
    const acquiredData = getHotelChainData(state.mode, acquired, acquiredSize);
    const sellPrice =
      acquiredData && acquiredData.buySellPrice
        ? acquiredData.buySellPrice
        : null;
    const sellPriceDisplay = sellPrice
      ? `$${sellPrice.toLocaleString('en-GB')}`
      : '-';
    // Quantity table (1-20), four rows: quantities 1-10, 11-20 and their values
    let quantityTable = '';
    if (sellPrice) {
      const qtyRow1 = Array.from(
        { length: 10 },
        (_, i) => `<td class='py-1 px-2'>${i + 1}</td>`
      ).join('');
      const valueRow1 = Array.from(
        { length: 10 },
        (_, i) =>
          `<td class='py-1 px-2'>$${((i + 1) * sellPrice).toLocaleString(
            'en-GB'
          )}</td>`
      ).join('');
      const qtyRow2 = Array.from(
        { length: 10 },
        (_, i) => `<td class='py-1 px-2'>${i + 11}</td>`
      ).join('');
      const valueRow2 = Array.from(
        { length: 10 },
        (_, i) =>
          `<td class='py-1 px-2'>$${((i + 11) * sellPrice).toLocaleString(
            'en-GB'
          )}</td>`
      ).join('');
      quantityTable = `
        <table class="mt-2 mb-4 text-xs w-full text-center border border-gray-200 rounded">
          <tbody>
            <tr class="bg-gray-100">${qtyRow1}</tr>
            <tr>${valueRow1}</tr>
            <tr class="bg-gray-100">${qtyRow2}</tr>
            <tr>${valueRow2}</tr>
          </tbody>
        </table>
      `;
    }
    modalContent = `
      <div class="mb-4 text-lg font-semibold"><span class="${HOTEL_STYLES[survivor]}">${survivor}</span> is acquiring <span class="${HOTEL_STYLES[acquired]}">${acquired}</span></div>
      <div class="mb-2">Stockholder options for <span class="${HOTEL_STYLES[acquired]}">${acquired}</span>:</div>
      <ul class="list-disc list-inside mb-4">
        <li><span class="font-bold">Keep</span>: Hold your stock in case a new ${acquired} chain is founded later.</li>
        <li><span class="font-bold">Sell</span>: Sell to the bank for <span class="font-bold">${sellPriceDisplay}</span> per share.</li>
        <li><span class="font-bold">Swap</span>: Trade 2 shares of ${acquired} for 1 share of ${survivor} (if available).
          <ul class="list-disc list-inside mb-2 ml-8"><li><span class="${HOTEL_STYLES[acquired]}">${acquired}</span> <span class="${HOTEL_STYLES[acquired]}">${acquired}</span> &rarr; <span class="${HOTEL_STYLES[survivor]}">${survivor}</span></li></ult com>
        </li>
      </ul>
      ${quantityTable}
      <div class="flex gap-4 justify-end mt-4">
        <button id="abort-merge-modal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400">Abort</button>
        <button id="complete-merge-modal" class="px-4 py-2 bg-teal-600 text-white rounded font-semibold hover:bg-teal-700">Complete Merge</button>
      </div>
    `;
  }

  const modal = document.createElement('div');
  modal.id = 'merge-modal';
  modal.className =
    'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40';
  modal.innerHTML = `
    <div class="bg-white rounded shadow-lg p-6 max-w-2xl w-full relative">
      ${modalContent}
      <button id="merge-modal-x" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Close logic
  function closeModal() {
    modal.remove();
  }
  document.getElementById('merge-modal-x').onclick = closeModal;
  const abortBtn = document.getElementById('abort-merge-modal');
  if (abortBtn) abortBtn.onclick = closeModal;
  // Complete Merge logic
  const completeBtn = document.getElementById('complete-merge-modal');
  if (completeBtn)
    completeBtn.onclick = () => {
      // Update hotel sizes
      const acquiredSize = state.hotelSizes[acquired];
      const survivorSize = state.hotelSizes[survivor];
      state.hotelSizes[survivor] =
        (parseInt(survivorSize, 10) || 0) +
        (parseInt(acquiredSize, 10) || 0) +
        1;
      state.hotelSizes[acquired] = 0;
      state.mergeSelection = [];
      saveState(state);
      closeModal();
      renderPlayerBoard();
    };

  // Choice form logic
  const form = document.getElementById('choose-acquired-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const chosen = form.elements['acquired'].value;
      renderMergeModal({ chosen, step: 'bonuses' });
    };
  }
  // Bonuses step logic
  const continueBonusesBtn = document.getElementById('continue-bonuses-modal');
  if (continueBonusesBtn) {
    continueBonusesBtn.onclick = () => {
      renderMergeModal({
        ...acquireState,
        bonusesShown: true,
        chosen: acquireState.chosen,
      });
    };
  }
}

function renderPlayersSection() {
  const root = document.getElementById('players-root');
  if (!root) return;
  let players = loadPlayersState();

  // Allow changing player count
  function setPlayerCount(count) {
    count = Math.max(PLAYER_MIN, Math.min(PLAYER_MAX, count));
    if (players.length < count) {
      for (let i = players.length; i < count; i++) {
        players.push({
          name: `Player ${i + 1}`,
          cash: 0,
          shares: Object.fromEntries(HOTEL_NAMES.map((h) => [h, 0])),
        });
      }
    } else if (players.length > count) {
      players = players.slice(0, count);
    }
    savePlayersState(players);
    renderPlayersSection();
  }

  // Calculate share values and totals
  function getShareValue(hotel, shares) {
    const size = state.hotelSizes[hotel] || 0;
    const data = getHotelChainData(state.mode, hotel, size);
    return data && data.buySellPrice ? shares * data.buySellPrice : 0;
  }
  function getPlayerTotal(player) {
    let total = player.cash;
    for (const hotel of HOTEL_NAMES) {
      total += getShareValue(hotel, player.shares[hotel]);
    }
    return total;
  }

  // Table header
  let headerCols = '<th class="py-2 pr-4 w-32">&nbsp;</th>';
  for (let i = 0; i < players.length; i++) {
    headerCols += `<th colspan="2" class="py-2 px-2 text-center">${players[i].name}</th>`;
  }

  // Hotel rows
  let hotelRows = '';
  for (const hotel of HOTEL_NAMES) {
    hotelRows += `<tr class="border-b last:border-b-0">
      <td class="py-2 pr-4 whitespace-nowrap font-semibold">${hotel}</td>`;
    for (let p = 0; p < players.length; p++) {
      const shares = players[p].shares[hotel] || 0;
      const value = getShareValue(hotel, shares);
      hotelRows += `<td class="py-2 px-2">
        <input type="number" min="0" max="99" step="1" value="${shares}" data-player="${p}" data-hotel="${hotel}" class="w-14 text-center bg-gray-100 rounded px-2 py-1 border border-gray-200 focus:border-blue-400 focus:outline-none shares-input" aria-label="${
        players[p].name
      } shares in ${hotel}" />
      </td>
      <td class="py-2 px-2 text-right">£${value.toLocaleString('en-GB')}</td>`;
    }
    hotelRows += '</tr>';
  }

  // Cash in hand row
  let cashRow = `<tr class="border-b bg-yellow-50 font-semibold">
    <td class="py-2 pr-4">Cash in Hand</td>`;
  for (let p = 0; p < players.length; p++) {
    cashRow += `<td colspan="2" class="py-2 px-2">
      <input type="number" min="0" max="999999" step="1" value="${players[p].cash}" data-player="${p}" class="w-24 text-center bg-gray-100 rounded px-2 py-1 border border-gray-200 focus:border-blue-400 focus:outline-none cash-input" aria-label="${players[p].name} cash in hand" />
    </td>`;
  }
  cashRow += '</tr>';

  // Total row
  let totalRow = `<tr class="bg-green-50 font-bold">
    <td class="py-2 pr-4">Total Worth</td>`;
  for (let p = 0; p < players.length; p++) {
    totalRow += `<td colspan="2" class="py-2 px-2 text-right">£${getPlayerTotal(
      players[p]
    ).toLocaleString('en-GB')}</td>`;
  }
  totalRow += '</tr>';

  // Player count selector
  let playerCountSelector = `<div class="mb-4 flex items-center gap-2">
    <label for="player-count" class="font-medium">Number of Players:</label>
    <select id="player-count" class="border rounded px-2 py-1">
      ${Array.from(
        { length: PLAYER_MAX },
        (_, i) =>
          `<option value="${i + 1}"${
            players.length === i + 1 ? ' selected' : ''
          }>${i + 1}</option>`
      ).join('')}
    </select>
  </div>`;

  root.innerHTML = `
    <div class="mb-4">
      <h2 class="text-2xl font-bold mb-2">Players</h2>
      <p class="text-gray-700 mb-2">Track shares, cash, and total worth for each player. All values update in real time.</p>
      ${playerCountSelector}
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left bg-white rounded shadow">
        <thead>
          <tr>${headerCols}</tr>
        </thead>
        <tbody>
          ${hotelRows}
          ${cashRow}
          ${totalRow}
        </tbody>
      </table>
    </div>
  `;

  // Event listeners for shares
  root.querySelectorAll('.shares-input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const p = parseInt(e.target.getAttribute('data-player'), 10);
      const hotel = e.target.getAttribute('data-hotel');
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value < 0) value = 0;
      if (value > 99) value = 99;
      players[p].shares[hotel] = value;
      savePlayersState(players);
      renderPlayersSection();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.target.blur();
    });
  });
  // Event listeners for cash
  root.querySelectorAll('.cash-input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const p = parseInt(e.target.getAttribute('data-player'), 10);
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value < 0) value = 0;
      if (value > 999999) value = 999999;
      players[p].cash = value;
      savePlayersState(players);
      renderPlayersSection();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.target.blur();
    });
  });
  // Player count selector
  root.querySelector('#player-count').addEventListener('change', (e) => {
    setPlayerCount(parseInt(e.target.value, 10));
  });
}

// Patch navigation to render Players section when shown
const origShowSection = window.showSection;
window.showSection = function (section) {
  origShowSection(section);
  if (section === 'players') {
    renderPlayersSection();
  }
};

document.addEventListener('DOMContentLoaded', renderPlayerBoard);
