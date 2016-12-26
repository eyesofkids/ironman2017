# Redux篇 - 第一次使用Redux於React應用

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day26_redux_ex2/asset/intro.png)

今天的主題是Redux使用於React元件之中，這個範例並不是一個真正用於React元件的範例，正確的來說，它只是個為了展示Redux原本的功能，如何整合到像React這樣的函式庫，最初步的一種測試範例，我們要學習的是前一個範例到這個範例的整個整合過程。

這個程式最後的呈現結果，就像下面的動態圖片這樣，重點是在於下面有個Redux DevTools，它有時光旅行除錯的功能，可以倒帶重播你作過的任何資料上的變動:

![Redux範例一展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day26_redux_ex2/asset/day26_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day26_redux_ex2/)，所有的程式碼也在裡面。

## 程式碼說明

一樣是使用ES6的樣版文件[webpack-es6-startkit](https://github.com/eyesofkids/webpack-es6-startkit)，要先安裝完redux後，額外再安裝react與react-dom套件，指令如下:

```
npm i --save react react-dom
```

因為原本的樣版文件中的babel並沒有附可以編譯react語法的套件，所以也要額外再安裝，指令如下:

```
npm i babel-preset-react --save-dev
```

`.babelrc`檔案也要加入這個preset，像下面這樣的修改:

```
{
  "presets": [
    "latest",
    "stage-0",
    "react"
  ],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

我們的inde.html更佳的簡單，這是`<body>`中的程式碼，它就像一般的React應用一樣，只會有一個要讓React應用渲染用的div，程式碼如下:

> index.html(body標記內部份)

```
<h2>Redux Example 2: React with no react-redux</h2>

<div id="root"></div>

<script src="./build/bundle.js"></script>
```

第一步，仍然從redux中匯入`createStore`方法，因為用了react與react-dom套件，也一併在這裡匯入:

```js
import { createStore } from 'redux'

import React from 'react'
import ReactDOM from 'react-dom'
```

第二步，是reducer(歸納函式)，這裡我們加了一個用於刪除項目用的處理的程式碼部份，reducer的名稱改為`dealItem`，在新增項目(ADD_ITEM)時，用payload物件記載`{id: id, text: text}`傳入，而刪除時只需要`id`就行了。

刪除項目的語法是使用`filter`方法，你也可以使用純粹函式的delete項目的寫法，就像之前的TodoApp裡的例子一樣的寫法也行。回傳一個不包含傳入id值項目的陣列，相當於刪除這個id值的項目就是。程式碼如下:

> 註: 因為項目的id值我們要用`+new Date()`來產生，這不能使用在reducer裡，所以在元件裡加入的方法中產生然後傳入reducer。

```js
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
```

第三步，是由寫好的reducer，建立store，與之前的都一樣:

```js
// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(dealItem)
const store = createStore(dealItem,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
```

第四步，因為我們要使用React，所以要寫一個React應用，當作像之前的render函式之用，寫法與之前的TodoList一樣，程式碼如下:

```
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
//
const render = () => ReactDOM.render(
  <MyComponent />, document.getElementById('root'))
```

這邊要注意的有兩個地方，一個是在按下按鈕時的`handleClick`方法中，我們要呼叫對應的`store.dispatch(action)`，在刪除單個項目用的勾選盒(checkbox)的`onClick`事件方法裡，也要呼叫對應的`store.dispatch(action)`，當然項目的資料是從`store.getState()`得來的。另一個則是把`ReactDOM.render`方法包在一個函式裡，稱之為`render`函式。

第五步，第一次呼叫一下render，和上個範例一樣的程式碼:

```js
// 第一次要呼叫一次render，讓網頁呈現資料
render()
```

第六步，訂閱render函式到store中，和上個範例一樣的程式碼:

```js
// 訂閱render到store，這會讓store中如果有新的state(狀態)時，會重新呼叫一次render()
store.subscribe(render)
```

第七步，觸發事件的時候要呼叫`store.dispatch(action)`。不用寫了，因為已經寫在React應用中了。

像上面這樣子，就把React的應用接到Redux上了。

不過，這個應用有一些很明顯的問題。首先，Redux並沒有掌控到整個React應用裡的`state`(狀態)，反而像是各自為政，Redux裡的store所記錄的狀態值，雖然的確是所有項目的資料，但React元件裡依然有另一個state值，這個state值還是有它的作用在，假設說這個是一個複雜的應用的情況下，有很多層的元件在React裡面，Redux對於React中的狀態變化會變得一無所知，只有靠有呼叫到`store.dispatch(action)`時，Redux才知道原來要進行更動自己所管控的store裡面的狀態資料。

另外，把React的這個`ReactDOM.render`作為render函式，然後訂閱到`store`也是一個很有問題的方式。每次store有更動，就會呼叫`ReactDOM.render`來作重新渲染的動作，雖然看起來似乎與在React應用內部，呼叫`setState`然後觸發重新渲染的結果一樣，但實際上這個方式並不是好的方式。在[這篇Stackoverflow](http://stackoverflow.com/questions/35281459/re-rendering-an-app-using-reactdom-render-rather-than-within-its-container-com/35282492)上的問答，Redux的作者的答覆是這樣的說的:

> 當你只有很少的元件時沒什麼太大差異，但在應用變大(有很多元件)時，這樣子會導致變慢(效率變差)...所以結論是我們不建議你直接用`store.subscribe()`，有個完整的函式庫叫[React Redux](https://github.com/reactjs/react-redux)，它可以協助你作訂閱(subscribe)的動作，當你使用裡面的`connect()`後，它會包裝`setState()`的邏輯進來...而且React Redux也會比你自己寫更有效率，因為它包含許多的最佳化程式碼。

好的，其實下一章的內容就是要使用[React Redux](https://github.com/reactjs/react-redux)，它是Redux開發團隊專門為React打造的綁定函式庫(bindings)，說到後來，Redux也是因應React而開發出來的，怎麼能不完美的整合在一起呢。

---

## 其他的補充說明

### 單向資料流

Redux的資料流設計的本質是一個嚴格的單向資料流(strict unidirectional data flow)，依照官網的說明文件，它的資料流剛好是我們撰寫流程的倒過來看，資料的流動如下步驟:

#### 1. 事件觸發，呼叫`store.dispatch(action)`

在事件觸發時，或是像Ajax、計時器之類的API中，你呼叫了`store.dispatch(action)`方法，這會發送一個用於描述動作的`action`，`action`是一個單純的物件值。例如:

```js
{ type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

因為action只能是單純的物件值，原先的Flux架構中，另外設計了Action Creator(動作建立器)，它的定義如下(出自[這裡的文件](http://facebook.github.io/flux/docs/in-depth-overview.html#content)):

> Action Creators(動作建立器)是一種輔助方法，收集整理到一個函式庫中，這個函式庫會從方法的傳入參數建立一個action，指定它一個type(類型)，以及提供它給dispatcher(發送器)

下面這是原先的(傳統的)Flux中，Action Creator(動作建立器)的一個範例:

```js
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action)
}
```

Redux簡化了Flux架構，在Redux中的Action Creator(動作建立器)不需要作發送(dispatch)的工作，動作是直接用`store.dispatch()`來作。當然Redux與Flux架構有一些本質設計上的不同。也因為如此，我們在本章的例子與上一個例子中，都沒有看到使用Action Creator(動作建立器)的程式碼，實際上如果寫出來也是很簡單的，像下面這樣:

```js
export function addTodo(text) {
  return { type: ADD_TODO, text }
}
```

當要發送時就改用像`store.dispatch(addTodo(text))`這樣的語句來取代。

#### 2. Redux的store會呼叫你給的reducer函式

Redux的reducer(歸納器)函式，是一個唯一可以更動store中的所記錄的資料，也就是應用程式狀態(state)的方式。這個設計的概念與React中的setState非常相似，還記得我們上一章說的，reducer的的公式是像下面這樣(出自[這裡的文件](http://redux.js.org/docs/basics/Reducers.html)):

```
(previousState, action) => newState
```

如果你有仔細看過React中的setState的API文件說明，它也有個說明的公式如下(出自[這裡的文件](https://facebook.github.io/react/docs/react-component.html#setstate)):

```
function(state, props) => newState
```

只不過差在`setState`是以`props`作為目前狀態(state)的的歸納傳入參數，而Redux的reducer(歸納器)是以`action`作為傳入參數。

React的setState會這樣設計，是因為它需要比對目前的state與新加入的狀態值，才能經過[diffing演算法](https://facebook.github.io/react/docs/reconciliation.html#the-diffing-algorithm)，計算出真實的DOM元素中真正要進行更動的元素，用最有效率的方式來作重新渲染。

Redux的reducer(歸納器)則是為了建構出store與處理store中的記錄的狀態如何被更動，reducer(歸納器)的要求是完全的純粹函式與無副作用，幾乎是不能在裡面呼叫任何的外部API，例如使用Math.random()或Date.now()方法等等。它只作單純一件事，如果有action傳入時，store中的記錄狀態值該如何更動，而這些動作是在使用了dispatch(發送)方法時才作的。

#### 3. 根reducer可以合併多個reducers為單一個狀態(state)樹

Redux另外提供了`combineReducers()`方法，可以合成多個reducer(歸納器)來使用，在小型的應用可能用不到，但在複雜的應用中，我們可能會把負責不同狀態值的reducers分割開來，例如專門處理記錄目前應用程式設定值的，與專門處理記錄應用程式中的項目值的。

#### 4. Redux的store會儲存由根reducer回傳的整個狀態(state)樹

`store.subscribe(listener)`方法，是在有狀態更動時，會自動被呼叫，在我們的範例中，是用rener函式來作為監聽者。監聽者可以由`store.getState()`方法取到目前已更動過的狀態資料，以此來呈現出對應的輸出結果。
