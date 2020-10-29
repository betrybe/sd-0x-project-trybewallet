export const saveEmail = (email) => ({
  type: 'LOGIN',
  email,
});

export const fetchCurrenciesSuccess = (currencies) => ({
  type: 'FETCH_CURRENCIES_SUCCESS',
  currencies,
});

export const addExpense = (expense) => ({
  type: 'ADD_EXPENSE',
  expense,
});

export const deleteExpense = (id) => ({
  type: 'DELETE_EXPENSE',
  id,
});

export const editExpense = (expense) => ({
  type: 'EDIT_EXPENSE',
  expense,
});

export const thunkCurrencies = () => async (dispatch) => {
  const res = await fetch('https://economia.awesomeapi.com.br/json/all');
  const currencies = await res.json();
  dispatch(fetchCurrenciesSuccess(currencies));
};

export const thunkAddExpense = (expense) => async (dispatch, getState) => {
  const { wallet: { expenses } } = getState();
  const FIRST_ID = 0;
  const nextId = expenses.length
    ? expenses[expenses.length - 1].id + 1 : FIRST_ID;
  const res = await fetch('https://economia.awesomeapi.com.br/json/all');
  const exchangeRates = await res.json();
  dispatch(addExpense({ ...expense, exchangeRates, id: nextId }));
};
