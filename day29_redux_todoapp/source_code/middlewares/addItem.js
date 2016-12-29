// @flow

import { FETCH_ADD_ITEM } from '../constants/actionTypes'

const addItem = (store: any) => (next: any) => (action: Object) => {
  if (action.type !== FETCH_ADD_ITEM) return next(action)

   //處理payload，不需要isEditing欄位
    const { id, title, isCompleted } = action.payload
    const payloadForDatabase = { id, title, isCompleted }

  //作POST
  fetch('http://localhost:5555/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payloadForDatabase)
   })
    .then((response) => {
      //ok 代表狀態碼在範圍 200-299
      if (!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then(item => action.cb(item, store.dispatch))
    .catch((error) => {
      //這裡可以顯示一些訊息
      //console.error(error)
    })
}

export default addItem
