import React from 'react';

class ValueInput extends React.Component {
  render() {
    const { value, handleChange, editor } = this.props;
    return (
      <div className="d-flex flex-row">
        <label className="label" htmlFor="Valor">
          Valor:
        </label>
        <input
          type="number"
          className="form-control input input-valor"
          data-testid={`${editor? "e-":""}value-input`}
          min={0}
          id="Valor"
          name="value"
          value={value}
          onChange={(e) => handleChange(e)}
        />
      </div>
    );
  }
}

export default ValueInput;
