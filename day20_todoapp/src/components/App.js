//@flow
import React, { Component } from 'react'
import TodoList from './TodoList'
import TodoItem from './TodoItem'
import TodoAddForm from './TodoAddForm'

//匯入item靜態類型的定義
import type { Item } from '../definitions/TodoTypeDefinition.js'

//匯入樣式
import styles from '../style/styles.js'

class App extends Component {
  // 預先定義state的結構
  state: {
    items: Array<Item>,
  }

  //建構式
  constructor() {
    super()

    this.state = {
      items: [],
    }
  }

  handleItemAdd = (aItem: Item) => {
    //加入新的項目到最前面
    //此處有變動
    const newItems = [aItem, ...this.state.items ]

    //按下enter後，加到列表項目中並清空輸入框
    this.setState({
      items: newItems,
    })
  }

  //處理樣式變化其中一個陣列中成員的方法
  handleStylingItem = (index: number) => {
    //拷貝一個新陣列
    const newItems = [...this.state.items]

    //切換isCompleted的布林值
    newItems[index].isCompleted = !newItems[index].isCompleted

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }

  render() {
    return (
      <div>
        <TodoAddForm placeholderText="開始輸入一些文字吧" onItemAdd={this.handleItemAdd} />
        <TodoList>
        {
          this.state.items.map((item, index) => (
              <TodoItem
                key={item.id}
                style={item.isCompleted? styles.itemCompleted: styles.itemNormal}
                title={item.title}
                onItemClick={() => { this.handleStylingItem(index) }}
              />
            )
          )
        }
        </TodoList>
      </div>
    )
  }
}

// 輸出App模組
export default App
