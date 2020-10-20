import React from 'react';
import { connect } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { toggleEditor, setIdToEdit, setNewInformation } from '../actions';
import conversor from '../services/conversor';

const tableHead = [
  'Descrição',
  'Tag',
  'Método de Pagamento',
  'Valor',
  'Moeda',
  'Câmbio utilizado',
  'Valor Convertido',
  'Moeda de conversão',
  'Editar/Excluir',
];

class TabelaDeGastos extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    const { changeBar, idToEdit } = this.props;
    changeBar(true);
    idToEdit(id);
  }

  deleteExpense(id) {
    const { tableInfo, newInfo } = this.props;
    const newArray = tableInfo.filter((gasto) => gasto.id !== id);
    newInfo(newArray);
  }

  render() {
    const { tableInfo, currencyToExchange, editor } = this.props;
    if (!tableInfo) return <p>Adicione uma despesa</p>;
    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            {tableHead.map((head) => (
              <th key={head} data-testid={head} className="align-middle" scope="col">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableInfo.map((each, index) => (
            <tr className="table-line-size" key={`${index}-${Math.random * 999}`}>
              <td data-testid={`${index}-description`} className="align-middle">
                {each.description}
              </td>
              <td data-testid={`${index}-tag`} className="align-middle">
                {each.tag}
              </td>
              <td data-testid={`${index}-method`} className="align-middle">
                {each.method}
              </td>
              <td data-testid={`${index}-value`} className="align-middle">
                {Number(each.value).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: each.currency,
                })}
              </td>
              <td data-testid={`${index}-currency`} className="align-middle">
                {each.exchangeRates[each.currency].name}
              </td>
              <td data-testid={`${index}-exchange-rate`} className="align-middle">
                {/* {Number(each.cambio[each.moeda].ask).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: currencyToExchange,
                })} */}
                {conversor(1, each.exchangeRates, each.currency, currencyToExchange).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: currencyToExchange,
                  },
                )}
              </td>
              <td data-testid={`${index}-exchanged-value`} className="align-middle">
                {Number(
                  conversor(each.value, each.exchangeRates, each.currency, currencyToExchange),
                ).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: currencyToExchange,
                })}
              </td>
              <td className="align-middle" data-testid={`${index}-exc-currency-name`}>
                {currencyToExchange !== 'BRL'
                  ? each.exchangeRates[currencyToExchange].name
                  : 'Real Brasileiro'}
              </td>
              <td className="align-middle" data-testid={`${index}-edit-delete`}>
                <button
                  type="button"
                  className="btn btn-warning button"
                  data-testid={`${index}-edit-btn`}
                  onClick={() => this.handleClick(each.id)}
                >
                  <AiOutlineEdit />
                </button>
                <button
                  type="button"
                  className="btn btn-danger button"
                  data-testid={`${index}-delete-btn`}
                  disabled={editor}
                  onClick={() => this.deleteExpense(each.id)}
                >
                  <MdDeleteForever />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  currencyToExchange: state.currencyToExchange,
  tableInfo: state.expenses,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  changeBar: (e) => dispatch(toggleEditor(e)),
  idToEdit: (e) => dispatch(setIdToEdit(e)),
  newInfo: (e) => dispatch(setNewInformation(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TabelaDeGastos);
