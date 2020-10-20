import addMoedas from '../services/fetchMoeda';

export const SET_EMAIL = 'SET_EMAIL';
export const REQUEST_MOEDAS = 'REQUEST_MOEDAS';
export const GET_MOEDAS = 'GET_MOEDAS';
export const SET_GASTO = 'SET_GASTO';
export const SET_TOTAL = 'SET_TOTAL';
export const TOGGLE_EDITOR = 'TOGGLE_EDITOR';
export const SET_ID = 'SET_ID';
export const SET_NEW_INFO = 'SET_NEW_INFO';
export const SET_MOEDA_TOTAL = 'SET_MOEDA_TOTAL';

export const setEmail = (email) => ({
  type: SET_EMAIL,
  email,
});

const requestMoedas = () => ({
  type: REQUEST_MOEDAS,
});

const getMoedas = (moedas) => ({
  type: GET_MOEDAS,
  moedas,
});

export const fetchMoedas = () => {
  return (dispatch) => {
    dispatch(requestMoedas());
    return addMoedas()
      .then((response) => response.json())
      .then((data) => dispatch(getMoedas(data)));
  };
};

export const setNewExpense = (gasto) => ({
  type: SET_GASTO,
  gasto,
});

export const setNewTotal = (valor) => ({
  type: SET_TOTAL,
  valor,
});

export const toggleEditor = (booleano) => ({
  type: TOGGLE_EDITOR,
  booleano,
});

export const setIdToEdit = (id) => ({
  type: SET_ID,
  id,
});

export const setNewInformation = (arr) => ({
  type: SET_NEW_INFO,
  arr,
});

export const setNewMoedaTotal = (moeda) => ({
  type: SET_MOEDA_TOTAL,
  moeda,
});
