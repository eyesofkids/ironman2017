//@flow
import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onFecthLoadItems } from '../actions/items'

import TodoList from './TodoList'
import TodoItem from './TodoItem'
import TodoAddForm from './TodoAddForm'
import TodoEditForm from './TodoEditForm'
import TodoSearchForm from './TodoSearchForm'

// 匯入css檔
import '../style/bootstrap.css'
import '../style/animate.css'

class App extends Component {

  componentDidMount() {
    // 元件"已經"載入，所以可以載入資料進來
    this.props.onFecthLoadItems()
  }

  render() {

    // 這裡作搜尋(Search)功能
    let itemList = (this.props.searchedKeyword.trim())
    ? this.props.items.filter((item) => (
        item.title.includes(this.props.searchedKeyword)
    ))
    : this.props.items

    // 這裡作排序(Sort)功能
    switch(this.props.sortType){
      case 'asc': {
        //按筆劃從少到多排序
        itemList = itemList.sort((a, b) => (
            a.title.localeCompare(b.title, 'zh-Hans-TW-u-co-stroke')
          )
        )
        break
      }

      case 'desc': {
        //按筆劃從多到少排序
        itemList = itemList.sort((a, b) => (
            b.title.localeCompare(a.title, 'zh-Hans-TW-u-co-stroke')
          )
        )
        break
      }

      default: {
        //按id排序，即時間
        itemList = itemList.sort((a, b) => (
            b.id - a.id
          )
        )
        break
      }
    }

    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="panel panel-warning">
            <div className="panel-heading">
              <h3 className="panel-title">TodoApp with Redux</h3>
            </div>
            <div className="panel-body">
              <TodoAddForm placeholderText="項目文字寫在這，按Enter鍵可以加入列表中" />
              <TodoSearchForm placeholderText="搜尋"  />
              <TodoList>
                {
                  itemList.map((item, index) => {
                      // 這裡作過濾(Fliter)功能，控制顯示或不顯示已完成項目
                      if(this.props.isFilteringOut && item.isCompleted){
                        return null
                      }
                      return  (
                        (item.isEditing)
                        ? <TodoEditForm
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            isCompleted={item.isCompleted}
                          />
                        : <TodoItem
                            key={item.id}
                            id={item.id}
                            isCompleted={item.isCompleted}
                            title={item.title}
                          />
                      )
                    }
                  )
                }
              </TodoList>
            </div>
            <div className="panel-footer">雙點擊項目可以進行編輯，按下Enter後儲存</div>
          </div>
        </div>
      </div>
    )
  }
}

// 準備綁定用的mapStateToProps方法，
// 將store中的items屬性綁到這個元件的props.items屬性上
const mapStateToProps = store => ({
  items: store.items,
  isFilteringOut: store.filterOut.isFilteringOut,
  searchedKeyword: store.searchedKeyword.keyword,
  sortType: store.sortType.direction,
 })

 // 準備綁定用的DispatchToProps方法，
 // 只需要onFecthLoadItems這個方法
 const mapDispatchToProps = (dispatch) =>(
   bindActionCreators({ onFecthLoadItems }, dispatch)
 )

// 連接Redux store
export default connect(mapStateToProps, mapDispatchToProps)(App)
