// @flow

import { ADD_ITEM, DEL_ITEM, FETCH_ITEMS, INIT_ITEMS } from './actionTypes'

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是payload
export const onItemAdd = (text: string) => (
  { type: ADD_ITEM,
    id: +new Date(),
    text,
  }
)

// onItemDel處理產生'DEL_ITEM'的動作物件，注意傳入參數是id
export const onItemDel = (id: number) => ({ type: DEL_ITEM, id })

// onInitData是初始化用的，這是準備要讓reducer重新載入store裡面的items值
export const onInitData = (items: Array<Object>) => ({ type: INIT_ITEMS, items })

// onFecthData是副作用函式，真正的執行程式碼在fetchMiddleware裡，執行後會到這個函式來
export const onFecthData = () => (
  {
    type: FETCH_ITEMS,
    cb: (response: Array<Object>, dispatch: Function) => dispatch(onInitData(response)),
  }
)
