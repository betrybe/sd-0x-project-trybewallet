import React from 'react';

const metodosDisponiveis = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];

class MetPagSelect extends React.Component {
  render() {
    const { method, handleChange, editor } = this.props;
    return (
      <div className="d-flex flex-row">
        <label className="label" htmlFor="mp">
          Método de pagamento:
        </label>
        <select
          name="method"
          id="mp"
          className="form-control metodo-input"
          value={method}
          data-testid={`${editor ? 'e-' : ''}method-input`}
          onChange={(e) => handleChange(e)}
        >
          {metodosDisponiveis.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default MetPagSelect;
