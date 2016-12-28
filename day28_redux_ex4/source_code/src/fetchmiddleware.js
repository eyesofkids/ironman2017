// @flow

import { FETCH_ITEMS } from './actionTypes'

const fetchMiddleware = (store: any) => (next: any) => (action: Object) => {
  if (action.type !== FETCH_ITEMS) return next(action)

  // 這是獲取伺服器上的資料的fetch語法，
  // 注意最後會執行action.cb(json, store.dispatch)
  // 也就是onFecthData中的cb屬性
  fetch('http://localhost:5555/items/')
  .then(response => response.json())
  .then(json => action.cb(json, store.dispatch))
  .catch((err) => { throw new Error(err.message) })

}

export default fetchMiddleware
