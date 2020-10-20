import React from 'react';

const tagsDisponiveis = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];

class TagSelect extends React.Component {
  render() {
    const { tag, handleChange, editor } = this.props;
    return (
      <div className="d-flex flex-row">
        <label className="label" htmlFor="tag">
          Tag:
        </label>
        <select
          name="tag"
          className="form-control tag-input"
          id="tag"
          value={tag}
          data-testid={`${editor ? 'e-' : ''}tag-input`}
          onChange={(e) => handleChange(e)}
        >
          {tagsDisponiveis.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default TagSelect;
