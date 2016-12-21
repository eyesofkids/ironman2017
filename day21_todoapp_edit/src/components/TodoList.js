//@flow
import React from 'react'
import type { TodoListProps } from '../definitions/TodoTypeDefinition.js'

const TodoList = ({children}: TodoListProps) => (
   <ul className="list-group">{children}</ul>
)

export default TodoList
