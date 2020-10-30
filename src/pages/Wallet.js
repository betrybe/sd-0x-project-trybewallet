import React from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies, setExpenses } from '../actions';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      expenseValue: '',
      description: '',
      coin: '',
      payment: '',
      reason: ''
    }
  }

  componentDidMount() {
    this.props.fetch()
  }

  render() {
    const { email } = this.props.email;
    const { setExpenses } = this.props;
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
          <label>
            <input
              data-testid="value-input"
              type="number"
              onChange={(e) => this.setState({
                expenseValue: e.target.value
              })}
            />
          </label>
          <textarea
            data-testid="description-input"
            onChange={(e) => this.setState({
              description: e.target.value
            })}
          />
          <select
            name="currency"
            data-testid="currency-input"
            onChange={(e) => this.setState({
              coin: e.target.value
            })}
          >
            {currencies.map((i, index) => (
              <option data-testid={i} value={i} key={index + 1}>{i}</option>
            ))}
          </select>
              {this.state.coin}
          <select
            data-testid="method-input"
            onChange={(e) => this.setState({
              payment: e.target.value
            })}
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="cartaoCredito">Cartão de crédito</option>
            <option value="cartaoDebito">Cartão de débito</option>
          </select>

          <select
            data-testid="tag-input"
            onChange={(e) => this.setState({
              reason: e.target.value
            })}
          >
            <option value="alimentacao">Alimentação</option>
            <option value="lazer">Lazer</option>
            <option value="trabalho">Trabalho</option>
            <option value="transporte">Transporte</option>
            <option value="saude">Saúde</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => setExpenses(this.state)}
        >
          Enviar
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user,
  wallet: state.wallet
})

const mapDispatchToProps = (dispatch) => ({
  fetch: () => dispatch(fetchCurrencies()),
  setExpenses: (data) => dispatch(setExpenses(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
