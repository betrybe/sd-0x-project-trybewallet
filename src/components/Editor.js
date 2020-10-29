import React from 'react';
import { connect } from 'react-redux';
import ValueInput from './ValueInput';
import DescriptionInput from './DescriptionInput';
import TagSelect from './TagSelect';
import MetPagSelect from './MetPagSelect';
import MoedaSelect from './MoedaSelect';
import { setNewInformation, toggleEditor } from '../actions';

class Editor extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.startingFunction();
  }

  startingFunction() {
    const { toEdit, tableInfo } = this.props;
    const gastoToEdit = tableInfo.find((gasto) => gasto.id === toEdit);
    const { value, description, currency, method, tag, exchangeRates, id } = gastoToEdit;
    this.setState({
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates,
      id,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  async handleClick() {
    const { tableInfo, toEdit, newInfo, changeBar } = this.props;
    const newInformation = tableInfo.filter((gasto) => gasto.id !== toEdit);
    newInformation.push(this.state);
    newInformation.sort((a, b) => a.id - b.id);
    newInfo(newInformation);
    changeBar(false);
  }

  render() {
    const { value, description, currency, method, tag } = this.state;
    return (
      <form className="form d-flex flex-column align-items-center edit-bar">
        <div className="d-flex">
          <div className="form-group d-flex flex-row align-items-center">
            <ValueInput value={value} handleChange={this.handleChange} editor />
            <MoedaSelect currency={currency} handleChange={this.handleChange} editor />
            <MetPagSelect method={method} handleChange={this.handleChange} editor />
            <TagSelect tag={tag} handleChange={this.handleChange} editor />
            <DescriptionInput description={description} handleChange={this.handleChange} editor />
            <button
              type="button"
              className="btn btn-dark botao-add"
              data-testid="edit-btn"
              onClick={(e) => this.handleClick(e)}
            >
              Editar Gasto
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  tableInfo: state.expenses,
  toEdit: state.idToEdit,
  moedas: state.currencies,
  currencyToExchange: state.currencyToExchange,
});

const mapDispatchToProps = (dispatch) => ({
  newInfo: (e) => dispatch(setNewInformation(e)),
  changeBar: (e) => dispatch(toggleEditor(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
