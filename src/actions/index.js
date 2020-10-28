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

export const thunkCurrencies = () => async (dispatch) => {
  const res = await fetch('https://economia.awesomeapi.com.br/json/all');
  const currencies = await res.json();
  dispatch(fetchCurrenciesSuccess(currencies));
};
