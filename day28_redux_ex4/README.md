# Redux篇: 使用middleware(中介軟體)處理異步動作

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day28_redux_ex4/asset/intro.png)

今天的主題是在Redux中處理副作用，我們要使用的是一個稱為`middleware`(中介軟體)的技巧來作，這在Redux裡就有內建這個設計了。以目前來說，`middleware`(中介軟體)是最簡單的一種解決在Redux中副作用問題的方式，也有很多這種`middleware`套件，不過在這個例子中並沒有使用像Redux作者開發的[redux-thunk](https://github.com/gaearon/redux-thunk)套件，我把它放在補充說明裡。

這個程式最後的呈現結果，就像下面的動態圖片這樣:

![Redux範例一展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day28_redux_ex4/asset/day28_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day28_redux_ex4/)，所有的程式碼也在裡面。

## 程式碼說明

一樣是繼續使用上一章接著用下來的ES6的樣版文件[webpack-es6-startkit](https://github.com/eyesofkids/webpack-es6-startkit)。

如同之前的[React這篇](https://github.com/eyesofkids/ironman2017/tree/master/day23_lifecycle)中，我們一樣使用[json-server](https://github.com/typicode/json-server)在自己的電腦上另外啟動一個伺服器，作為獲取資料的伺服器之用，items.json是已經有一些資料的範例資料檔案，也有附在github的原始碼位置中，用下面的指令來啟動json-server:

```
json-server --watch --port 5555 items.json
```

如果正確啟動json-server，你應該可以在瀏覽器網址上輸入`http://localhost:5555/items/`，正常看到這幾筆範例資料。

今天的範例中，實際上對之前的`MyComponent`元件有進行改造的作業，把它切成兩個小元件，分別是用於輸入項目的`ItemInput`與顯示每個項目的`ItemList`，然後在`MyComponent`元件只是作組合的，這部份主要是為了要展示Redux store在進行綁定時，用不同的傳入參數的彈性作法。

index.html檔案沒變，就略過不說了。

一樣我們先從reducer來看，下面這是新的reducer程式碼:

> reducer.js

```js
import { combineReducers } from 'redux'
import { ADD_ITEM, DEL_ITEM, INIT_ITEMS } from './actionTypes'

function items(state = [], action) {
  switch (action.type) {
    case ADD_ITEM:
      {
        return [{
          id: action.id,
          text: action.text,
        }, ...state]
      }

    case DEL_ITEM:
      {
        return state.filter(item => item.id !== action.id)
      }

    case INIT_ITEMS:
      {
        return [...action.items]
      }

    default:
      return state
  }
}

const itemApp = combineReducers({ items })

export default itemApp
```

這個reducer與前一個的範例的差異只有多一個`INIT_ITEMS`的Action(動作)情況，它是要在從伺服器上獲取資料後，初始化store中的items記錄用的，這個名稱可能不是太好，或許取名叫`LOAD_ITEMS`也可以。

另一個明顯的改進作法，是把所有的Action Type(動作類型)，全部都轉為常數字串值，也就是變為常數，但是裡面指定的是原來的字串值。這個常數的定義放在actionTypes.js這檔案，程式碼其實簡單到不行:

> actionTypes.js

```js
export const ADD_ITEM = 'ADD_ITEM'
export const DEL_ITEM = 'DEL_ITEM'
export const FETCH_ITEMS = 'FETCH_ITEMS'
export const INIT_ITEMS = 'INIT_ITEMS'
```

你可能會問，這樣作是有什麼用處？或是這樣作是在搞笑嗎？

會這樣作是有原因的，而且它是一種改進的作法，我在本章的下面有附它的說明，先簡單的說一下主要的原因:

> 因為單純的字串值是不會作任何檢查的，以簡單的例子來說明，假設現在有一個動作類型應該是`'ADD_TODOITEM'`這個字串值，在動作生成器(Action Creator)或reducer中，打錯這個字串像`'ADD_TODO_ITEM'`，當你在開發與執行時，系統都不會有錯誤的訊息，只是不會如預期的執行結果。但是如果是個常數則會檢查，錯了也有錯誤訊息。

接著來看建立store的部份，你應該要養成習慣了，我們從一開始的Redux範例到這一章，其實我的解說順序就應該是撰寫程式碼的大致上的順序，你如果要看一支用Redux寫的程式，順序也是這樣來看，整體的思維才會清楚。架構型的函式庫或框架都有基本的套用或架構起來的步驟，如果你不按這個次序，那會理解得零亂組合不起來。

建立store的部份在index.js中，它也是React應用最上層的元件，程式碼如下:

> index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import itemApp from './reducer'
import MyComponent from './app'
import fetchMiddleware from './fetchmiddleware'

// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(dealItem, applyMiddleware(fetchMiddleware))
const store = createStore(itemApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(fetchMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <MyComponent />
  </Provider>,
  document.getElementById('root'))
```

`index.js`的更動部份有一個，第一個是它在匯入時，多從redux匯入[applyMiddleware](http://redux.js.org/docs/api/applyMiddleware.html)方法，以及匯入一個名稱為`fetchmiddleware`的模組，這個檔案是你自己要提供的。

第二個是它在建立store時，多加了一個傳入參數`applyMiddleware(fetchMiddleware)`，也就是說middleware(中介軟體)的套用，是在store一開始就需要套用的，這一個你一定要記得。

fetchMiddleware的程式碼也很簡單，像下面這樣:

> fetchMiddleware.js

```js
import { FETCH_ITEMS } from './actionTypes'

const fetchMiddleware = (store: any) => (next: any) => (action: Object) => {
  if (action.type !== FETCH_ITEMS) return next(action)

  // 這是獲取伺服器上的資料的fetch語法，
  // 注意最後會執行action.cb(json, store.dispatch)
  // 也就是onFecthData中的cb屬性
  fetch('http://localhost:5555/items/')
  .then(response => response.json())
  .then(json => action.cb(json, store.dispatch))
  .catch((err) => { throw new Error(err.message) })

}

export default fetchMiddleware
```

因為middleware(中介軟體)其實有基本的語法樣式，本章的後面有附說明，其實在簡單的情況下，你也不需要用什麼額外的套件，自己寫可能快一點，基本的樣式像下面這樣:

```js
const customMiddleware = store => next => action => {
  if(action.type !== 'custom') return next(action)
  // 這裡作你要作的事
}
```

這看起來可怕的三個肥箭頭，相當於下面這樣的寫法的簡寫法，它只是一種巢狀(內部)函式的寫法，是是一種閉包結構的實現，至於為什麼要這樣作，這與middleware的設計有關:

```js
const customMiddleware = function(store) {
  return function(next) {
    return function(action) {
      if(action.type !== 'custom') return next(action)

      action(next, store.getState) // invoke the action
    }
  }
}
```

middleware(中介軟體)的執行期間是介於`dispatch(action)`與最後執行`reducer`之間，而且可以執行多個middleware。也就是說，在最後真正把Action送到reducer前，middleware會先執行，處理完成再作送到reducer去，所以我們的程式在要從伺服器中獲取資料時，會像下面這樣的流程:

1. 使用者按下"從伺服器獲取資料"按鈕，觸發事件
2. 呼叫dispatch(發送)的動作類型為`FETCH_ITEMS`的動作，也就是執行`onFecthData`這個Action Creator(動作產生器)
3. dispatch呼叫`onFecthData`產生物件，Redux先經過middleware，fetchMiddleware裡有對`FETCH_ITEMS`的動作的處理函式，進行處理
4. fetchMiddleware結束執行，最後產生資料，呼叫dispatch(發送)的動作類型為`INIT_ITEMS`的Action Creator(動作產生器)`onInitData`
5. dispatch呼叫`onInitData`後產生物件，Redux最後送到reducer

所以接著我們來看actons.js這個檔案，這是所有Action Creators(動作產生器)的集中的地方，程式碼如下:

> actons.js

```js
import { ADD_ITEM, DEL_ITEM, FETCH_ITEMS, INIT_ITEMS } from './actionTypes'

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是payload
export const onItemAdd = (text: string) => (
  { type: ADD_ITEM,
    id: +new Date(),
    text,
  }
)

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是id
export const onItemDel = (id: number) => ({ type: DEL_ITEM, id })

// onInitData是初始化用的，這是準備要讓reducer重新載入store裡面的items值
export const onInitData = (items: Array<Object>) => ({ type: INIT_ITEMS, items })

// onFecthData是副作用函式，真正的執行程式碼在fetchMiddleware裡，執行後會到這個函式來
export const onFecthData = () => (
  {
    type: FETCH_ITEMS,
    cb: (response: Array<Object>, dispatch: Function) => dispatch(onInitData(response)),
  }
)
```

我把id值由時間物件產生這句`+new Date()`寫在這裡，Action Creator在Redux實際上並沒有要求一定要是純粹函式，只是如果你用了異步執行但沒有對應的middleware時會出現中斷錯誤，下面有更多說明。

這裡最特別的是`onFecthData`這個函式，它的`payload`是一個函式，不像其他的都是一個資料性質的屬性，這個`cb`的意思是callback(回調)函式的意思，意思是在fetchMiddleware中為`FETCH_ITEMS`動作處理完後，會回來呼叫這個cb函式，而且會帶處理完的值第一個傳入參數給它，第二個值是dispatch函式，這剛好就是對照fetchMiddleware中fetch的語句中的這一行:

```js
.then(json => action.cb(json, store.dispatch))
```

最後把json的資料作物件化後，用action.cb來執行。然後再呼叫到`dispatch(onInitData(response))`，最後再到reducer去把資料整個重新載入。這就是整個執行的過程式。

再來看React元件的部份，所有的React元件我都改為函式的寫法，因為都用不到生命週期方法，也不需要內部的state特性。app.js中是我們之前的`MyComponent`元件，程式碼如下:

> app.js

```js
import React from 'react'

import ItemList from './ItemList'
import ItemInput from './ItemInput'

const MyComponent = () => (
  <div>
    <ItemInput />
    <ItemList />
  </div>
)

export default MyComponent
```

`MyComponent`只是用來組合另外兩個元件用的，實際上它沒任何其他的功能，說實在可以在最上層組合元件就行了，寫出來只是讓你比較一下而已。

下面是ItemInput元件的程式碼:

> ItemInput.js

```js
import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './action'

const ItemInput = (props: any) => {
  // 給Flow檢查使用的
  let input: any = null

  // 解構賦值，把props裡的方法指定出來
  const { onItemAdd, onFecthData } = props

  return (
    <form onSubmit={(e: Event) => {
      e.preventDefault()
      if (!input.value.trim()) {
        return
      }
      // 執行Action Creator中的onItemAdd，
      // 相當於store.dispatch()執行ADD_ITEM的action
      onItemAdd(input.value)
      input.value = ''
    }}>
      <input ref={(node: any) => { input = node }} />
      <button type="submit">新增項目</button>
      <button onClick={() => onFecthData()} >從伺服器獲取資料</button>
    </form>
  )
}

// 連接Redux store
// 只需要綁定actionCreators中的方法即可，store中的項目值不需要
export default connect(null, actionCreators)(ItemInput)
```

這`ItemInput`元件，裡面用了之前在[React篇的TodoApp的改造作法](https://github.com/eyesofkids/ironman2017/tree/master/day20_todoapp)，如果有不懂之處可以看那篇的說明。

最特別的是新增項目不需要綁定Redux store的items裡來，因為`ItemInput`元件根本不需要知道現在的store裡的items值是怎麼樣的，只要管資料輸入然後發送新增項目的動作就可以了。除非你想要在輸入時作檢查，例如看看有沒有重覆標題的項目之類的，不然是不需要綁定store裡的items值到這個元件的props屬性上的。

也就是只要呼叫`export default connect(null, actionCreators)(ItemInput)`就行了，當然你也可以寫得更細些，例如我只需要actionCreators中的，與這個元件中需要用的方法，不需要全部都綁進props屬性來，這也是可以作得到的，react-redux中可以這樣設定，你可以再參考API文件中的說明。

另一個`ItemList`元件則是呈現項目列表，它裡面會用到幫每個項目加上勾選盒，然後發送onItemDel的動作，程式碼如下:

```js
import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './action'

const ItemList = (props: any) => {
  // 解構賦值，提取props中的items項目值，
  // 以及onItemDel方法
  const { items, onItemDel } = props

  return (
      <p>
        {
          items.map(item => (
            <li key={item.id}>
              <input
                type="checkbox"
                id={item.id}
                onClick={ () => onItemDel(item.id) }
              />
              {item.text}
            </li>
          ))
        }
      </p>
  )
}

// 準備綁定用的mapStateToProps方法，
// 將store中的items屬性綁到這個元件的props.items屬性上
const mapStateToProps = store => ({ items: store.items })

// 連接Redux store
export default connect(mapStateToProps, actionCreators)(ItemList)
```

`ItemList`就有綁定Redux store中的items值到元件的props上，不然怎麼知道要輸出什麼項目呢。

這分成兩個元件來寫，主要還是給你一些思考，不是每個元件都一定要綁定Redux store中的狀態值到元件的props上，也不是每個元件都需要所有的方法，而且在所有React應用的裡的所有下層(內層)元件，通通都可以作連接Redux store的動作，不過有些實在太小，功能只有顯示用的元件，可能也不需要與Redux store連接。一切的連接設定由你決定。

以上就是所有程式碼的解說。

---

## 其他補充資料

### 讓ESLint可以正確檢查React的JSX語法

在[webpack-es6-startkit](https://github.com/eyesofkids/webpack-es6-startkit)裡因為沒有先附[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)，所以ESLint檢查工具會無法正確檢查React中的JSX語法，這套件可以另外再裝，指令如下:

```
npm i eslint-plugin-react --save-dev
```

而`.eslintrc`的設定可再改成下面這樣，這個套件有內建的一些建議撰寫風格規則:Ｓ

```
{
  "parser": "babel-eslint",
  "extends": ["airbnb-base", "plugin:react/recommended"],
  "rules": {
    "semi": ["error", "never"]
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "import",
    "react"
  ]
}
```

改完記得重開你的編輯工具，這樣才會正常載入這個外掛。

### Action Creators(動作產生器)裡面可以允許副作用嗎？

在Redux篇的第一章中，最後我加了一個註解，原本是像下面這樣:

> 註: Action Creator在Redux中也是要求是個純粹函式。

後來我改成了這樣:

> 註: Action Creator在Redux中並沒有要求一定要是個純粹函式，只是不建議在裡面直接執行有副作用的函式，之後的章節會有說明。請參考這篇在stackoverflow的[Reduce作者的回答](http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34623840#34623840)。

那到底是可不可以在Action Creators(動作產生器)使用有副作用的不純粹函式？

如果要以我的看法，我認為是不行，原因是你用了異步執行或在某個Action Creator中呼叫另一個時，必會產生錯誤。你可以試試看在我們的範例中的Action Creators(動作產生器)執行一個異步的呼叫，例如setTimeout或Ajax之類的，你會得到一個中斷執行的錯誤訊息:

```js
Uncaught Error: Actions must be plain objects. Use custom middleware for async actions.
```

那問題來了，Redux作者在網路上的回答說沒要求。而Redux的官網文件，以前是說Action Creator要是個純粹函式，現在的官方文件中拿掉了。

這混亂的定義情況是怎麼回事？可以這樣寫了又改的嗎？

以前的官網文件會講"Action Creator要是個純粹函式"，這在Redux的開發中的議題討論中有一則，這被認為是個"無惡意的謊言"(white lies)。

我認為原因在於`middleware`，用了像redux-thunk後，你可以在Action Creators(動作產生器)隨你高興回傳異步執行的函式，不用這種`middleware`(中介軟體)的就不行。`middleware`的設計打破了Action Creator原本的限制，為了怕學習的開發者誤解，所以文件裡並沒有說Action Creator一定要純粹函式，但是在程式碼裡卻擋了一個中斷錯誤，當你沒用專門處理異步執行的`middleware`，阻止開發者直接在Action Creator使用異步執行的動作。

以我的看法，Action Creator是個灰色地帶，因為至今在Redux中有許多的解決異步執行的方式，像react-thunk這樣的`middleware`，它擴充了Action Creator中撰寫異步執行的能力，但執行是在react-thunk上，這種作法可能容易學習與使用，但有一個很大的壞處，就是不好測試。

> 註: 雖然在之前介紹副作用與純粹函式的章節中，我們有提到一些呼叫外部API(console.log)、時間(Date())、隨機(Math.random)也屬於有副作用的呼叫，但以等級來區分它們只算是"輕度"或"微量"的副作用，這些在reducer或Action Creators能不能用？答案是可以用但最好不要用。以真正在討論副作用的主題來說，異步執行才是"中度"或"一般"等級的副作用，我們談級副作用通常是指這個等級的。當然也有"重度"等級的副作用，那是另一個層次的特殊應用情況討論。

### ActionTypes使用字串常數

ActionTypes會先轉為常數定義，然後在Actoion Creater與reducer中再使用，這是現在通常的作法，像下面這樣的程式碼:

./actionTypes.js

```js
export const ADD_TODO = 'ADD_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const EDIT_TODO = 'EDIT_TODO';
```

./actions.js

```js
import { ADD_TODO } from './actionTypes';

export function addTodo(text) {
  return { type: ADD_TODO, text };
}
```

./reducer.js

```js
import { ADD_TODO } from './actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ];
    default:
      return state
  }
};
```

根據[dan_abramov](https://github.com/reactjs/redux/issues/628#issuecomment-137547668)在這個issue中的說明，作為常數的好處如下:

- 它可以幫助你保持命名的一致性，因為所有的動作類型(action type)都集中到同一個地方。
- 有時候你可能會想要很快理解在應用中有哪些動作。
- 維護一個列表，不論增加、移除或更動，可以讓每個人很容易追蹤。
- 可以很容易提醒你現在要使用的動作是不是有對應到目前有的動作類型。

實際上在使用時，因為字串值是不會作任何檢查的，以簡單的例子來說明，假設現在有一個動作類型應該是`'ADD_TODOITEM'`這個字串值，在動作生成器(Action Creator)或reducer中，打錯這個字串像`'ADD_TODO_ITEM'`，當你在開發與執行時，系統都不會有錯誤的訊息，只是不會如預期的執行結果。所以就算這個字串並是你要的，實際上也沒這個動作類型存在，你也要多花時間對照才找得出來錯在什麼地方。不過，如果你是用常數值就不是這樣了，檢查工具或執行時會直接出現警告訊息。這樣你應該很容易的理解，為什麼要多花時間作這層工夫。

### middleware(中介軟體)自訂開發簡單說明

`middleware`(中介軟體)是一種中介的應用或處理函式，redux在執行流程中可以插入這種函式，讓在最後輸出前進行額外的執行。`middleware`的執行期間是介於dispatch(action)與執行reducer之間，而且可以執行多個middleware。`middleware`的語法是函式連鎖的語法(實際上應該稱為部份函式partial function)，是一種閉包(Closure)的結構。

在這篇[簡易教學](https://reactjsnews.com/redux-middleware)中有講解如何寫出一個middleware，本章的fetchMiddleware就是參考這篇教學的。

middleware的基本語法樣式，if語句只是檢查是不是需要執行這個middleware的action而已:

```js
const customMiddleware = store => next => action => {
  if(action.type !== 'custom') return next(action)
  //這裡作你要作的事
}
```

如何套用在redux上，注意是套在`createStore`方法中作為第二參數，而且需要加上`applyMiddleware`方法:

```js
import { createStore, applyMiddleware, } from 'redux'
import reducer from './reducer'
import customMiddleware from './customMiddleware'

const store = createStore(
  reducer,
  applyMiddleware(customMiddleware)
)
```

使用上面的寫法寫出一個fetch資料的fetchMiddleware，程式碼如下(要先安裝whatwg-fetch):

fetchMiddleware.js

```js
import 'whatwg-fetch'

const fetchMiddleware = store => next => action => {
  if(action.type !== 'FETCH_ITEMS') return next(action)

  fetch('http://localhost:3000/sample.json')
  .then(response => response.json())
  .then(json => action.cb(json, store.dispatch))
  .catch((err) => { throw new Error(err.message) })
}

export default fetchMiddleware
```

重點在於最後的`action.cb(json, store.dispatch)`，可以讓對應的Action去呼叫另一個作為處理的Action，也就是`INIT_ITEMS`這個Action Creater寫法。

action.js

```js
export const onFecthData = () => ({ type: 'FETCH_ITEMS', cb: (response, dispatch) => dispatch(onInitData(response))})
export const onInitData = (items) => { return ( {type: 'INIT_ITEMS', items} ) }
```

在reducer中也有對應的處理程式碼，就是把從伺服器中的資料，整個取代原有的資料而已，這個語法很簡單:

reducer.js

```js
case 'INIT_ITEMS':
{
  return [...action.items]
}
```

### redux-thunk簡單說明

> thunk的中文翻譯是: 形式轉換

`Thunk`是一種包裝用的函式，是一種用於惰性求值(lazy/delay evaluation)的函式，也可以稱它為臨時函式。JavaScript中原本就有closure(閉包)的特性，將內部函式回傳後，仍然會記錄外部函式當時傳入的參數值，這個特性可以很好的應用在臨時函式中，而且，函式本身也是一種可作為值傳遞的或保存的資料類型。

```js
// 直接求值 1 + 2
// x === 3
let x = 1 + 2;

// 延時求值 1 + 2
// foo 可以之後再呼叫來執行計算
// foo 就是thunk!
let foo = () => 1 + 2;
```

[redux-thunk](https://github.com/gaearon/redux-thunk)讓你可以在Action Creator中回傳函式，在Redux限制中原本是只能回傳一般的物件(plain object)。可以用於延時(delay)dispatch一個動作，或是只在某些情況下才作dispatch。內部函式可以接收到store的dispatch方法與getState，作為它的傳入參數。redux-thunk是Redux作者所創造的專案，也就是最基本用於處理異步動作的套件，它在網路上教學也最多。

一個小小的實驗是用在之前的加入項目的action creator，把它改成延時執行的，在3秒後才會加入如下:

```js
export const onItemAdd = text => ({ type: 'ADD_ITEM', text })
```

加入一個onItemAddAsync在action.js中，然後改用這個action來加入項目，程式碼如下:

```js
export const onItemAddAsync = text => {
  return dispatch => {
    setTimeout(() => {
      dispatch(onItemAdd(text))
    }, 3000);
  }
}
```

在`ItemInput.js`中改用`onItemAddAsync`應該會明顯感到加入項目時會變慢加入。

另一個可以獲取的參數是getState函式，這個函式可以得到目前store中的狀態值，這給了一些靈活應用的情況，例如在加入項目時，如果目前已經太多了，就不給加入新的項目，範例如下:

```js
export const onItemAddAsync2 = text => {
  return (dispatch, getState) => {

    if(getState().items.length < 7){
      setTimeout(() => {
        dispatch(onItemAdd(text))
      }, 1000)
    }else{
      console.log('too many items, delete some old items and retry');
    }

  };
}
```

redux-thunk相當方便地自動會進行在Action Creator的函式，不論是異步或同步的函式都可以在這裡面進行處理。

### Redux中處理副作用的方式總結

先說結論，副作用的處理在Redux一直是個話題，也有很多解決的方式，各自有優點也有缺點。

Redux的許多核心的設計由Elm語言啟發而來，那Elm是如何處理副作用或異步執行的？

答案可能會令你吃驚，以基本的設計來說Elm是在reducer中處理的，啊？reducer不是純粹函式，怎麼能作異步執行或有副作用的執行？

簡單來說，Elm是直接擁抱異步執行動作與副作用。有一個[redux-loop](https://github.com/redux-loop/redux-loop)專案，是從elm-effects(現已內建在Elm中)與Elm架構的移植過來的工具函式庫，用的是把異步執行直接寫在reducer中，主要是它讓reducer也沒直接處理異步，只是記錄要作的事情然後轉交給別的方式去處理，實際上並沒有破壞純粹函式的設計，所以這樣也行就是。

redux-loop並不是middleware，它算是增強或改進Redux的本質結構的一種工具套件，它有一些取代原有Redux方法，你要使用它需要改用裡面的`combineReducers`函式，與在建立store時要多傳入install函式，目前來說它仍然是一個發展中的專案。

那麼redux-loop就有可能是最佳的解決方案了嗎？也不盡然，Elm語言自然有它設計上與JavaScript語言的不同之處，也不是那麼容易就能完全發揮其中的這樣的設計。至少現在看起來redux-loop並沒有那麼流行(Github上有900多個星星)，Redux中還有其他的較為流行的類似目的專案。

目前Redux中的相同目的的專案，大概有以下幾個，我把Github的星星數目也列出來，作為一個使用者數量的指標:

- [redux-thunk](https://github.com/gaearon/redux-thunk): Redux作者開發，上面有簡單說明了，有3800星星
- [redux-promise](https://github.com/acdlite/redux-promise): 開發者也是React官方成員之一，1200星星，很久沒更新了
- [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware): 開發者也是FB工程師之一，600星星
- [redux-observable](https://github.com/redux-observable/redux-observable): 這是由RxJS 5為基礎的middleware，開發者是Netflix工程師，也是RxJS專案的開發者之一。1800個星星。
- [redux-saga](https://github.com/redux-saga/redux-saga): 這是由ES6的Generators特性發展出來的一個middleware，目前星星最多，有5600個星星。

redux-saga應該是目前最流行的專案，有自己一套完整架構的middleware，文件也有翻成[繁體中文在這裡](https://github.com/neighborhood999/redux-saga)與[簡體中文在這裡](https://github.com/superRaytin/redux-saga-in-chinese)。但因為要使用它需要先對ES6的Generators特性有一定的理解，才能夠靈活的運用它，算是另一個學習的門檻。

以上這些就是目前大概能找得到的middleware與移植Elm的redux-loop的幾個解決方案，其中最流行的是redux-saga，它是一個具有高度可測試性的middleware解決方案，這也是它會受到歡迎的其中一大原因。在stackoverflow上的[這篇回答](http://stackoverflow.com/questions/34930735/pros-cons-of-using-redux-saga-with-es6-generators-vs-redux-thunk-with-es7-async/34933395)，與[這篇的回答](http://stackoverflow.com/questions/34930735/pros-cons-of-using-redux-saga-with-es6-generators-vs-redux-thunk-with-es7-async/34933395)中，可以理解它與redux-thunk設計的不同之處。

Redux作者在2016年3月時，發了一個議題在Github上: [Reducer Composition with Effects in JavaScript](https://github.com/reactjs/redux/issues/1528)

這篇文章就是一個公開討論目前的使用middleware來處理副作用，仍然有一些不夠完美的情況。當然我們都不是很深入應用這些框架的開發者，只能從這些討論中理解要如何進行未來的改進。不過這算是一個進階的議題，或許2017年會有新的改進作法也說不定。
