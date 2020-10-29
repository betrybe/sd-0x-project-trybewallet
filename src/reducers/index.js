import {
  GET_MOEDAS,
  REQUEST_MOEDAS,
  SET_EMAIL,
  SET_GASTO,
  SET_ID,
  SET_NEW_INFO,
  TOGGLE_EDITOR,
  SET_MOEDA_TOTAL,
} from '../actions';

const userLSEmail = localStorage.getItem('email');
const userLSExpenses = JSON.parse(localStorage.getItem('expenses'));

const INITIAL_STATE = {
  isFetching: false,
  editor: false,
  idToEdit: 0,
  email: userLSEmail ? userLSEmail : '',
  currencyToExchange: 'BRL',
  currencies: [],
  expenses: userLSExpenses ? userLSExpenses : [],
};

function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.email };
    case REQUEST_MOEDAS:
      return { ...state, isFetching: true };
    case GET_MOEDAS:
      return { ...state, currencies: Object.keys(action.moedas), isFetching: false };
    case SET_GASTO:
      return { ...state, expenses: [...state.expenses, action.gasto] };
    case TOGGLE_EDITOR:
      return { ...state, editor: action.booleano };
    case SET_ID:
      return { ...state, idToEdit: action.id };
    case SET_NEW_INFO:
      return { ...state, expenses: action.arr };
    case SET_MOEDA_TOTAL:
      return { ...state, currencyToExchange: action.moeda };
    default:
      return state;
  }
}

export default reducer;
