import React from 'react'
import TodoList from './TodoList'

class App extends React.Component {
  render() {
    return <TodoList initText="開始輸入文字吧！" />
  }
}

// 輸出App模組
export default App
