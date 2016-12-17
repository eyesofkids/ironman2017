//@flow
import React from 'react'

const TodoItem = (props: {text: string, index: number, onItemClick: Function}) => {

  const handleClick = () => {
        //實際上呼叫的是由上層元件從props.onItemClick傳入的方法(上層元件的方法)
        props.onItemClick(props.index)
    }

  return <li onClick={handleClick}>{props.text}</li>
}

//加入props的資料類型驗証
TodoItem.propTypes = {
  text: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
  onItemClick: React.PropTypes.func,
}

//匯出TodoItem模組
export default TodoItem
