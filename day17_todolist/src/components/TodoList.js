//@flow
import React from 'react'
import TodoItem from './TodoItem'

// 預先定義props的結構
type Props = {
  initText: string,
}

class TodoList extends React.Component {
    // 預先定義state的結構
    state: {
      items: Array<string>,
      inputValue: string,
    }
    //建構式
    constructor(props: Props) {
        //super是呼叫上層父類別的建構式
        super(props)

        //設定初始的狀態。注意！這裡有個反樣式。
        this.state = {
            items: [],
            inputValue:'',
        }
    }

    //處理的方法，用e.target可以獲取到輸入框的值，用箭頭函式可以綁定`this`
    //輸入文字時
    handleChange = (e: Event) => {
      if (e.target instanceof HTMLInputElement) {
        this.setState({
          inputValue: e.target.value,
        })
      }
    }

    //按下Enter時
    handleKeyPress = (e: KeyboardEvent) => {
      if(e.key === 'Enter' && e.target instanceof HTMLInputElement){
          const newItems = [e.target.value, ...this.state.items ]

          //按下enter後，加到列表項目中並清空輸入框
          this.setState({
            items: newItems,
            inputValue: '',
          })
      }
    }

    //處理移除掉其中一個陣列中成員的方法
    handleRemoveItem = (index: number) => {
      const oldItems = this.state.items

      //從陣列中移除一個index的成員的純粹函式
      const newItems = oldItems.slice(0,index).concat(oldItems.slice(index+1))

      //整個陣列重新更新
      this.setState({
        items: newItems,
      })
    }

    //渲染方法，回傳React Element(元素)
    render() {
        return (
              <div>
                <input type="text"
                  value={this.state.inputValue}
                  placeholder={this.props.initText}
                  onKeyPress={this.handleKeyPress}
                  onChange={this.handleChange}
                />
                <ul>
                {
                  this.state.items.map((value, index) => {
                    return <TodoItem key={index} text={value} index={index} onItemClick={this.handleRemoveItem}/>
                  })
                }
                </ul>
               </div>
        )
    }
}

//加入props的資料類型驗証
TodoList.propTypes = {
  initText: React.PropTypes.string.isRequired,
}

//匯出TextInput模組
export default TodoList
