// Esse reducer será responsável por tratar as informações da pessoa usuária
const initialState = {
  email: ''
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_USER':
    return {...state, ...action.payload}
    default:
      return state;
  }
}

export default userReducer;