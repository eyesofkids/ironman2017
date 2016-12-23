//@flow
import React from 'react'
import type { TodoListProps } from '../definitions/TodoTypeDefinition.js'

const TodoList = ({children, onItemFilter, onItemSort, sortType}: TodoListProps) => {

  //找出索引值，共有三種值，要對應顯示字串用的
  let sortTypeIndex: number = ['', 'asc', 'desc'].findIndex((value) => value === sortType )

  return (
    <div>
      <label>
        <input
              type="checkbox"
              defaultChecked
              onClick={onItemFilter}
        />
        包含已完成的項目
      </label>
      <button
        className={(sortTypeIndex === 0)? 'btn btn-default': 'btn btn-success'}
        onClick={() => { onItemSort((sortType === 'asc')? 'desc': 'asc') }}
        disabled={(React.Children.count(children))? false: true}
      >
        按筆劃排序: {['沒有','少 -> 多','多 -> 少'][sortTypeIndex]}
      </button>
    <ul className="list-group">{children}</ul>
    </div>
    )
}

export default TodoList
