import React from 'react';
import { connect } from 'react-redux';
import { setEmail } from '../actions';
import loginLogo from '../assets/images/trybeWallet.png';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      passwordCheck: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({ email: e.target.value });
  }

  handleClick() {
    const { email } = this.state;
    const { history, setUser } = this.props;
    setUser(email);
    localStorage.setItem('email', email);
    history.push('/carteira');
  }

  checkButtonCondition() {
    const { email, passwordCheck } = this.state;
    const regex = /\S+@\S+\.\S+/;
    if (regex.test(email) === true && passwordCheck >= 6) return false;
    return true;
  }

  render() {
    const { email } = this.state;
    return (
      <div className="login-container">
        <img src={loginLogo} className="login-logo" alt={'login-trybe'} />
        <form className="form-group login-form d-flex flex-column justify-content-center">
          <div>
            <input
              type="text"
              placeholder="Email"
              id="email"
              className="form-control text-center"
              data-testid="email-input"
              onChange={(e) => this.handleChange(e)}
              value={email}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              className="form-control text-center"
              id="password"
              data-testid="password-input"
              onChange={(e) => this.setState({ passwordCheck: e.target.value.length })}
            />
          </div>
          <button
            className="btn btn-success login-botao"
            onClick={this.handleClick}
            disabled={this.checkButtonCondition()}
            data-testid="login-button"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (e) => dispatch(setEmail(e)),
});

export default connect(null, mapDispatchToProps)(Login);

//Levamos em torno de uma hora para desenvolver o Login
