//@flow
import React from 'react'
import type { TodoListProps } from '../definitions/TodoTypeDefinition.js'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onItemFilterOut, onItemSort } from '../actions/items'

const TodoList = ({children, onItemFilterOut, onItemSort, sortType}: TodoListProps) => {

  //找出索引值，共有三種值，要對應顯示字串用的
  let sortTypeIndex: number = ['no', 'asc', 'desc'].findIndex((value) => value === sortType )

  return (
    <div>
      <label>
        <input
              type="checkbox"
              defaultChecked
              onClick={onItemFilterOut}
        />
        包含已完成的項目
      </label>
      <button
        className={(sortTypeIndex === 0)? 'btn btn-default': 'btn btn-success'}
        onClick={() => { onItemSort({direction: (sortType === 'asc')? 'desc': 'asc'}) }}
        disabled={(React.Children.count(children))? false: true}
      >
        按筆劃排序: {['沒有','少 -> 多','多 -> 少'][sortTypeIndex]}
      </button>
    <ul className="list-group">{children}</ul>
    </div>
    )
}

// 準備綁定用的mapStateToProps方法，
// 只需要sortType中的direction值
const mapStateToProps = store => ({ sortType: store.sortType.direction })

// 準備綁定用的DispatchToProps方法，
// 只需要onItemFilterOut與onItemSort這個方法
const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ onItemFilterOut, onItemSort }, dispatch)
)

//匯出TodoList模組
export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
