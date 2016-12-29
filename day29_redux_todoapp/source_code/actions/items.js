// @flow

import {
  ADD_ITEM,
  UPDATE_ITEM,
  FETCH_LOAD_ITEMS,
  FETCH_ADD_ITEM,
  FETCH_UPDATE_ITEM,
  INIT_ITEMS,
  TOGGLE_FILTER,
  SEARCH_ITEMS,
  SORT_ITEMS
} from '../constants/actionTypes'

//匯入項目的靜態定義，使用import type
import type { Item } from '../definitions/TodoTypeDefinition.js'

// 處理把所有項目的更新，
// 接著onFecthLoadItems之後執行，
// 到reducer去
export const onInitData = (items: Array<Object>) => (
  {
    type: INIT_ITEMS,
    payload: items
  }
)

// 處理把項目的新增，
// 接著onFecthAddItem之後執行，
// 到reducer去
export const onItemAdd = (payload: Item) => (
  { type: ADD_ITEM,
    payload
  }
)

// 處理把項目的更新，
// 接著onFecthUpdateItem之後執行，
// 到reducer去
export const onItemUpdate = (payload: Item) => (
  { type: UPDATE_ITEM,
    payload
  }
)

// 處理把項目的isEditing改為true
// 實際上的action.type為`UPDATE_ITEM`，
// 不需要經過伺服器，
// 所以直接到reducer
export const onItemEdit = (payload: Item) => (
  { type: UPDATE_ITEM,
    payload
  }
)

// 處理搜尋
export const onItemSearch = (payload: { keyword: string}) => (
  { type: SEARCH_ITEMS,
    payload
  }
)

// 處理排序
export const onItemSort = (payload: { direction: string}) => (
  { type: SORT_ITEMS,
    payload
  }
)

// 處理過濾是否顯示已完成項目，
// 沒有payload，只是要切換布林值
export const onItemFilterOut = () => (
  { type: TOGGLE_FILTER }
)

// 處理到伺服器上獲取資料，
// GET method
// 真正的執行程式碼在middlewares/fetchItems.js裡，
// 執行後會回呼cb函式
export const onFecthLoadItems = () => (
  {
    type: FETCH_LOAD_ITEMS,
    cb: (response: Array<Item>, dispatch: Function) => dispatch(onInitData(response)),
  }
)

// 處理到伺服器上新增一筆資料，
// POST method
// 真正的執行程式碼在middlewares/addItem.js裡，
// 執行後會回呼cb函式
export const onFecthAddItem = (payload: Item) => (
    {
      type: FETCH_ADD_ITEM,
      payload,
      cb: (response: Item, dispatch: Function) => dispatch(onItemAdd(response)),
    }
  )

// 處理到伺服器上更動一筆資料，
// PUT method
// 真正的執行程式碼在middlewares/updateItem.js裡，
// 執行後會回呼cb函式
export const onFecthUpdateItem = (payload: Item) => (
  {
    type: FETCH_UPDATE_ITEM,
    payload,
    cb: (response: Item, dispatch: Function) => dispatch(onItemUpdate(response)),
  }
)
