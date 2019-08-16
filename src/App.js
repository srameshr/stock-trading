import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import React, { Component, Suspense, lazy } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk';
import reducers from './reducers/index';
import bootstrap from './utils/bootstrap'
import 'antd/dist/antd.css'
import './App.css';

const DashboardRoute = lazy(() => import('./routes/dashboard-route'));
const TradeRoute = lazy(() => import('./routes/trade-route'));

class App extends Component {

  constructor() {
    super();
    bootstrap(); // Blocking code. We need this to run on the main thread before next step.
  }
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <Router>
          <Suspense fallback={(
            <div className="full-width full-height flex-center">
              {/* <img src={require('./assets/loader/Ellipsis.gif')} width="100" height="100"/> */}
            </div>
          )}>
            <Switch>
              <Route exact path="/" component={() => <DashboardRoute />} />
              <Route path="/trade/:symbol" component={() => <TradeRoute />} />
              <Route path="/trade/:symbol/:type" component={() => <TradeRoute />} />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    );
  }
}

export default App;
