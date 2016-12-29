import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

// reducers可以一次匯入用解構的組合
import * as reducers from './reducers'

// 注意: 要一個一個匯入，因為是各自獨立不同的函式傳入參數
import { fetchItems, addItem, updateItem } from './middlewares'

import App from './components/App'

// @reducer
//
// 這裡作合併reducer的動作
// const reducer = combineReducers({
//    searchedKeyword, filterOut, sortType, items
// })
const reducer = combineReducers({
   ...reducers
})

// @store
//
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(reducer, applyMiddleware())
const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(fetchItems, addItem, updateItem))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
