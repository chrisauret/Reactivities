import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ScrollToTop from './app/layout/scrollToTop';

export const history = createBrowserHistory();

ReactDOM.render(

  <React.StrictMode>
    <Router history={history}>
      <ScrollToTop />
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
