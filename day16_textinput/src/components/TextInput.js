// @flow
import React from 'react'
import TextShow from './TextShow'

type Props = {
  initText: string,
}

class TextInput extends React.Component {
    state: {
      text: string,
    }

    // 建構式
    constructor(props: Props) {
        // super是呼叫上層父類別的建構式
        super(props)

        // 設定初始的狀態。注意！這裡有個反樣式，不要用props的值來設定state的初始值
        this.state = {
            text: '',
        }

    }

    // 處理的方法，用e.target可以獲取到輸入框的值，用箭頭函式可以綁定`this`
    handleChange = (e: Event) => {
      // Flow會檢查必定要HTMLInputElement的物件才能有輸入值
      if (e.target instanceof HTMLInputElement) {
        this.setState({text: e.target.value})
      }
    }

    // 渲染方法，回傳React Element(元素)
    render() {
        return (
                 <div>
                  <input type="text"
                    value={this.state.text}
                    placeholder={this.props.initText}
                    onChange={this.handleChange}
                  />
                  <TextShow text={this.state.text}/>
                </div>
       )
    }
}

//加入props的資料類型驗証
TextInput.propTypes = {
  initText: React.PropTypes.string.isRequired
}

//匯出TextInput模組
export default TextInput
