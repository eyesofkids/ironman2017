//@flow
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onFecthAddItem } from '../actions/items'

//匯入Props靜態類型的定義
import type { TodoAddFormProps } from '../definitions/TodoTypeDefinition.js'

const TodoAddForm = ({ placeholderText, onFecthAddItem }: TodoAddFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  return (
    <div>
      <input
        className="form-control"
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onKeyPress={(e) => {
          if (titleField.value.trim()
              && e.target instanceof HTMLInputElement
              && e.key === 'Enter') {

            //加入到items陣列中(state)
            onFecthAddItem({
              id: +new Date(),
              title: titleField.value,
              isCompleted: false,
              isEditing: false,
            })

            //清空文字輸入框
            titleField.value = ''
          }
        }
      }
      />
    </div>
  )
}

// 準備綁定用的DispatchToProps方法，
// 只需要onFecthAddItem這個方法
const mapDispatchToProps = (dispatch) =>(
  bindActionCreators({ onFecthAddItem }, dispatch)
)

//匯出TodoAddForm模組
//這個元件中不需要store中的狀態值
export default connect(null, mapDispatchToProps)(TodoAddForm)
