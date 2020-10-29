import React from 'react';

class DescriptionInput extends React.Component {
  render() {
    const { description, handleChange, editor } = this.props;
    return (
      <div className="d-flex flex-row">
        <label className="label" htmlFor="description">
          Descrição:
        </label>
        <input
          type="text"
          name="description"
          id="description"
          data-testid={`${editor ? 'e-' : ''}description-input`}
          className="form-control descricao-input"
          value={description}
          onChange={(e) => handleChange(e)}
        />
      </div>
    );
  }
}

export default DescriptionInput;
