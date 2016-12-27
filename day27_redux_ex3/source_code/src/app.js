// @flow

import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './action'

class MyComponent extends React.Component {

  // Flow工具檢查用
  state: { inputValue: string }

  constructor(props) {
    super(props)

    // 在文字輸入時使用state
    this.state = { inputValue: '' }
  }

  // 處理文字框中輸入文字用的方法
  handleTextChange = (event: KeyboardEvent) => {
    // flowtype檢查用的
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        inputValue: event.target.value,
      })
    }
  }

  // 處理點按新增按鈕用的方法
  handleItemAdd = () => {
    // store中的狀態值發送要新增的action，onItemAdd方法會被綁到props裡面
    this.props.onItemAdd(
      { id: +new Date(),
        text: this.state.inputValue,
      })

    // 清空文字框中的文字
    this.setState({
      inputValue: '',
    })
  }


  render() {
    // 解構this.props，items值與onItemDel方法會被綁到props裡面
    const { items, onItemDel } = this.props

    return (
      <div>
        <div>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleTextChange}
          />
          <button
            onClick={this.handleItemAdd}
          >
            新增項目
          </button>
        </div>
        <p>
          {
            items.map(item => (
                <li key={item.id}>
                  <input
                    type="checkbox"
                    id={item.id}
                    onClick={() => onItemDel(item.id)}
                  />
                  {item.text}
                </li>
            ))
          }
        </p>

        </div>
    )
  }
}

// 將store中的items值傳綁到props上
const mapStateToProps = store => (
  { items: store.items }
)

// 連接Redux store
// 並把store.items綁到props.items，
// actionCreators裡面的方法也綁到props上
export default connect(mapStateToProps, actionCreators)(MyComponent)
