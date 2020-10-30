import { response } from '../tests/mockData';

export const saveEmail = (payload) => ({
  type: 'LOGIN',
  payload
})

export const successCurrencies = (payload) => ({
  type: 'SUCCESS_CURRENCIES',
  payload
})

export const errorCurrencies = (payload) => ({
  type: 'ERROR_CURRENCIES',
  payload
})

// "https://economia.awesomeapi.com.br/json/all"
export const fetchCurrencies = () => {
  return (dispatch) => {
    return Promise.resolve(response)
    .then(
      (response) => dispatch(successCurrencies(response)),
      (error) => dispatch(errorCurrencies(error))
      )
    
  }   
}
