//@flow
import React from 'react'

//匯入Props靜態類型的定義
import type { TodoItemProps } from '../definitions/TodoTypeDefinition.js'

const TodoItem = ({ title, style, onItemClick }: TodoItemProps) => (
   <li 
      onClick={() => {
        onItemClick()
      }}
      style={style}
      >
      {title}
    </li>
)

//匯出TodoItem模組
export default TodoItem
