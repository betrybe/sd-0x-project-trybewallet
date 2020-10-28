import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { saveEmail } from '../actions';

import './Login.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      validForm: false,
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { email, password } = this.state;
    if (prevState.email !== email || prevState.password !== password) {
      this.validateForm();
    }
  }

  validateForm() {
    const { email, password } = this.state;

    const MIN_PASSWORD_LENGTH = 6;

    this.setState({
      validForm: /[^@]+@[^.]+\..+/g.test(email) && password.length >= MIN_PASSWORD_LENGTH,
    });
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
    });
  }

  handleSubmit(event) {
    const { email } = this.state;
    const { login, history } = this.props;

    event.preventDefault();
    login(email);
    history.push('/carteira');
  }

  render() {
    const { validForm } = this.state;

    return (
      <section className="login-page">
        <form onSubmit={ this.handleSubmit }>
          <label htmlFor="email-input">
            Insira seu email
            <input
              type="email"
              name="email"
              id="email-input"
              data-testid="email-input"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="password-input">
            Insira sua senha
            <input
              type="password"
              name="password"
              id="password-input"
              data-testid="password-input"
              onChange={ this.handleChange }
            />
          </label>
          <button type="submit" disabled={ !validForm }>Entrar</button>
        </form>
      </section>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  login: (email) => dispatch(saveEmail(email)),
});

export default connect(null, mapDispatchToProps)(Login);
