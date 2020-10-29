import React from 'react';
import { connect } from 'react-redux';
import { setNewMoedaTotal } from '../actions';
import logo from '../assets/images/trybe-logo.png';
import MoedaSelect from './MoedaSelect';
import conversor from '../services/conversor';

class Header extends React.Component {
  render() {
    const { email, tableInfo, moeda, newMoedaTotal } = this.props;
    return (
      <header className="header d-flex justify-content-end align-items-center">
        <img className="logo" src={logo} width={140} alt="logo-trybe" />
        <div className="header-text-container header-detail">
          <p data-testid="email-field">{`Email: ${email}`}</p>
        </div>
        <div className="header-text-container despesa-total-container header-detail">
          <p data-testid="total-field">{`Despesa Total: ${
            tableInfo
              ? tableInfo
                  .reduce(
                    (total, valor) =>
                      total +
                      Number(conversor(valor.value, valor.exchangeRates, valor.currency, moeda)),
                    0,
                  )
                  .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: moeda,
                  })
              : 0
          }`}</p>
        </div>
        <MoedaSelect
          moeda={moeda}
          handleChange={(e) => newMoedaTotal(e.target.value)}
          header
          className="header-text-container"
        />
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.email,
  tableInfo: state.expenses,
  moeda: state.currencyToExchange,
});

const mapDispatchToProps = (dispatch) => ({
  newMoedaTotal: (e) => dispatch(setNewMoedaTotal(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
