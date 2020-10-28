const initialState = {
  currencies: [],
  expenses: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_CURRENCIES_SUCCESS':
    return {
      ...state,
      currencies: Object
        .keys(action.currencies)
        .filter((currency) => currency !== 'USDT'),
    };
  case 'ADD_EXPENSE':
    return {
      ...state,
      expenses: [...state.expenses, action.expenses],
    };
  default:
    return state;
  }
}
