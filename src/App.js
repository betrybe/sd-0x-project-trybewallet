import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Login, Wallet } from './pages';

function App() {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/carteira" component={Wallet} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
