//@flow
import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onFecthUpdateItem } from '../actions/items'

//匯入Props靜態類型的定義
import type { TodoEditFormProps } from '../definitions/TodoTypeDefinition.js'

const TodoEditForm = ({ id, isCompleted, title, onFecthUpdateItem }: TodoEditFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  return (
    <li className="list-group-item">
      <input
        type="text"
        defaultValue={title}
        ref={el => { titleField = el }}
        autoFocus
        onBlur={(e) => {
            if (titleField.value.trim()
                && e.target instanceof HTMLInputElement) {

              //更新標題
              onFecthUpdateItem({
                id,
                title: titleField.value,
                isCompleted: !isCompleted,
                isEditing: false
              })
            }
          }
        }
        onKeyPress={(e) => {
            if (titleField.value.trim()
                && e.target instanceof HTMLInputElement
                && e.key === 'Enter') {

              //更新標題
              onFecthUpdateItem({
                id,
                title: titleField.value,
                isCompleted: !isCompleted,
                isEditing: false
              })
            }
          }
        }
      />
    </li>
  )
}

const mapDispatchToProps= (dispatch) => (
  bindActionCreators({ onFecthUpdateItem }, dispatch)
)

//匯出TodoEditForm模組
export default connect(null, mapDispatchToProps)(TodoEditForm)
