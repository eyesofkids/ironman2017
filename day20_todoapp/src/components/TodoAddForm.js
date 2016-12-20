//@flow
import React from 'react'

//匯入Props靜態類型的定義
import type { TodoAddFormProps } from '../definitions/TodoTypeDefinition.js'

const TodoAddForm = ({ placeholderText, onItemAdd }: TodoAddFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  return (
    <div>
      <input 
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onKeyPress={(e) => {
          if (titleField.value.trim() 
              && e.target instanceof HTMLInputElement 
              && e.key === 'Enter') {  
            
            //加入到items陣列中(state)         
            onItemAdd({
              id: +new Date(),
              title: titleField.value,
              isCompleted: false,
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

//匯出TodoAddForm模組
export default TodoAddForm
