export const saveEmail = (payload) => ({
  type: 'LOGIN',
  payload
})

export const fetchCurrencies = (payload) => ({
  type: 'FETCH_CURRENCIES',
  payload,
})

export const successCurrencies = (payload) => ({
  type: 'SUCCESS_CURRENCIES',
  payload
})

export const errorCurrencies = (payload) => ({
  type: 'ERROR_CURRENCIES',
  payload
})


export const requestCurrency = () => {
  return (dispatch) => {
    return fetch("https://economia.awesomeapi.com.br/json/all")
    .then((response) => response.json()
    .then(
      (response) => dispatch(fetchCurrencies(response)),
      (error) => errorCurrencies(error)
      ).then((response) => console.log(response.payload))
    )
  }   
}
