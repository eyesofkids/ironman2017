// @flow
import {
  ADD_ITEM,
  UPDATE_ITEM,
  INIT_ITEMS
} from '../constants/actionTypes'

//匯入項目的靜態定義，使用import type
import type { Item } from '../definitions/TodoTypeDefinition.js'

export default function items(state: Array<Item> = [], action: Object) {
  switch (action.type) {
    case ADD_ITEM:
      {
        //payload: Item
        
        return [action.payload, ...state]
      }

    case UPDATE_ITEM:
      {
        //payload: Item

        // 複製一個新的items陣列
        const newItems = [...state]

        // 尋找符合action.id的陣列中item索引值
        const index = newItems.findIndex((item) => item.id === action.payload.id)

        // TODO: 錯誤處理
        // 沒找到直接回傳state
        if(index === -1 ) return newItems

        // 用action.payload取代掉這個陣列成員值
        newItems[index] = action.payload

        return newItems
      }

    case INIT_ITEMS:
      {
        //payload: Array<Item>
        return [...action.payload]
      }

    default:
      return state
  }
}
