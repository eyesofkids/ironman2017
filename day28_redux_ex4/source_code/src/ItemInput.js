// @flow

import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './action'

const ItemInput = (props: any) => {
  // 給Flow檢查使用的
  let input: any = null

  // 解構賦值，把props裡的方法指定出來
  const { onItemAdd, onFecthData } = props

  return (
    <form onSubmit={(e: Event) => {
      e.preventDefault()
      if (!input.value.trim()) {
        return
      }
      // 執行Action Creator中的onItemAdd，
      // 相當於store.dispatch()執行ADD_ITEM的action
      onItemAdd(input.value)
      input.value = ''
    }}>
      <input ref={(node: any) => { input = node }} />
      <button type="submit">新增項目</button>
      <button onClick={() => onFecthData()} >從伺服器獲取資料</button>
    </form>
  )
}

// 連接Redux store
// 只需要綁定actionCreators中的方法即可，store中的項目值不需要
export default connect(null, actionCreators)(ItemInput)
