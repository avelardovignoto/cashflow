const btnOpen = document.getElementById('btn-open');
const modal = document.getElementById('modal');
const btnClose = document.getElementById('btn-close');
const form = document.getElementById('form');
const extract = document.getElementById('extract');

btnOpen.addEventListener('click', () => {
  modal.style.display = 'flex';
});

btnClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const transaction = Object.create(null);
  transaction.desc = e.target.desc.value.trim();
  transaction.price = e.target.price.value.trim();
  transaction.type = e.target.type.value;

  if (transaction.type === 'select') {
    alert('Por favor, selecione um tipo de lançamento');
  } else {
    addTransaction(transaction);
    form.reset();
    modal.style.display = 'none';
    getTransactions();
  }
});

function addTransaction(transaction) {
  const url = 'http://localhost:8080/api/v1/transactions';

  fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(transaction)
  })
  .then(() => getTransactions());
}

const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const monthOption = { month: 'long' }
const dayOption = { day: 'numeric' }
const monthFormat = new Intl.DateTimeFormat('pt-BR', monthOption);
const dayFormat = new Intl.DateTimeFormat('pt-BR', dayOption);

function formatPrice(price) {
  return price.replace('.', '').replace(',', '.');
}

function formatSignal(type) {
  const spanSignal = document.createElement('span');

  if (type === 'entry') {
    spanSignal.textContent = '+';
    spanSignal.classList.add('green');
  } else {
    spanSignal.textContent = '-';
    spanSignal.classList.add('red');
  }

  return spanSignal;
}

async function getTransactions() {
  let transactions = [];

  const url = 'http://localhost:8080/api/v1/transactions';
  
  await fetch (url, {
    headers: { 'Accept': 'application/json' },
    method: 'GET'
  })
  .then(response => response.json())
  .then(response => transactions = response);

  extract.textContent = '';

  if (transactions.length === 0) {
    extract.textContent = '- Não há movimentações -';
  } else {
    transactions.map(transaction => {
      const li = document.createElement('li');
      const div = document.createElement('div');
  
      const spanDesc = document.createElement('span');
      spanDesc.textContent = transaction.desc;
  
      const spanDate = document.createElement('span');
      const i = document.createElement('i');
      i.textContent = `${monthFormat.format(new Date(transaction.createdAt.substring(0, 19)))}, ${dayFormat.format(new Date(transaction.createdAt.substring(0, 19)))}`;
  
      const divPrice = document.createElement('div');
      divPrice.classList.add('price');
  
      const spanSignal = formatSignal(transaction.type);
  
      const spanPrice = document.createElement('span');
      spanPrice.textContent = priceFormat.format(formatPrice(transaction.price));
  
      spanDate.append(i);
      div.append(spanDesc, spanDate);
      divPrice.append(spanSignal, spanPrice);
      li.append(div, divPrice);
      extract.append(li);
    });
  }

  updateTotals(transactions);
}

function getTotal(type, transactions) {
  return transactions.filter(transaction => transaction.type === type)
  .map(transaction => Number(formatPrice(transaction.price)))
  .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function renderTotal(id, total) {
  const entries = document.getElementById(id);
  entries.textContent = '';
  entries.textContent = priceFormat.format(total);
}

function updateTotals(transactions) {
  const entriesTotal = getTotal('entry', transactions);
  const spendingsTotal = getTotal('spent', transactions);
  renderTotal('entries', entriesTotal);
  renderTotal('spendings', spendingsTotal);

  const balance = entriesTotal - spendingsTotal;

  if (Math.round(balance) === 0 || Math.round(balance) === -0) {
    document.getElementById('balance').textContent = 'R$ 0,00';
  } else {
    renderTotal('balance', balance);
  }
}

getTransactions();