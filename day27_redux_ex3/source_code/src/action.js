// @flow

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是payload
export const onItemAdd = (payload: { id: number, text: string }) => (
  { type: 'ADD_ITEM', payload }
)

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是id
export const onItemDel = (id: number) => ({ type: 'DEL_ITEM', id })
