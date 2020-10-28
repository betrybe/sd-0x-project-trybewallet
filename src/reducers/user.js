const initialState = {
  email: '',
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
  case 'LOGIN':
    return { ...state, email: action.email };
  default:
    return state;
  }
}
