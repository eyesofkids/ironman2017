// @flow

// import createStore form redux module
import { createStore } from 'redux'

import React from 'react'
import ReactDOM from 'react-dom'

// @Reducer
//
// Add Item: action payload = action.payload
// Del Item: action payload = action.id
// 使用純粹函式的陣列unshift，不能有副作用
// state(狀態)一開始的值是空陣列`state=[]`
function dealItem(state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      {
        return [{
          id: action.payload.id,
          text: action.payload.text,
        }, ...state]
      }

    case 'DEL_ITEM':
      {
        return state.filter(item => item.id !== action.id)
      }

    default:
      return state
  }
}

// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(dealItem)
const store = createStore(dealItem,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// ------ 開始: 下面開始撰寫React元件，使用ReactDOM中的render方法 ------
// React元件 - MyComponent
class MyComponent extends React.Component {
  // flow工具檢查用
  state: { inputValue: ?string }

  constructor(props) {
    super(props)

    // 在文字輸入時使用state
    this.state = { inputValue: '' }
  }


  handleChange = (event: KeyboardEvent) => {
    // flowtype檢查用的
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        inputValue: event.target.value,
      })
    }
  }

  handleClick = () => {
    // store中的狀態值發送要新增的action
    store.dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: +new Date(),
        text: this.state.inputValue,
      },
    })

    // 清空文字框中的文字
    this.setState({
      inputValue: '',
    })
  }

  render() {
    // 測試用
    // console.log(store.getState())
    return (
      <div>
        <div>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
          <button
            onClick={this.handleClick}
          >
            Add Item
          </button>
        </div>
        <p>
        {
          store.getState().map(item => (
            <li key={item.id}>
              <input type="checkbox" id={item.id} onClick={() => store.dispatch({ type: 'DEL_ITEM', id: item.id })} />
              {item.text}
            </li>
          ))
        }
        </p>
      </div>
    )
  }
}


// @Render
// render(渲染)是從目前store中取出state資料，然後輸出呈現在網頁上
const render = () => ReactDOM.render(
  <MyComponent />,
  document.getElementById('root'))
// ------ 結束: 撰寫React元件 ------

// 第一次要呼叫一次render，讓網頁呈現資料
render()

// 訂閱render到store，這會讓store中如果有新的state(狀態)時，會重新呼叫一次render()
store.subscribe(render)
