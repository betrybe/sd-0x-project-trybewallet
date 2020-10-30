// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas

import { FETCH_CURRENCIES, SUCCESS_CURRENCIES, ERROR_CURRENCIES, SET_EXPENSES } from '../types';

const initialState = {
  currencies: [],
  expenses: []
}

const walletReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_CURRENCIES:
    return {
      ...state,
      currencies: action.payload
    }
    case SUCCESS_CURRENCIES:
      return {
        ...state,
        currencies: action.payload
      }
    case ERROR_CURRENCIES:
      return state; //Precisa popular um cara de erro
    case SET_EXPENSES:
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      }
    default:
      return state;
  }
}

export default walletReducer;