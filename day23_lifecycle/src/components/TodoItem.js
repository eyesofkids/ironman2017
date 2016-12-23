//@flow
import React from 'react'

//匯入Props靜態類型的定義
import type { TodoItemProps } from '../definitions/TodoTypeDefinition.js'

const TodoItem = ({ title, isCompleted, onItemClick, onItemDoubleClick }: TodoItemProps) => (
   <li
      onDoubleClick={onItemDoubleClick} 
      className={isCompleted
        ? 'list-group-item list-group-item-danger animated fadeIn'
        : 'list-group-item list-group-item-success animated bounce'
      }
    >
      <input 
        type="checkbox"
        defaultChecked={isCompleted}
        onClick={onItemClick}
      />
      {' '}
      {title}
    </li>
)

//匯出TodoItem模組
export default TodoItem
