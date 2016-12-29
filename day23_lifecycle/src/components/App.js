//@flow
import React, { Component } from 'react'
import TodoList from './TodoList'
import TodoItem from './TodoItem'
import TodoAddForm from './TodoAddForm'
import TodoEditForm from './TodoEditForm'
import TodoSearchForm from './TodoSearchForm'

//匯入Item物件靜態類型的定義
import type { Item, SortType } from '../definitions/TodoTypeDefinition.js'

//匯入css檔
import '../style/bootstrap.css'
import '../style/animate.css'

let keepSearchedItems: Array<Item> = []
let isSearching: boolean = false
let isFilteringOut: boolean = false

class App extends Component {
  // 預先定義state的結構
  state: {
    items: Array<Item>,
    sortType: SortType,
  }

  //建構式
  constructor() {
    super()

    this.state = {
      items: [],
      sortType: ''
    }
  }

  componentDidMount() {
    // 元件"已經"載入，所以可以載入資料進來
    this.handleServerItemsLoad()
  }

  handleServerItemsLoad = () => {
    fetch('http://localhost:5555/items?_sort=id&_order=DESC', {
      method: 'GET'
      })
      .then((response) => {
        //ok 代表狀態碼在範圍 200-299
        if (!response.ok) throw new Error(response.statusText)
        return response.json()
      })
      .then((itemList) => {

         //加入{ isEditing: false }屬性
         const items = itemList.map((item) => {
           return Object.assign({}, item, { isEditing: false })
         })

        //載入資料，重新渲染
        this.setState({
          items,
        })
      })
      .catch((error) => {
        //這裡可以顯示一些訊息
        //console.error(error)
      })
  }

  handleServerItemAdd = (aItem: Item) => {
    //處理payload，不需要isEditing欄位
    const { id, title, isCompleted } = aItem
    const payload = { id, title, isCompleted }

    //作POST
    fetch('http://localhost:5555/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
     })
      .then((response) => {
        //ok 代表狀態碼在範圍 200-299
        if (!response.ok) throw new Error(response.statusText)
        return response.json()
      })
      .then((item) => {
        //這裡可以顯示一些訊息，或是結束指示動畫…
        //console.log(item)
      })
      .catch((error) => {
        //這裡可以顯示一些訊息
        //console.error(error)
      })
  }

  handleServerItemUpdate = (aItem: Item) => {
    //處理payload，不需要isEditing欄位
    const { id, title, isCompleted } = aItem
    const payload = { id, title, isCompleted }

    //作PUT
    fetch(`http://localhost:5555/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
     })
      .then((response) => {
        //ok 代表狀態碼在範圍 200-299
        if (!response.ok) throw new Error(response.statusText)
        return response.json()
      })
      .then((item) => {
        //這裡可以顯示一些訊息，或是結束指示動畫…
        //console.log(item)
      })
      .catch((error) => {
        //console.error(error)
      })
  }

  handleItemAdd = (aItem: Item) => {
    //觸發排序回復不排序
    this.handleItemSort('')

    //加入新的項目到最前面
    //此處有變動
    const newItems = [aItem, ...this.state.items ]

    //加入新資料到資料庫
    this.handleServerItemAdd(aItem)

    //按下enter後，加到列表項目中並清空輸入框
    this.setState({
      items: newItems,
    })
  }

  //處理樣式變化其中一個陣列中成員的方法
  handleStylingItem = (index: number) => {
    //觸發排序回復不排序
    this.handleItemSort('')

    //拷貝一個新陣列
    const newItems = [...this.state.items]

    //切換isCompleted的布林值
    newItems[index].isCompleted = !newItems[index].isCompleted

    //更新某一筆資料
    this.handleServerItemUpdate(newItems[index])

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }

  //處理其中一個陣列中成員變為編輯中的方法
  handleEditItem = (index: number) => {
    //拷貝一個新陣列
    const newItems = [...this.state.items]

    //切換isEditing的布林值
    newItems[index].isEditing = !newItems[index].isEditing

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }

  //處理其中一個陣列中成員編輯完後更新的方法
  handleEditItemUpdate = (index: number, title: string) => {
    //觸發排序回復不排序
    this.handleItemSort('')

    //拷貝一個新陣列
    const newItems = [...this.state.items]

    //項目的標題指定為傳入參數，更新標題
    newItems[index].title = title

    //切換isEditing的布林值
    newItems[index].isEditing = !newItems[index].isEditing

    //更新某一筆資料
    this.handleServerItemUpdate(newItems[index])

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }

  //處理搜尋所有項目的方法
  handleItemSearch = (searchword: string) => {
    //觸發排序回復不排序
    this.handleItemSort('')

    // 一開始先拷貝目前在state中的items到陣列中，保存所有的items
    // 並設定isSearching為true，表示正準備搜尋
    if(!isSearching) {
      isSearching = true
      keepSearchedItems = [...this.state.items]
    }

    // 當還在搜尋(isSearching為true)時，如果searchword是空字串，代表使用者已經把文字框清空了
    // 準備回復原先的列表資料情況，並設定(isSearching為false)
    if(isSearching && searchword === '') {
      isSearching = false

      this.setState({
        items: keepSearchedItems,
      })

    } else {
      //過濾(搜尋)一律從原本的items資料中搜尋，也就是keepSearchedItems中的值
      const newItems  = keepSearchedItems.filter((item) => (
          item.title.includes(searchword)
      ))

      //整個陣列重新更新
      this.setState({
        items: newItems,
      })
    }
  }

  //處理切換過濾是否要顯示已完成項目
  handleItemFilter = () => {

     //isFilteringOut是在這個模組的作用域變數
     isFilteringOut = !isFilteringOut

     const newItems = [...this.state.items]

      //整個陣列重新更新
      this.setState({
        items: newItems,
      })
  }

   //處理排序所有項目的方法
  handleItemSort = (sortType: SortType) => {

      let newItems = [...this.state.items]

      if(sortType === 'asc') {
        //按筆劃從少到多排序
        newItems = newItems.sort((a, b) => (
            a.title.localeCompare(b.title, 'zh-Hans-TW-u-co-stroke')
          )
        )
      }

      if(sortType === 'desc') {
        //按筆劃從多到少排序
        newItems = newItems.sort((a, b) => (
            b.title.localeCompare(a.title, 'zh-Hans-TW-u-co-stroke')
          )
        )
      }

      this.setState({
            items: newItems,
            sortType
        })
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="panel panel-warning">
            <div className="panel-heading">
              <h3 className="panel-title">TodoApp</h3>
            </div>
            <div className="panel-body">
              <TodoAddForm placeholderText="項目文字寫在這，按Enter鍵可以加入列表中" onItemAdd={this.handleItemAdd} />
              <TodoSearchForm placeholderText="搜尋" onItemSearch={this.handleItemSearch} />
              <TodoList onItemFilter={this.handleItemFilter} onItemSort={this.handleItemSort} sortType={this.state.sortType}>
                {
                  this.state.items.map((item, index) => {
                      if(isFilteringOut && item.isCompleted){
                        return null
                      }
                      return  (
                        (item.isEditing)
                        ? <TodoEditForm
                            key={item.id}
                            title={item.title}
                            onItemUpdate={(title) => { this.handleEditItemUpdate(index, title) }}
                          />
                        : <TodoItem
                            key={item.id}
                            isCompleted={item.isCompleted}
                            title={item.title}
                            onItemDoubleClick={() => { this.handleEditItem(index) }}
                            onItemClick={() => { this.handleStylingItem(index) }}
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

// 輸出App模組
export default App
