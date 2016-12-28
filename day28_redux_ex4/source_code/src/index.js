import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import itemApp from './reducer'
import MyComponent from './app'
import fetchMiddleware from './fetchmiddleware'

// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(dealItem, applyMiddleware(fetchMiddleware))
const store = createStore(itemApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(fetchMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <MyComponent />
  </Provider>,
  document.getElementById('root'))
