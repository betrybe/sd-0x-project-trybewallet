import React from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../actions';

class Wallet extends React.Component {

  componentDidMount() {
    this.props.fetch()
  }

  render() {
    const { email } = this.props.email;
    let currencies = Object.keys(this.props.wallet.currencies)
    currencies = currencies.filter((item) => item !== 'USDT')

    return (
      <div>
        <header>
          <span data-testid="email-field">{email}</span>
          <span data-testid="total-field">Despesa total: 0</span>
          <span data-testid="header-currency-field">BRL</span>
        </header>
        <div>
          <div data-testid="value-input">Valor da Despesa: </div>
          <textarea data-testid="description-input"></textarea>
          <select data-testid="currency-input">
            {currencies.map((i, index) => (
              <option data-testid={i} value={i} key={index + 1}>{i}</option>
            ))}
          </select>
          <select data-testid="method-input">
            <option value="dinheiro">Dinheiro</option>
            <option value="cartaoCredito">Cartão de crédito</option>
            <option value="cartaoDebito">Cartão de débito</option>
          </select>
          <select data-testid="tag-input">
            <option value="alimentacao">Alimentação</option>
            <option value="lazer">Lazer</option>
            <option value="trabalho">Trabalho</option>
            <option value="transporte">Transporte</option>
            <option value="saude">Saúde</option>
          </select>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user,
  wallet: state.wallet
})

const mapDispatchToProps = (dispatch) => ({
  fetch: () => dispatch(fetchCurrencies())
})


export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
