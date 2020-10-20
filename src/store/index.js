import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancer(applyMiddleware(thunk)));

export default store;

/* {
  email: 'fdssidfnisjdnfsjd',
  cambioPadrão: 'dnfkjdkfndf',
  listaDeGastos : [
    {id:2,
    moedaUtilizada: 'BRL',
    cotacaoFeita: [],
    tag: 'Alimentação',
    metodoDePagamento: 'Dinheiro',
    descricao: 'blssbadifiafisabfsbfia'},
    {},
    {},
    {},
  ]
} */