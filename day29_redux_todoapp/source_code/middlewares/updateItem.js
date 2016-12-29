// @flow

import { FETCH_UPDATE_ITEM } from '../constants/actionTypes'

const updateItem = (store: any) => (next: any) => (action: Object) => {
  if (action.type !== FETCH_UPDATE_ITEM) return next(action)

  //處理payload，不需要isEditing欄位
  const { id, title, isCompleted } = action.payload
  const payloadForDatabase = { id, title, isCompleted }

  //作PUT
  fetch(`http://localhost:5555/items/${id}`, {
    method: 'PUT',
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
    .then(item => {
      //回送至reducer時要加上isEditing欄位
      const stateItem = Object.assign({}, item, { isEditing: false })
      return action.cb(stateItem, store.dispatch)
    })
    .catch((error) => {
      //console.error(error)
    })
}

export default updateItem
