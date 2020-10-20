import React from 'react';
import { connect } from 'react-redux';

class MoedaSelect extends React.Component {
  render() {
    const { currency, moedas, handleChange, header, editor } = this.props;
    return (
      <div className={`d-flex flex-row ${header ? 'header-text-container' : ''}`}>
        <label className="label" htmlFor="Moeda">
          Moeda:
        </label>
        <select
          name="currency"
          id="Moeda"
          value={currency}
          className="form-control input-moeda"
          data-testid={header ? 'header-currency-input' : `${editor ? 'e-' : ''}currency-input`}
          onChange={(e) => handleChange(e)}
        >
          {header && <option value="BRL">BRL</option>}
          {moedas
            .filter((each) => each !== 'USDT')
            .map((moeda) => (
              <option key={moeda} data-testid={moeda} value={moeda}>
                {moeda}
              </option>
            ))}
        </select>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  moedas: state.currencies,
});

export default connect(mapStateToProps)(MoedaSelect);
