import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  thunkCurrencies,
  thunkAddExpense,
  deleteExpense as deleteAction,
  editExpense as editExpenseAction,
} from '../actions/index';

class Wallet extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      description: '',
      currency: '',
      method: '',
      tag: '',
      editMode: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { fetchCurrencies } = this.props;
    fetchCurrencies();
  }

  handleSubmit(event) {
    const { submitExpense, editExpense } = this.props;
    const { editMode, idToEdit: id, ...expense } = this.state;
    event.preventDefault();

    return editMode ? editExpense({ ...expense, id }) : submitExpense(expense);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
    });
  }

  handleDelete(id) {
    const { deleteExpense } = this.props;

    deleteExpense(id);
  }

  handleEdit(id) {
    const { editMode } = this.state;
    this.setState({ idToEdit: id, editMode: !editMode });
  }

  render() {
    const { email, currencies, expenses } = this.props;
    const { editMode, ...expense } = this.state;
    const totalValue = expenses.length ? Math.round(
      expenses.reduce((acc, curr) => acc + curr.value * curr.exchangeRates[curr.currency].ask, 0) * 100,
    ) / 100 : 0;
    return (
      <main>
        <header>
          <span data-testid="email-field">{ email }</span>
          <span data-testid="total-field">{ totalValue }</span>
          <span data-testid="header-currency-field">BRL</span>
        </header>
        <form onSubmit={ this.handleSubmit }>
          <label htmlFor="value">
            Valor:
            <input
              type="text"
              name="value"
              id="value"
              value={ expense.value }
              data-testid="value-input"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="description">
            Descrição:
            <input
              type="text"
              name="description"
              id="description"
              value={ expense.description }
              data-testid="description-input"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="currency">
            Moeda:
            <select
              name="currency"
              id="currency"
              value={ expense.currency }
              data-testid="currency-input"
              onChange={ this.handleChange }
            >
              {
                currencies && currencies.map(
                  (currency) => (
                    <option
                      data-testid={ currency }
                      key={ currency }
                      value={ currency }
                    >
                      { currency }
                    </option>
                  ),
                )
              }
            </select>
          </label>
          <label htmlFor="method">
            Método:
            <select
              name="method"
              id="method"
              value={ expense.method }
              data-testid="method-input"
              onChange={ this.handleChange }
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="tag">
            Tag:
            <select
              name="tag"
              id="tag"
              value={ expense.tag }
              data-testid="tag-input"
              onChange={ this.handleChange }
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </label>
          <button type="submit">
            {editMode ? 'Editar despesa' : 'Adicionar despesa'}
          </button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {
              expenses.map((e) => (
                <tr key={ e.id }>
                  <td>{e.description}</td>
                  <td>{e.tag}</td>
                  <td>{e.method}</td>
                  <td>{e.value}</td>
                  <td>{e.exchangeRates[e.currency].name}</td>
                  <td>
                    {(Math.round(e.exchangeRates[e.currency].ask * 100) / 100).toFixed(2)}
                  </td>
                  <td>
                    {
                      (Number(e.exchangeRates[e.currency].ask)
                        * Number(e.value)).toFixed(2)
                    }
                  </td>
                  <td>Real</td>
                  <td>
                    <button
                      type="button"
                      onClick={ () => this.handleDelete(e.id) }
                      data-testid="delete-btn"
                    >
                      delete
                    </button>
                    <button
                      type="button"
                      onClick={ () => this.handleEdit(e.id) }
                      data-testid="edit-btn"
                    >
                      edit
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </main>
    );
  }
}

Wallet.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  email: PropTypes.string.isRequired,
  fetchCurrencies: PropTypes.func.isRequired,
  submitExpense: PropTypes.func.isRequired,
  deleteExpense: PropTypes.func.isRequired,
  editExpense: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCurrencies: () => dispatch(thunkCurrencies()),
  submitExpense: (expense) => dispatch(thunkAddExpense(expense)),
  editExpense: (expense) => dispatch(editExpenseAction(expense)),
  deleteExpense: (id) => dispatch(deleteAction(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
