// @flow
import { createStore } from 'redux'

// @Reducer
//
// action payload = action.text
// 使用純粹函式的陣列unshift，不能有副作用
// state(狀態)一開始的值是空陣列`state=[]`
function addItem(state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return [action.text, ...state]
    default:
      return state
  }
}

// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(addItem)
const store = createStore(addItem,
              window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// @Render
//
// render(渲染)是從目前store中取出state資料，然後輸出呈現在網頁上
function render() {
  const items = store.getState().map(item => (
    (item) ? `<li>${item}</li>` : ''
  ))
  document.getElementById('itemlist').innerHTML = `<ul>${items.join('')}</ul>`
}

// 第一次要呼叫一次render，讓網頁呈現資料
render()

// 訂閱render到store，這會讓store中如果有新的state(狀態)時，會重新呼叫一次render()
store.subscribe(render)

// 監聽事件到 "itemadd" 按鈕,
// 點按事件會觸發store dispatch Action(store發送動作)，例如
// store.dispatch({ type: 'ADD_ITEM', textValue })
document.getElementById('itemadd')
  .addEventListener('click', () => {
    const itemText = document.getElementById('itemtext')

    // flowtype檢查用的
    if (itemText instanceof HTMLInputElement) {
      // 呼叫store dispatch方法
      store.dispatch({ type: 'ADD_ITEM', text: itemText.value })

      // 清空文字輸入框中的字
      itemText.value = ''
    }
  })
