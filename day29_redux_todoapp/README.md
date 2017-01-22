# Redux篇: TodoApp改用Redux整合

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day29_redux_todoapp/asset/intro.png)

今天的主題是在Redux中的最後一篇，我們將把之前React篇最後完成的TodoApp，改用Redux來管理應用程式領域的狀態。

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day29_redux_todoapp/)，所有的程式碼也在裡面。

## 程式碼說明

我們要使用的是原本在React篇中的create-react-app工具建立的專案，所以要額外安裝Redux, react-redux這2個套件。命令列如下:

```
npm i --save redux react-redux
```

json-server的資料庫，使用的是之前React篇最後的那個範例資料庫。

這個新的範例程式，已經是一個完整的TodoApp加上Redux的架構，首先整個應用程式的檔案結構要作改變，像下面這樣:

```
src
├── actions
│   └── items.js
├── components
│   ├── App.js
│   ├── TodoAddForm.js
│   ├── TodoEditForm.js
│   ├── TodoItem.js
│   ├── TodoList.js
│   └── TodoSearchForm.js
├── constants
│   └── actionTypes.js
├── definitions
│   └── TodoTypeDefinition.js
├── index.js
├── middlewares
│   ├── addItem.js
│   ├── fetchItems.js
│   ├── index.js
│   └── updateItem.js
├── reducers
│   ├── filterOut.js
│   ├── index.js
│   ├── items.js
│   ├── searchedKeyword.js
│   └── sortType.js
└── style
    ├── animate.css
    ├── bootstrap.css
    └── styles.js
```

分別建立新的幾個目錄，來存放這些不同功能的程式碼檔案:

- actions: 集中所有的Action Creators
- constants: 集中所有的Action Types(類型)的常數定義
- middlewares: 集中所有的自己寫的middlewares，如果有用redux-thunk，這個目錄就不需要，直接寫在Action Creators
- reducers: 集中所有的reducers

要這樣區分是為了讓整個應用的架構更佳清楚，當然元件的部份還可以再區分出呈現用(Presentational)與容器(Container)元件，這小型的應用就分不了這麼細，你可以參考[官網的說明](http://redux.js.org/docs/basics/UsageWithReact.html)。

與之前一樣，我們要先從reducer看起，reducer是Redux架構的核心，這一點你一定要記住。

這個應用中已經有4個reducer，實際上它們裡面的程式碼都很少，可以合在一個檔案中，這裡這樣作是要讓你理解在多個reducers該如何整合在一起。拆成4個即在store中，會有4個狀態值要分別不同記錄，它們分別是:

- items: 類型是`Array<Item>`，包含所有的待辦項目的陣列
- filterOut: 類型是`{isFilteringOut: boolean}`，是只有一個屬性布林值的物件，用於記錄是否要列出已完成項目
- searchedKeyword: 類型是`{ keyword: string }`，是只有一個屬性字串值的物件，用於記錄目前搜尋的字串值
- sortType: 類型是`{ direction: string }`，是只有一個屬性字串值的物件，用於記錄目前的排序方向

除了items這個reducer會比較複雜些，其他三個其實程式碼都差不多，先看items這個reducr，程式碼如下:

> /reducers/items.js

```js
// @flow
import {
  ADD_ITEM,
  UPDATE_ITEM,
  INIT_ITEMS
} from '../constants/actionTypes'

//匯入項目的靜態定義，使用import type
import type { Item } from '../definitions/TodoTypeDefinition.js'

export default function items(state: Array<Item> = [], action: Object) {
  switch (action.type) {
    case ADD_ITEM:
      {
        //payload: Item

        return [action.payload, ...state]
      }

    case UPDATE_ITEM:
      {
        //payload: Item

        // 複製一個新的items陣列
        const newItems = [...state]

        // 尋找符合action.id的陣列中item索引值
        const index = newItems.findIndex((item) => item.id === action.payload.id)

        // TODO: 錯誤處理
        // 沒找到直接回傳state
        if(index === -1 ) return newItems

        // 用action.payload取代掉這個陣列成員值
        newItems[index] = action.payload

        return newItems
      }

    case INIT_ITEMS:
      {
        //payload: Array<Item>
        return [...action.payload]
      }

    default:
      return state
  }
}
```

只有三個Action會到這個item的reducer中處理，分別是`ADD_ITEM`, `UPDATE_ITEM`, `INIT_ITEMS`，這在之前的範例都相同，多出來的一個叫`UPDATE_ITEM`，它是更新某個項目中狀態用的，這裡的程式碼採用了傳入項目的`id`，不傳入陣列索引值的方式，用項目的`id`來尋找它的陣列索引值。另一個比較特別的是，所有動作都統一用`payload`名稱，當作傳入後要處理的值，你可以看到我有標記出payload的類型格式是什麼。

再來是有關錯誤處理的部份，這個新的TodoApp與伺服器間的連線，有三個情況:

- 一開始載入畫面時: 送出GET，從伺服器獲取目前資料庫的所有資料
- 新增某個項目時: 送出POST
- 更新某個項目時: 送出PUT

所有有關這些動作時，會先作完伺服器更新後，才會接著作在Redux中的store的更新。也就是說如果你的資料流程中，與伺服器的更新必定要考量到失敗的情況，雖然在這個範例中並沒有考量太多，但在實際的應用開發時，一定是要作這段的考慮與撰寫對應的程式碼。

其它的三個reducers就很簡單，舉sortType這個來看，程式碼如下:

> reducers/sortType.js

```js
// @flow
import { SORT_ITEMS } from '../constants/actionTypes'

export default function sortType(state: { direction: string } = { direction: 'no' }, action: Object) {
  switch (action.type) {
    case SORT_ITEMS:
      {
        return Object.assign({}, {direction: action.payload.direction})
      }

    default:
      return state
  }
}
```

都是這樣而已，它們都得到一個從`action.payload`的值，然後更動原先的物件中的屬性而已。

看過了reducers，接著要看store建立的部份，這也是從之前的範例的下個步驟。store會在最上層的元件中建立，檔案是index.js這個，程式碼如下:

> index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

// reducers可以一次匯入用解構的組合
import * as reducers from './reducers'

// 注意: 要一個一個匯入，因為是各自獨立不同的函式傳入參數
import { fetchItems, addItem, updateItem } from './middlewares'

import App from './components/App'

// @reducer
//
// 這裡作合併reducer的動作
// const reducer = combineReducers({
//    searchedKeyword, filterOut, sortType, items
// })
const reducer = combineReducers({
   ...reducers
})

// @store
//
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(reducer, applyMiddleware())
const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(fetchItems, addItem, updateItem))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
```

這個index.js檔案中，要注意的是有關使用多個reducers與middlewares的語法，這兩個一個是使用`combineReducers`方法傳入一個物件值來合併，另一個是用`applyMiddleware`傳入多個函式值參數，這個地方要特別注意一下。

reducers的合併是這個語法:

```js
// reducers可以一次匯入用解構的組合
import * as reducers from './reducers'

const reducer = combineReducers({
   ...reducers
})
```

middlewares的套用是這個語法:

```js
// 注意: 要一個一個匯入，因為是各自獨立不同的函式傳入參數
import { fetchItems, addItem, updateItem } from './middlewares'

const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(fetchItems, addItem, updateItem))
```

你應該有注意到在reducers資料夾與middlewares資料夾，都各有一個index.js檔案，它們的作用只是集合所有資料底下的多個reducers或middlewares檔案，然後方便你匯入用的，像在reducers資料夾中的index.js的程式碼像下面這樣，只是集中再轉輸出這樣而已:

```js
import items from './items'
import searchedKeyword from './searchedKeyword'
import sortType from './sortType'
import filterOut from './filterOut'

export {
  items,
  searchedKeyword,
  sortType,
  filterOut
}
```

其他的store與React元件的整合部份，與上一章都一樣，就省略不說了。

接著來看Action Creators的部份，在actions資料夾中只有一個items.js檔案，這裡反而我把它們都集中在一個檔案中，雖然也是可以分出不同的檔案，分出後的用法會像上面說的reducers的匯入與使用很像。items.js的程式碼如下:

```js
// @flow

import {
  ADD_ITEM,
  UPDATE_ITEM,
  FETCH_LOAD_ITEMS,
  FETCH_ADD_ITEM,
  FETCH_UPDATE_ITEM,
  INIT_ITEMS,
  TOGGLE_FILTER,
  SEARCH_ITEMS,
  SORT_ITEMS
} from '../constants/actionTypes'

//匯入項目的靜態定義，使用import type
import type { Item } from '../definitions/TodoTypeDefinition.js'

// 處理把所有項目的更新，
// 接著onFecthLoadItems之後執行，
// 到reducer去
export const onInitData = (items: Array<Object>) => (
  {
    type: INIT_ITEMS,
    payload: items
  }
)

// 處理把項目的新增，
// 接著onFecthAddItem之後執行，
// 到reducer去
export const onItemAdd = (payload: Item) => (
  { type: ADD_ITEM,
    payload
  }
)

// 處理把項目的更新，
// 接著onFecthUpdateItem之後執行，
// 到reducer去
export const onItemUpdate = (payload: Item) => (
  { type: UPDATE_ITEM,
    payload
  }
)

// 處理把項目的isEditing改為true
// 實際上的action.type為`UPDATE_ITEM`，
// 不需要經過伺服器，
// 所以直接到reducer
export const onItemEdit = (payload: Item) => (
  { type: UPDATE_ITEM,
    payload
  }
)

// 處理搜尋
export const onItemSearch = (payload: { keyword: string}) => (
  { type: SEARCH_ITEMS,
    payload
  }
)

// 處理排序
export const onItemSort = (payload: { direction: string}) => (
  { type: SORT_ITEMS,
    payload
  }
)

// 處理過濾是否顯示已完成項目，
// 沒有payload，只是要切換布林值
export const onItemFilterOut = () => (
  { type: TOGGLE_FILTER }
)

// 處理到伺服器上獲取資料，
// GET method
// 真正的執行程式碼在middlewares/fetchItems.js裡，
// 執行後會回呼cb函式
export const onFecthLoadItems = () => (
  {
    type: FETCH_LOAD_ITEMS,
    cb: (response: Array<Item>, dispatch: Function) => dispatch(onInitData(response)),
  }
)

// 處理到伺服器上新增一筆資料，
// POST method
// 真正的執行程式碼在middlewares/addItem.js裡，
// 執行後會回呼cb函式
export const onFecthAddItem = (payload: Item) => (
    {
      type: FETCH_ADD_ITEM,
      payload,
      cb: (response: Item, dispatch: Function) => dispatch(onItemAdd(response)),
    }
  )

// 處理到伺服器上更動一筆資料，
// PUT method
// 真正的執行程式碼在middlewares/updateItem.js裡，
// 執行後會回呼cb函式
export const onFecthUpdateItem = (payload: Item) => (
  {
    type: FETCH_UPDATE_ITEM,
    payload,
    cb: (response: Item, dispatch: Function) => dispatch(onItemUpdate(response)),
  }
)
```

所有動作都要在這裡處理，也就是這個TodoApp中一共有9種動作，這些Action Creators將會在元件裡的不同地方被呼叫使用，所以這些動作你應該要在設計應用時，就先考慮到。

後面三個`onFecthLoadItems`、`onFecthAddItem`、`onFecthUpdateItem`都是對應到middlewares中的三個程式碼檔案，它們彼此之間的串接，靠的就是動作的類型(action.type)而已，這在上一章有看到，cb(回調、回呼函式)都會另外再對應到這個檔案的其它三個動作，分別是`onInitData`、`onItemAdd`、`onItemUpdate`，名稱有可能我沒有太嚴格調整，大概能先明白是什麼意思就行。

三個middlewares我們只挑一個來看，實際上它們裡面都是TodoApp之前在App元件裡的處理方法裡面的程式碼，以下是fetchItems.js的程式碼:

> /middlewares/fetchItems.js

```js
// @flow

import { FETCH_LOAD_ITEMS } from '../constants/actionTypes'

const fetchItems = (store: any) => (next: any) => (action: Object) => {

  if (action.type !== FETCH_LOAD_ITEMS) return next(action)

  // 這是獲取伺服器上的資料的fetch語法，
  // 注意最後會執行action.cb(json, store.dispatch)
  // 也就是onFecthData中的cb屬性
  fetch('http://localhost:5555/items?_sort=id&_order=DESC', {
  method: 'GET'
  })
  .then((response) => {
    //ok 代表狀態碼在範圍 200-299
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(itemList => {
    // store.items與資料庫上的items記錄並不統一，
    // 少一個isEditing屬性，
    // 加入{ isEditing: false }屬性
     const items = itemList.map((item) => {
       return Object.assign({}, item, { isEditing: false })
     })

    return action.cb(items, store.dispatch)
  })
  .catch((error) => { throw new Error(error.message) })
}

export default fetchItems
```

最後的處理都會考量到在store中的狀態值，可能與資料庫不同的情況，這是有可能在真實開發時，要特別注意的地方。例如你要作使用者登入驗証，總不可能傳帳號密碼資料到伺服器認証完，之後還一直把帳號密碼記錄在網頁上的應用程式上，當然這是一個特例，有些資料只需要用在網頁的應用上而已。

接著來看TodoApp中的元件的改變，因為TodoApp中的功能還滿多的，所以來看功能比較單純的TodoAddForm元件，程式碼如下:

> components/TodoAddForm.js

```js
//@flow
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onFecthAddItem } from '../actions/items'

//匯入Props靜態類型的定義
import type { TodoAddFormProps } from '../definitions/TodoTypeDefinition.js'

const TodoAddForm = ({ placeholderText, onFecthAddItem }: TodoAddFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  return (
    <div>
      <input
        className="form-control"
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onKeyPress={(e) => {
          if (titleField.value.trim()
              && e.target instanceof HTMLInputElement
              && e.key === 'Enter') {

            //加入到items陣列中(state)
            onFecthAddItem({
              id: +new Date(),
              title: titleField.value,
              isCompleted: false,
              isEditing: false,
            })

            //清空文字輸入框
            titleField.value = ''
          }
        }
      }
      />
    </div>
  )
}

// 準備綁定用的DispatchToProps方法，
// 只需要onFecthAddItem這個方法
const mapDispatchToProps = (dispatch) =>(
  bindActionCreators({ onFecthAddItem }, dispatch)
)

//匯出TodoAddForm模組
//這個元件中不需要store中的狀態值
export default connect(null, mapDispatchToProps)(TodoAddForm)
```

這個程式的主要部份與之前的TodoApp都差不多，唯一的差異是不需要再從上層元件用props傳遞新增項目的方法過來，而是改用綁定Redux的作法。

這個TodoAddForm只需要送出要新增的項目資料給Redux，不需要把store中的items或其它狀態值綁到props上，所以只需要像下面的綁定語法:

```js
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { onFecthAddItem } from '../actions/items'

//...

// 準備綁定用的DispatchToProps方法，
// 只需要onFecthAddItem這個方法
const mapDispatchToProps = (dispatch) =>(
  bindActionCreators({ onFecthAddItem }, dispatch)
)

//匯出TodoAddForm模組
//這個元件中不需要store中的狀態值
export default connect(null, mapDispatchToProps)(TodoAddForm)
```

這個`bindActionCreators`是Redux的套件中的可以對Action Creators作部分綁定用的方法，使用的方式就是在匯入時只匯入要進定綁定的到這個元件的Action Creators，然後用這個方法在`mapDispatchToProps`函式中。上面的程式碼你應該看得很清楚，不是每個元件都一定要綁定全部的Action Creators，或是一定要綁定store的狀態值。

元件中的觸發事件後，執行的方式也有改變，程式碼如下:

```js
//加入到items陣列中(state)
onFecthAddItem({
  id: +new Date(),
  title: titleField.value,
  isCompleted: false,
  isEditing: false,
})
```

這與之前在TodoApp的作法差不多，只是這個`onFecthAddItem`現在是個在Redux個Action Creator，之前是在上層元件中的處理方法。

接著來看`TodoItem`元件，它裡面有兩個觸發的事件，一個是雙點按會改為`TodoEditForm`元件，也就是項目的`isEditing`屬性會變為true值，另一個是勾選盒勾選後，項目會變色，也就是項目的`isCompleted`屬性會切換。

這個`TodoItem`元件的整個程式碼我就不貼了，只講重點的部份，首先看它也是用部份綁定的語法，同樣也不需要store上的狀態值，而isCompleted這個值要用於樣式的改變，是從上層的App元件用props直接傳入:

```js
// 準備綁定用的DispatchToProps方法，
// 只需要onItemEdit與onFecthUpdateItem這個方法
const mapDispatchToProps= (dispatch) => (
  bindActionCreators({ onItemEdit, onFecthUpdateItem }, dispatch)
)

// 匯出TodoItem模組，
// 這個元件中不需要store中的狀態值，
// 因為都從上層元件傳遞到props來了
export default connect(null, mapDispatchToProps)(TodoItem)
```

再來是雙點按事件處理與勾選盒處理的函式，程式碼如下:

```js
onDoubleClick={() => {
  // 項目的isEditing值為true
  onItemEdit({
    id,
    title,
    isCompleted,
    isEditing: true
  })
}}

//
onClick={() => {
  // 切換項目的isCompleted
  onFecthUpdateItem({
    id,
    title,
    isCompleted: !isCompleted,
    isEditing: false
  })
}}
```

這兩個處理方法實在很像，但要注意的是雙點按並不會更動到資料庫的資料，資料庫上沒記錄這個`isEditing`，只有store中的狀態值才有。

這兩個對應到Action Creators實際有三個函式，多出來的那個是到伺服器上更新完項目後，要送到reducer用的`onItemUpdate`函式，程式碼如下:

```js
// 處理把項目的更新，
// 接著onFecthUpdateItem之後執行，
// 到reducer去
export const onItemUpdate = (payload: Item) => (
  { type: UPDATE_ITEM,
    payload
  }
)

// 處理把項目的isEditing改為true
// 實際上的action.type為`UPDATE_ITEM`，
// 不需要經過伺服器，
// 所以直接到reducer
export const onItemEdit = (payload: Item) => (
  { type: UPDATE_ITEM,
    payload
  }
)

// 處理到伺服器上更動一筆資料，
// PUT method
// 真正的執行程式碼在middlewares/updateItem.js裡，
// 執行後會回呼cb函式
export const onFecthUpdateItem = (payload: Item) => (
  {
    type: FETCH_UPDATE_ITEM,
    payload,
    cb: (response: Item, dispatch: Function) => dispatch(onItemUpdate(response)),
  }
)
```

這裡最特別的是，`onItemUpdate`與`onItemEdit`都是用`UPDATE_ITEM`這個同一個動作，也就是在reducer上並沒有像編輯項目這樣的動作，只有更新項目動作而已，實際上它們可以合併為同一個Action Creator，會分開來寫只是為了要讓函式名稱分清楚它是作什麼用的而已。

TodoEditForm就不說了，它裡面只有使用`onFecthUpdateItem`這個方法而已。

接著是搜尋、過濾與排序功能，這三個動作的觸發分別是在`TodoList`與`TodoSearchForm`。

先講作法上的，這個新的範例的作法與之前的TodoApp的設計思路不同，它並沒有像之前用元件檔案中的模組作用域的一些變數來記錄現在是否搜尋中，或是先記錄當下的狀態值之類的，當時的作法只是展示一些不同的想法，實作出的簡單範例而已，當然有可能並不是最好的方式。

在搜尋、過濾與排序功能上，這個新的範例展示的是我認為較好的作法，它用的是在Redux中另外記錄應用程式搜尋關鍵字、排序方向的狀態值等等，用這些狀態值的改變，來促使React應用觸發重新渲染的行為，以此來改變呈現的樣子，這三個功能最後都只在App元件的render方法中處理，排序與搜尋是作在一起的，過濾則是在每個項目一個個輸出時處理，你可以看到在App元件的render方法，像下面的程式碼:

```js
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
```

這是在render方法中，在回傳(return)之前，先預作處理，有搜尋就處理搜尋，接著處理排序，最後得到的項目值，再去作過濾的動作，過濾的動作在項目一個個輸出時作，像下面的程式碼:

```js
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
```

所以，用這個方式，我們能對所有列表上的項目，既是過濾，又可以搜尋與排序，這三種行為都可以作得到。

其實在之前的TodoApp上也是作得到的，你也可以試試，之前的範例程式的作法是沒那麼理想的，而且當時的作法並沒有統一，現在這樣寫起來就很具統一性。

最後，這個很原本程式碼有些雜亂的App元件，它也不用再使用React的state特性，最前面的程式碼連建構式也不需要了，像下面這樣:

```js
class App extends Component {

  componentDidMount() {
    // 元件"已經"載入，所以可以載入資料進來
    this.props.onFecthLoadItems()
  }

  render() {
    //...
  }
}
```

它會還使用ES6類別元件，而不用函式型元件寫法改寫的唯一理由，是我們需要`componentDidMount`這個生命週期方法，在我們的應用一載入時就把伺服器的資料載入，也就是呼叫`onFecthLoadItems`這個Action Creator。

以上就是這個程式碼的說明，當然，它還有很多可以再改進的地方，例如改用redux-thunk或redux-saga這種更完善的middlewares套件。或是增加更多的功能，或是加上router的功能，本篇已經是最後一篇教學了，希望你已經真的能學習到一些React與Redux的入門知識了。

我留了一個功能給你實作出來，就是一直沒看到的`刪除項目`這個項目，除了在網頁畫面上的列表中刪除外，也要能從伺服器上刪除掉。另外，我其實也實作過一個功能，我覺得也滿有趣的，但它可能會比較有難度，就是幫每個項目多加一個`何時之前要完成`的時間欄位，而且可以倒數計時，這個功能很有挑戰性，如果你能動手下去作，相信可以學到滿多東西的。
