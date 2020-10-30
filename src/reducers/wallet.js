// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas

const initialState = {
  currencies: [],
  expenses: []
}

const walletReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'FETCH_CURRENCIES':
    return {
      ...state,
      currencies: action.payload
    }
    case 'SUCCESS_CURRENCIES':
      return {
        ...state,
        currencies: [...state.currencies, action.payload]
      }
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      }
    default:
      return state;
  }
}

export default walletReducer;