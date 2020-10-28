import React from 'react';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import testData from './testData';
import reducer from './reducers';
import App from './App';
import Carteira from './pages/Carteira';

const apiResponse = Promise.resolve({
  json: () => Promise.resolve(testData),
  ok: true,
});

const mockedExchange = jest.spyOn(global, 'fetch').mockImplementation(() => apiResponse);

afterEach(() => jest.clearAllMocks());

const getStore = (initialState) => {
  if (!initialState) return createStore(reducer, applyMiddleware(thunk));
  return createStore(reducer, initialState, applyMiddleware(thunk));
};

const renderWithRouter = (component, routeConfigs = {}, initialState) => {
  const route = routeConfigs.route || '/';
  const store = getStore(initialState);
  const history = routeConfigs.history || createMemoryHistory({ initialEntries: [route] });

  return {
    ...render(
      <Provider store={store}>
        <Router history={history}>{component}</Router>,
      </Provider>,
    ),
    history,
    store,
  };
};

describe('1 - [PÁGINA DE LOGIN] Crie uma página inicial de login com os seguintes campos e características:', () => {
  test("A rota para esta página deve ser '/'", () => {
    const { history } = renderWithRouter(<App />);
    expect(history.location.pathname).toBe('/');
  });

  test('Crie um local para que o usuário insira seu email e senha', () => {
    renderWithRouter(<App />, '/');
    const email = screen.getByTestId('email-input');
    const senha = screen.getByTestId('password-input');

    expect(email).toBeInTheDocument();
    expect(senha).toBeInTheDocument();
  });

  test("Crie um botão com o texto 'Entrar'", () => {
    renderWithRouter(<App />, '/');

    const button = screen.getByText(/Entrar/i);
    expect(button).toBeInTheDocument();
  });

  test('Realize as seguintes verificações nos campos de email, senha e botão:', () => {
    renderWithRouter(<App />);

    const button = screen.getByText(/Entrar/i);
    expect(button).toBeDisabled();

    const email = screen.getByTestId('email-input');
    const senha = screen.getByTestId('password-input');

    userEvent.type(email, 'email');
    userEvent.type(senha, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'email@com@');
    userEvent.type(senha, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'emailcom@');
    userEvent.type(senha, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.com');
    userEvent.type(senha, '23456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.');
    userEvent.type(senha, '123456');
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.com');
    userEvent.type(senha, '123456');
    expect(button).toBeEnabled();
  });

  test('Salve o email no estado da aplicação, com a chave email, assim que o usuário logar.', () => {
    const { store } = renderWithRouter(<App />);
    const email = screen.getByTestId('email-input');
    const senha = screen.getByTestId('password-input');
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, 'alguem@email.com');
    userEvent.type(senha, '123456');
    fireEvent.click(button);

    expect(store.getState().email).toBe('alguem@email.com');
  });

  test("A rota deve ser mudada para '/carteira' após o clique no botão.", () => {
    const { history } = renderWithRouter(<App />);
    const email = screen.getByTestId('email-input');
    const senha = screen.getByTestId('password-input');
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, 'alguem@email.com');
    userEvent.type(senha, '123456');
    fireEvent.click(button);

    expect(history.location.pathname).toBe('/carteira');
  });
});

describe('2 - [PAGINA DA CARTEIRA] Crie um header para a página com as seguintes informações:', () => {
  const initial = {
    isFetching: false,
    editor: false,
    idToEdit: 0,
    email: 'alguem@email.com',
    currencyToExchange: 'BRL',
    currencies: [
      'USD',
      'USDT',
      'CAD',
      'EUR',
      'GBP',
      'ARS',
      'BTC',
      'LTC',
      'JPY',
      'CHF',
      'AUD',
      'CNY',
      'ILS',
      'ETH',
      'XRP',
    ],
    expenses: [],
  };
  test('Crie um campo com o email do usuário.', () => {
    const { store } = renderWithRouter(<Carteira />, '/carteira', initial);
    const emailField = screen.getByTestId('email-field');

    expect(emailField).toContainHTML(store.getState().email);
  });

  test('Crie um campo com a despesa total gerada pela lista de gastos.', () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const totalField = screen.getByTestId('total-field');

    expect(totalField).toContainHTML(0);
  });

  test("Crie um campo que mostre que qual câmbio está sendo utilizado, que será neste caso 'BRL'", () => {
    renderWithRouter(<Carteira />, '/carteira');
    const exchangeField = screen.getByTestId('header-currency-input');

    expect(exchangeField).toBeInTheDocument();
    expect(exchangeField).toContainHTML('BRL');
  });
});

describe('3 - [PAGINA DA CARTEIRA] Desenvolva um formulário para adicionar uma despesa', () => {
  test('Crie um campo para adicionar valor', async () => {
    renderWithRouter(<Carteira />, '/carteira');
    const valueInput = await screen.findByTestId('value-input');

    expect(valueInput).toBeInTheDocument();
  });

  test('Crie um campo para adicionar descrição', async () => {
    renderWithRouter(<Carteira />, '/carteira');
    const descriptionInput = await screen.findByTestId('description-input');

    expect(descriptionInput).toBeInTheDocument();
  });

  test('Crie um campo para selecionar em qual moeda será registrada a despesa', async () => {
    renderWithRouter(<Carteira />, '/carteira');
    const currencyInput = await screen.findByTestId('currency-input');
    const USD = screen.getAllByTestId('USD')[1];
    const CAD = screen.getAllByTestId('CAD')[1];
    const EUR = screen.getAllByTestId('EUR')[1];
    const GBP = screen.getAllByTestId('GBP')[1];
    const ARS = screen.getAllByTestId('ARS')[1];
    const BTC = screen.getAllByTestId('BTC')[1];
    const LTC = screen.getAllByTestId('LTC')[1];
    const JPY = screen.getAllByTestId('JPY')[1];
    const CHF = screen.getAllByTestId('CHF')[1];
    const AUD = screen.getAllByTestId('AUD')[1];
    const CNY = screen.getAllByTestId('CNY')[1];
    const ILS = screen.getAllByTestId('ILS')[1];
    const ETH = screen.getAllByTestId('ETH')[1];
    const XRP = screen.getAllByTestId('XRP')[1];
    const USDT = screen.queryByText(/USDT/g);

    expect(mockedExchange).toBeCalled();
    expect(mockedExchange).toBeCalledWith('https://economia.awesomeapi.com.br/json/all');
    expect(currencyInput).toBeInTheDocument();
    expect(USD).toBeInTheDocument();
    expect(CAD).toBeInTheDocument();
    expect(EUR).toBeInTheDocument();
    expect(GBP).toBeInTheDocument();
    expect(ARS).toBeInTheDocument();
    expect(BTC).toBeInTheDocument();
    expect(LTC).toBeInTheDocument();
    expect(JPY).toBeInTheDocument();
    expect(CHF).toBeInTheDocument();
    expect(AUD).toBeInTheDocument();
    expect(CNY).toBeInTheDocument();
    expect(ILS).toBeInTheDocument();
    expect(ETH).toBeInTheDocument();
    expect(XRP).toBeInTheDocument();
    expect(USDT).not.toBeInTheDocument();
  });

  test('Crie um campo para selecionar qual metodo de pagamento será utilizado', async () => {
    renderWithRouter(<Carteira />, '/carteira');
    const methodInput = await screen.findByTestId('method-input');
    const moneyOption = screen.getByText(/Dinheiro/);
    const creditOption = screen.getByText(/Cartão de crédito/);
    const debitOption = screen.getByText(/Cartão de débito/);

    expect(methodInput).toBeInTheDocument();
    expect(moneyOption).toBeInTheDocument();
    expect(creditOption).toBeInTheDocument();
    expect(debitOption).toBeInTheDocument();
  });

  test('Crie um campo para selecionar uma tag.', async () => {
    renderWithRouter(<Carteira />, '/carteira');
    const tagInput = await screen.findByTestId('tag-input');
    const foodOption = screen.getByText(/Alimentação/);
    const funOption = screen.getByText(/Lazer/);
    const workOption = screen.getByText(/Trabalho/);
    const transportOption = screen.getByText(/Transporte/);
    const healthOption = screen.getByText(/Saúde/);

    expect(tagInput).toBeInTheDocument();
    expect(foodOption).toBeInTheDocument();
    expect(funOption).toBeInTheDocument();
    expect(workOption).toBeInTheDocument();
    expect(transportOption).toBeInTheDocument();
    expect(healthOption).toBeInTheDocument();
  });

  test("Crie um botão com o texto 'Adicionar despesa'", async () => {
    const { store } = renderWithRouter(<Carteira />, '/carteira');
    const addButton = await screen.findByText(/Adicionar despesa/i);
    const valueInput = await screen.findByTestId('value-input');
    const currencyInput = await screen.findByTestId('currency-input');
    const methodInput = await screen.findByTestId('method-input');
    const tagInput = await screen.findByTestId('tag-input');
    const descriptionInput = await screen.findByTestId('description-input');

    expect(addButton).toBeInTheDocument();

    userEvent.type(valueInput, '10');
    userEvent.selectOptions(currencyInput, `USD`);
    userEvent.selectOptions(methodInput, `Cartão de crédito`);
    userEvent.selectOptions(tagInput, `Lazer`);
    userEvent.type(descriptionInput, `Dez dólares`);
    fireEvent.click(addButton);
    expect(mockedExchange).toBeCalledTimes(2);

    const expectedStateExpense = [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: testData,
      },
    ];

    await waitFor(() => {
      expect(valueInput).toContainHTML(0);
    });
    expect(store.getState().expenses).toStrictEqual(expectedStateExpense);

    userEvent.type(valueInput, '20');
    userEvent.selectOptions(currencyInput, `EUR`);
    userEvent.selectOptions(methodInput, `Cartão de débito`);
    userEvent.selectOptions(tagInput, `Trabalho`);
    userEvent.type(descriptionInput, `Vinte euros`);
    fireEvent.click(addButton);
    expect(mockedExchange).toBeCalledTimes(3);

    const expectedStateExpense2 = [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: testData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Cartão de débito',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ];

    await waitFor(() => {
      expect(valueInput).toContainHTML(0);
    });
    expect(store.getState().expenses).toStrictEqual(expectedStateExpense2);
  });
});

describe('4 - [PAGINA DA CARTEIRA] Desenvolver uma tabela com os gastos', () => {
  const initial = {
    isFetching: false,
    editor: false,
    idToEdit: 0,
    email: 'alguem@email.com',
    currencyToExchange: 'BRL',
    currencies: [
      'USD',
      'CAD',
      'EUR',
      'GBP',
      'ARS',
      'BTC',
      'LTC',
      'JPY',
      'CHF',
      'AUD',
      'CNY',
      'ILS',
      'ETH',
      'XRP',
    ],
    expenses: [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: testData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ],
  };
  test('Crie uma tabela que possua como cabeçalho os campos Descrição, Tag, Método de pagamento, Valor, Moeda, Câmbio utilizado, Valor Convertido e Moeda de Conversão', () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const thDescricao = screen.getByTestId('Descrição');
    const thTag = screen.getByTestId('Tag');
    const thMetodo = screen.getByTestId('Método de Pagamento');
    const thValor = screen.getByTestId('Valor');
    const thMoeda = screen.getByTestId('Moeda');
    const thCambio = screen.getByTestId('Câmbio utilizado');
    const thValorConvertido = screen.getByTestId('Valor Convertido');
    const thMoedaConversao = screen.getByTestId('Moeda de conversão');
    const thEditarExcluir = screen.getByTestId('Editar/Excluir');

    expect(thDescricao).toBeInTheDocument();
    expect(thTag).toBeInTheDocument();
    expect(thMetodo).toBeInTheDocument();
    expect(thValor).toBeInTheDocument();
    expect(thMoeda).toBeInTheDocument();
    expect(thCambio).toBeInTheDocument();
    expect(thValorConvertido).toBeInTheDocument();
    expect(thMoedaConversao).toBeInTheDocument();
    expect(thEditarExcluir).toBeInTheDocument();
  });

  test('Crie um atributo data-testid com o index utilizado na confecção de cada linha de gasto da tabela.', () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const firstDescription = screen.getByTestId('0-description');
    const firstTag = screen.getByTestId('0-tag');
    const firstMethod = screen.getByTestId('0-method');
    const firstValue = screen.getByTestId('0-value');
    const firstCurrency = screen.getByTestId('0-currency');
    const firstExchangeRate = screen.getByTestId('0-exchange-rate');
    const firstExchangedValue = screen.getByTestId('0-exchanged-value');
    const firstExcCurrencyName = screen.getByTestId('0-exc-currency-name');
    const firstEditarExcluir = screen.getByTestId('0-edit-delete');

    expect(firstDescription).toBeInTheDocument();
    expect(firstDescription).toContainHTML('Dez dólares');
    expect(firstTag).toBeInTheDocument();
    expect(firstTag).toContainHTML('Lazer');
    expect(firstMethod).toBeInTheDocument();
    expect(firstMethod).toBeInTheDocument('Cartão de crédito');
    expect(firstValue).toBeInTheDocument();
    expect(firstValue).toContainHTML(10);
    expect(firstCurrency).toBeInTheDocument();
    expect(firstCurrency).toContainHTML('Dólar Comercial');
    expect(firstExchangeRate).toBeInTheDocument();
    expect(firstExchangeRate).toContainHTML('5,58');
    expect(firstExchangedValue).toBeInTheDocument();
    expect(firstExchangedValue).toContainHTML('55,75');
    expect(firstExcCurrencyName).toBeInTheDocument();
    expect(firstExcCurrencyName).toContainHTML('Real');
    expect(firstEditarExcluir).toBeInTheDocument();
  });

  test('Adiciona dois gastos à tabela.', () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const secondDescription = screen.getByTestId('1-description');
    const secondTag = screen.getByTestId('1-tag');
    const secondMethod = screen.getByTestId('1-method');
    const secondValue = screen.getByTestId('1-value');
    const secondCurrency = screen.getByTestId('1-currency');
    const secondExchangeRate = screen.getByTestId('1-exchange-rate');
    const secondExchangedValue = screen.getByTestId('1-exchanged-value');
    const secondExcCurrencyName = screen.getByTestId('1-exc-currency-name');
    const secondEditarExcluir = screen.getByTestId('1-edit-delete');

    expect(secondDescription).toBeInTheDocument();
    expect(secondDescription).toContainHTML('Vinte euros');
    expect(secondTag).toBeInTheDocument();
    expect(secondTag).toContainHTML('Trabalho');
    expect(secondMethod).toBeInTheDocument();
    expect(secondMethod).toBeInTheDocument('Dinheiro');
    expect(secondValue).toBeInTheDocument();
    expect(secondValue).toContainHTML(20);
    expect(secondCurrency).toBeInTheDocument();
    expect(secondCurrency).toContainHTML('Euro');
    expect(secondExchangeRate).toBeInTheDocument();
    expect(secondExchangeRate).toContainHTML('6,57');
    expect(secondExchangedValue).toBeInTheDocument();
    expect(secondExchangedValue).toContainHTML('131,37');
    expect(secondExcCurrencyName).toBeInTheDocument();
    expect(secondExcCurrencyName).toContainHTML('Real');
    expect(secondEditarExcluir).toBeInTheDocument();
  });
});

describe('5 - [PAGINA DA CARTEIRA] Incremente a função de deletar uma linha de gastos da tabela no botão de deletar. ', () => {
  const initial = {
    isFetching: false,
    editor: false,
    idToEdit: 0,
    email: 'alguem@email.com',
    currencyToExchange: 'BRL',
    currencies: [
      'USD',
      'CAD',
      'EUR',
      'GBP',
      'ARS',
      'BTC',
      'LTC',
      'JPY',
      'CHF',
      'AUD',
      'CNY',
      'ILS',
      'ETH',
      'XRP',
    ],
    expenses: [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: testData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ],
  };

  test('É possível deletar uma linha da tabela.', () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const deleteBtn = screen.getByTestId('0-delete-btn');
    fireEvent.click(deleteBtn);

    const Description = screen.getByTestId('0-description');
    const Tag = screen.getByTestId('0-tag');
    const Method = screen.getByTestId('0-method');
    const Value = screen.getByTestId('0-value');
    const Currency = screen.getByTestId('0-currency');
    const ExchangeRate = screen.getByTestId('0-exchange-rate');
    const ExchangedValue = screen.getByTestId('0-exchanged-value');
    const ExcCurrencyName = screen.getByTestId('0-exc-currency-name');
    const EditarExcluir = screen.getByTestId('0-edit-delete');

    expect(Description).toBeInTheDocument();
    expect(Description).toContainHTML('Vinte euros');
    expect(Tag).toBeInTheDocument();
    expect(Tag).toContainHTML('Trabalho');
    expect(Method).toBeInTheDocument();
    expect(Method).toBeInTheDocument('Dinheiro');
    expect(Value).toBeInTheDocument();
    expect(Value).toContainHTML(20);
    expect(Currency).toBeInTheDocument();
    expect(Currency).toContainHTML('Euro');
    expect(ExchangeRate).toBeInTheDocument();
    expect(ExchangeRate).toContainHTML('6,57');
    expect(ExchangedValue).toBeInTheDocument();
    expect(ExchangedValue).toContainHTML('131,37');
    expect(ExcCurrencyName).toBeInTheDocument();
    expect(ExcCurrencyName).toContainHTML('Real');
    expect(EditarExcluir).toBeInTheDocument();
  });

  test('Ao deletar uma linha da tabela, deleta-se do estado da aplicação também, na chave expenses.', () => {
    const { store } = renderWithRouter(<Carteira />, '/carteira', initial);
    const deleteBtn = screen.getByTestId('0-delete-btn');
    fireEvent.click(deleteBtn);

    const newExpenses = [
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ];

    expect(store.getState().expenses).toStrictEqual(newExpenses);
  });
});

describe('6 - [PAGINA DA CARTEIRA] Incremente a função de alterar uma linha de gastos da tabela no botão de editar. ', () => {
  const initial = {
    isFetching: false,
    editor: false,
    idToEdit: 0,
    email: 'alguem@email.com',
    currencyToExchange: 'BRL',
    currencies: [
      'USD',
      'CAD',
      'EUR',
      'GBP',
      'ARS',
      'BTC',
      'LTC',
      'JPY',
      'CHF',
      'AUD',
      'CNY',
      'ILS',
      'ETH',
      'XRP',
    ],
    expenses: [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: testData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ],
  };

  test('É possível editar uma linha da tabela.', async () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const editBtn = screen.getByTestId('0-edit-btn');
    fireEvent.click(editBtn);

    const newValue = await screen.findByTestId('e-value-input');
    const newCurrency = screen.getByTestId('e-currency-input');
    const newMethod = screen.getByTestId('e-method-input');
    const newTag = screen.getByTestId('e-tag-input');
    const newDescription = screen.getByTestId('e-description-input');
    const editButton = screen.getByTestId('edit-btn');

    userEvent.type(newValue, '100');
    userEvent.selectOptions(newCurrency, 'CAD');
    userEvent.selectOptions(newMethod, 'Dinheiro');
    userEvent.selectOptions(newTag, 'Trabalho');
    userEvent.type(newDescription, 'Cem dólares canadenses');

    fireEvent.click(editButton);

    await waitFor(() => {
      const Value = screen.getByTestId('0-value');
      expect(Value).toContainHTML('100');
    });

    const Description = screen.getByTestId('0-description');
    const Tag = screen.getByTestId('0-tag');
    const Method = screen.getByTestId('0-method');
    const Currency = screen.getByTestId('0-currency');
    const ExchangeRate = screen.getByTestId('0-exchange-rate');
    const ExchangedValue = screen.getByTestId('0-exchanged-value');
    const ExcCurrencyName = screen.getByTestId('0-exc-currency-name');
    const EditarExcluir = screen.getByTestId('0-edit-delete');

    expect(Description).toBeInTheDocument();
    expect(Description).toContainHTML('Cem dólares canadenses');
    expect(Tag).toBeInTheDocument();
    expect(Tag).toContainHTML('Trabalho');
    expect(Method).toBeInTheDocument();
    expect(Method).toBeInTheDocument('Dinheiro');
    expect(Currency).toBeInTheDocument();
    expect(Currency).toContainHTML('Dólar Canadense');
    expect(ExchangeRate).toBeInTheDocument();
    expect(ExchangeRate).toContainHTML('4,20');
    expect(ExchangedValue).toBeInTheDocument();
    expect(ExchangedValue).toContainHTML('420,41');
    expect(ExcCurrencyName).toBeInTheDocument();
    expect(ExcCurrencyName).toContainHTML('Real');
    expect(EditarExcluir).toBeInTheDocument();
  });

  test('Ao editar uma linha da tabela, edita-se do estado da aplicação também, na chave expenses.', async () => {
    const { store } = renderWithRouter(<Carteira />, '/carteira', initial);
    const editBtn = screen.getByTestId('0-edit-btn');
    fireEvent.click(editBtn);

    const newValue = await screen.findByTestId('e-value-input');
    const newCurrency = screen.getByTestId('e-currency-input');
    const newMethod = screen.getByTestId('e-method-input');
    const newTag = screen.getByTestId('e-tag-input');
    const newDescription = screen.getByTestId('e-description-input');
    const editButton = screen.getByTestId('edit-btn');

    userEvent.type(newValue, '100');
    userEvent.selectOptions(newCurrency, 'CAD');
    userEvent.selectOptions(newMethod, 'Dinheiro');
    userEvent.selectOptions(newTag, 'Trabalho');
    userEvent.type(newDescription, 'Cem dólares canadenses');

    fireEvent.click(editButton);

    await waitFor(() => {
      const Value = screen.getByTestId('0-value');
      expect(Value).toContainHTML('100');
    });

    const newExpenses = [
      {
        id: 0,
        value: '100',
        currency: 'CAD',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Cem dólares canadenses',
        exchangeRates: testData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ];

    expect(store.getState().expenses).toStrictEqual(newExpenses);
  });
});

describe('7 - [BÔNUS] Adicione um dropdown no Header, como um campo de moeda utilizada, de maneira que o resultado das somas, de gastos totais e do valor convertido de cada linha, seja convertido para a moeda escolhida.', () => {
  const initial = {
    isFetching: false,
    editor: false,
    idToEdit: 0,
    email: 'alguem@email.com',
    currencyToExchange: 'BRL',
    currencies: [
      'USD',
      'CAD',
      'EUR',
      'GBP',
      'ARS',
      'BTC',
      'LTC',
      'JPY',
      'CHF',
      'AUD',
      'CNY',
      'ILS',
      'ETH',
      'XRP',
    ],
    expenses: [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: testData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: testData,
      },
    ],
  };

  test('O input de moeda no Header, ao ser alterado, guarda a informação no estado da aplicação.', () => {
    const { store } = renderWithRouter(<Carteira />, '/carteira', initial);
    const headerCurrencyInput = screen.getByTestId('header-currency-input');

    userEvent.selectOptions(headerCurrencyInput, 'USD');

    expect(store.getState().currencyToExchange).toBe('USD');
  });

  test("Quando escolhermos uma moeda, os valores convertidos devem mudar para a moeda escolhida. Este teste selecionará 'USD'", async () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const headerCurrencyInput = screen.getByTestId('header-currency-input');
    userEvent.selectOptions(headerCurrencyInput, 'USD');

    const Value = await screen.findByTestId('0-value');
    expect(Value).toContainHTML('10');

    const Description = screen.getByTestId('0-description');
    const Tag = screen.getByTestId('0-tag');
    const Method = screen.getByTestId('0-method');
    const Currency = screen.getByTestId('0-currency');
    const ExchangeRate = screen.getByTestId('0-exchange-rate');
    const ExchangedValue = screen.getByTestId('0-exchanged-value');
    const ExcCurrencyName = screen.getByTestId('0-exc-currency-name');
    const EditarExcluir = screen.getByTestId('0-edit-delete');
    const totalExpenses = screen.getByTestId('total-field');

    expect(Description).toBeInTheDocument();
    expect(Description).toContainHTML('Dez dólares');
    expect(Tag).toBeInTheDocument();
    expect(Tag).toContainHTML('Lazer');
    expect(Method).toBeInTheDocument();
    expect(Method).toBeInTheDocument('Cartão crédito');
    expect(Currency).toBeInTheDocument();
    expect(Currency).toContainHTML('Dólar Comercial');
    expect(ExchangeRate).toBeInTheDocument();
    expect(ExchangeRate).toContainHTML('1,00');
    expect(ExchangedValue).toBeInTheDocument();
    expect(ExchangedValue).toContainHTML('10,00');
    expect(ExcCurrencyName).toBeInTheDocument();
    expect(ExcCurrencyName).toContainHTML('Dólar Comercial');
    expect(EditarExcluir).toBeInTheDocument();
    expect(totalExpenses).toContainHTML('33,56');
  });

  test("Quando escolhermos uma moeda, os valores convertidos devem mudar para a moeda escolhida. Este teste selecionará 'CNY'", async () => {
    renderWithRouter(<Carteira />, '/carteira', initial);
    const headerCurrencyInput = screen.getByTestId('header-currency-input');
    userEvent.selectOptions(headerCurrencyInput, 'CNY');

    const Value = await screen.findByTestId('0-value');
    expect(Value).toContainHTML('10');

    const Description = screen.getByTestId('0-description');
    const Tag = screen.getByTestId('0-tag');
    const Method = screen.getByTestId('0-method');
    const Currency = screen.getByTestId('0-currency');
    const ExchangeRate = screen.getByTestId('0-exchange-rate');
    const ExchangedValue = screen.getByTestId('0-exchanged-value');
    const ExcCurrencyName = screen.getByTestId('0-exc-currency-name');
    const EditarExcluir = screen.getByTestId('0-edit-delete');
    const totalExpenses = screen.getByTestId('total-field');

    expect(Description).toBeInTheDocument();
    expect(Description).toContainHTML('Dez dólares');
    expect(Tag).toBeInTheDocument();
    expect(Tag).toContainHTML('Lazer');
    expect(Method).toBeInTheDocument();
    expect(Method).toBeInTheDocument('Cartão crédito');
    expect(Currency).toBeInTheDocument();
    expect(Currency).toContainHTML('Dólar Comercial');
    expect(ExchangeRate).toBeInTheDocument();
    expect(ExchangeRate).toContainHTML('6,79');
    expect(ExchangedValue).toBeInTheDocument();
    expect(ExchangedValue).toContainHTML('67,90');
    expect(ExcCurrencyName).toBeInTheDocument();
    expect(ExcCurrencyName).toContainHTML('Yuan Chinês');
    expect(EditarExcluir).toBeInTheDocument();
    expect(totalExpenses).toContainHTML('227,92');
  });
});

describe('8 - [BÔNUS] As informações disponíveis na tabela devem ser salvas no localStorage, na chave expenses e o email na chave email, desta forma será possível manter as informações principais caso feche a aba ou atualize a página.', () => {
  const expenseCheck = [
    {
      id: 0,
      value: '10',
      currency: 'USD',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      description: 'Dez dólares',
      exchangeRates: testData,
    },
  ];
  test('O email e os gastos do usuário estão salvos no localStorage e mantem os dados no app', async () => {
    const { store, history } = renderWithRouter(<App />, '/');

    const email = screen.getByTestId('email-input');
    const senha = screen.getByTestId('password-input');
    const button = screen.getByText(/Entrar/i);

    localStorage.clear();
    userEvent.type(email, 'alguem@email.com');
    userEvent.type(senha, '123456');
    fireEvent.click(button);

    const emailStorage = 'alguem@email.com';
    expect(localStorage.__STORE__['email']).toStrictEqual(emailStorage);

    const addButton = await screen.findByText(/Adicionar despesa/i);
    const valueInput = await screen.findByTestId('value-input');
    const currencyInput = await screen.findByTestId('currency-input');
    const methodInput = await screen.findByTestId('method-input');
    const tagInput = await screen.findByTestId('tag-input');
    const descriptionInput = await screen.findByTestId('description-input');

    userEvent.type(valueInput, '10');
    userEvent.selectOptions(currencyInput, `USD`);
    userEvent.selectOptions(methodInput, `Cartão de crédito`);
    userEvent.selectOptions(tagInput, `Lazer`);
    userEvent.type(descriptionInput, `Dez dólares`);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(valueInput).toContainHTML('0');
    });

    expect(JSON.parse(localStorage.__STORE__['expenses'])).toStrictEqual(expenseCheck);

    history.push('/carteira');

    const Description = screen.getByTestId('0-description');
    const Tag = screen.getByTestId('0-tag');
    const Method = screen.getByTestId('0-method');
    const Value = screen.getByTestId('0-value');
    const Currency = screen.getByTestId('0-currency');
    const ExchangeRate = screen.getByTestId('0-exchange-rate');
    const ExchangedValue = screen.getByTestId('0-exchanged-value');
    const ExcCurrencyName = screen.getByTestId('0-exc-currency-name');
    const EditarExcluir = screen.getByTestId('0-edit-delete');

    expect(Description).toBeInTheDocument();
    expect(Description).toContainHTML('Dez dólares');
    expect(Tag).toBeInTheDocument();
    expect(Tag).toContainHTML('Lazer');
    expect(Method).toBeInTheDocument();
    expect(Method).toBeInTheDocument('Cartão de crédito');
    expect(Value).toBeInTheDocument();
    expect(Value).toContainHTML(10);
    expect(Currency).toBeInTheDocument();
    expect(Currency).toContainHTML('Dólar Comercial');
    expect(ExchangeRate).toBeInTheDocument();
    expect(ExchangeRate).toContainHTML('5,58');
    expect(ExchangedValue).toBeInTheDocument();
    expect(ExchangedValue).toContainHTML('55,75');
    expect(ExcCurrencyName).toBeInTheDocument();
    expect(ExcCurrencyName).toContainHTML('Real');
    expect(EditarExcluir).toBeInTheDocument();

    expect(store.getState().expenses).toStrictEqual(expenseCheck);
  });
});
