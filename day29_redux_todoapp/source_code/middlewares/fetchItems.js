// @flow

import { FETCH_LOAD_ITEMS } from '../constants/actionTypes'

const fetchItems = (store: any) => (next: any) => (action: Object) => {

  if (action.type !== FETCH_LOAD_ITEMS) return next(action)

  // 這是獲取伺服器上的資料的fetch語法，
  // 注意最後會執行action.cb(json, store.dispatch)
  // 也就是onFecthData中的cb屬性
  fetch('http://localhost:5555/items?_sort=id&_order=DESC', {
  method: 'GET'
  })
  .then((response) => {
    //ok 代表狀態碼在範圍 200-299
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(itemList => {
    // store.items與資料庫上的items記錄並不統一，
    // 少一個isEditing屬性，
    // 加入{ isEditing: false }屬性
     const items = itemList.map((item) => {
       return Object.assign({}, item, { isEditing: false })
     })

    return action.cb(items, store.dispatch)
  })
  .catch((error) => { throw new Error(error.message) })
}

export default fetchItems
