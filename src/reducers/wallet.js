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
      expenses: [...state.expenses, action.expense],
    };
  case 'DELETE_EXPENSE':
    return {
      ...state,
      expenses: state.expenses.filter((e) => e.id !== action.id),
    };
  case 'EDIT_EXPENSE':
    return {
      ...state,
      expenses: state.expenses
        .map((e) => (
          e.id === action.expense.id ? { ...e, ...action.expense } : e
        )),
    };
  default:
    return state;
  }
}
