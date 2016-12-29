//@flow
import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onItemEdit, onFecthUpdateItem } from '../actions/items'

//匯入Props靜態類型的定義
import type { TodoItemProps } from '../definitions/TodoTypeDefinition.js'

const TodoItem = ({ id, title, isCompleted, onFecthUpdateItem, onItemEdit }: TodoItemProps) => (
   <li
      onDoubleClick={() => {
        // 項目的isEditing值為true
        onItemEdit({
          id,
          title,
          isCompleted,
          isEditing: true
        })
      }}
      className={isCompleted
        ? 'list-group-item list-group-item-danger animated fadeIn'
        : 'list-group-item list-group-item-success animated bounce'
      }
    >
      <input
        type="checkbox"
        defaultChecked={isCompleted}
        onClick={() => {
          // 切換項目的isCompleted
          onFecthUpdateItem({
            id,
            title,
            isCompleted: !isCompleted,
            isEditing: false
          })
        }}
      />
      {' '}
      {title}
    </li>
)

// 準備綁定用的DispatchToProps方法，
// 只需要onItemEdit與onFecthUpdateItem這個方法
const mapDispatchToProps= (dispatch) => (
  bindActionCreators({ onItemEdit, onFecthUpdateItem }, dispatch)
)

// 匯出TodoItem模組，
// 這個元件中不需要store中的狀態值，
// 因為都從上層元件傳遞到props來了
export default connect(null, mapDispatchToProps)(TodoItem)
