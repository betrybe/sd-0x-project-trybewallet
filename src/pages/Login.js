import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveEmail } from '../actions';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: ''
    }
  }

  handleLogin(email) {
    const { history, saveEmail } = this.props;
    saveEmail(email);
    history.push('/carteira')
  }

  render() {
    const { email } = this.state;
    return(
    <div>
      <label>
        Email:
        <input type="email" data-testid="email-input" onChange={(e) => this.setState({ email: e.target.value })} />
      </label>
      <label>
        Password:
        <input type="password" data-testid="password-input" />
      </label>
      <button type="button" onClick={() => this.handleLogin({email})}>Entrar</button>
    </div>
    ); 
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveEmail: (data) => {
    console.log(data)
    dispatch(saveEmail(data))
  }

})

export default connect(null, mapDispatchToProps)(Login);
