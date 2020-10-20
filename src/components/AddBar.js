import React from 'react';
import { connect } from 'react-redux';
import { fetchMoedas, setNewExpense } from '../actions';
import getMoedas from '../services/fetchMoeda';
import ValueInput from './ValueInput';
import DescriptionInput from './DescriptionInput';
import TagSelect from './TagSelect';
import MetPagSelect from './MetPagSelect';
import MoedaSelect from './MoedaSelect';
import 'bootstrap/dist/css/bootstrap.min.css';

class AddBar extends React.Component {
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
  }

  componentDidMount() {
    this.props.fetchData();
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  async handleClick(e) {
    const { setGasto, tableInfo } = this.props;
    let id = 0;
    if (tableInfo.length > 0) id = tableInfo[tableInfo.length - 1].id + 1;
    e.preventDefault();
    await getMoedas()
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          id,
          exchangeRates: data,
        });
      })
      .then(() => setGasto(this.state));

    localStorage.setItem(`expenses`, JSON.stringify([...tableInfo, this.state]));
    this.setState({
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    });
  }

  render() {
    const { value, description, currency, method, tag } = this.state;
    const { isFetching } = this.props;

    if (isFetching) return <h1>Loading</h1>;
    return (
      <form className="form d-flex flex-column align-items-center search-bar">
        <div className="d-flex">
          <div className="form-group d-flex flex-row align-items-center">
            <ValueInput value={value} handleChange={this.handleChange} />
            <MoedaSelect currency={currency} handleChange={this.handleChange} />
            <MetPagSelect method={method} handleChange={this.handleChange} />
            <TagSelect tag={tag} handleChange={this.handleChange} />
            <DescriptionInput description={description} handleChange={this.handleChange} />
            <button
              type="button"
              className="btn btn-primary botao-add"
              onClick={(e) => this.handleClick(e)}
            >
              Adicionar despesa
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => dispatch(fetchMoedas()),
  setGasto: (gasto) => dispatch(setNewExpense(gasto)),
});

const mapStateToProps = (state) => ({
  moedas: state.currencies,
  isFetching: state.isFetching,
  currencyToExchange: state.currencyToExchange,
  tableInfo: state.expenses,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBar);
