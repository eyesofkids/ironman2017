# Redux篇 - 使用react-redux綁定Redux與React

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day27_redux_ex3/asset/intro.png)

今天的主題是Redux使用於React元件之中，並使用由Redux官方出品的專案綁定套件[react-redux](https://github.com/reactjs/react-redux)。

這個程式最後的呈現結果，實際上與昨天是相同的(下面是上一章的展示圖片)，雖然表面上看起來差不多，但內部的作法是完全不同。

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day27_redux_ex3/)，所有的程式碼也在裡面。

## 程式碼說明

一樣是繼續使用上一章接著用下來的ES6的樣版文件[webpack-es6-startkit](https://github.com/eyesofkids/webpack-es6-startkit)，額外再安裝react-redux套件，指令如下:

```
npm i --save react-redux
```

在程式碼部份，我們把原本只有一個程式碼檔案，拆成了4個，它們的檔名與功能分別是:

- action.js - 集中放置Action Creators(動作建立器)
- app.js - 我們的React元件
- index.js - 我們的React應用的入口，store在這裡建立
- reducer.js - 集中放置reducer的檔案

首先先看reducer.js檔案，它依然是如前一章的reducer建立方式一樣，唯一的差異是要多使用了Redux中的[combineReducers](http://redux.js.org/docs/api/combineReducers.html)方法，這個方法可以合併多個reducer，因為有可能在同一個應用中，你會分別為不同的資料處理情況，撰寫不同的reducer，這個`combineReducers`方法可以讓你合併它們，程式碼如下:

> reducer.js

```js
// @flow

// @Reducer
//
// Add Item: action payload = action.payload
// Del Item: action payload = action.id
// 使用純粹函式的陣列unshift，不能有副作用
// state(狀態)一開始的值是空陣列`state=[]`
import { combineReducers } from 'redux'

function items(state = [], action) {
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

const itemApp = combineReducers({
  items,
})

export default itemApp

```

> 註: 經過`combineReducers`方法後，像上面的例子中，reducer的名稱是items，合併後我們如果要取得items資料，就會變為(store.getState()).items，與之前的不同。請再參考[combineReducers](http://redux.js.org/docs/api/combineReducers.html)的API文件說明。

再來是index.js，會先說明它是因為這裡是我們上一章的第三步，先就是建立store的過程，建立的過程是在我們應用的最上層元件之中，也是這個邏輯沒錯。在這個檔案中，我們把剛剛建立的reducer匯入，然後用`createStore`方法傳入這個reducer，建立出store來。

react-redux套件提供了`Provider`元件，你必須要把這個元件作為你的應用的最上層元件，才能進行綁定的工作，要注意的是它這`Provider`元件需要指定一個屬性，就是你建立出來的store，像是這樣的`<Provider store={store}>`的程式碼。這個檔案的程式碼如下:

> index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import itemApp from './reducer'
import MyComponent from './app'

// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(dealItem)
const store = createStore(itemApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// 使用react-redux的Provider元件作為React應用的最上層
ReactDOM.render(
  <Provider store={store}>
    <MyComponent />
  </Provider>,
  document.getElementById('root'))
```

在開始看元件是如何撰寫前，我們先來看Action Creator的部份，在action.js這個程式檔案中。前二個範例中都沒有使用到這個設計，但有在額外的補充說明裡說過它，Action Creator(動作建立器)是建立Action(物件)用的函式，最終會回傳一個用來描述發生了什麼動作的Ation純物件值。

接著要說明的，是要特別注意的，在react-redux中的設計是這樣，它會認為只要有呼叫Action Creator函式的行為發生，就是有發送動作(dispatch action)的行為發生，這兩個是互相串在一起的。這個設計與在傳統的(原本的)Flux架構中的Action Creator有點類似，但在react-redux的這發送動作(dispatch action)，它是自動幫你作的，也就是說你如果用react-redux綁住(連接)好Redux與React後，只要呼叫Action Creator的函式，就會作發送動作(dispatch action)，不需要像之前的範例中，要呼叫`store.dispatch(action)`這樣。

不過，要另外注意的是，你的Action Creator的函式，傳入參數必須是像我寫的範例這樣，都是以`payload`作為傳入參數(也就是只能有一個傳入參數，不論是物件值還是其他值)，不然有可能剛剛說的自動作發送動作(dispatch action)會失效。當然，react-redux有提供另外的方式來作自訂的情況。action.js的程式碼如下:

> action.js

```js
// @flow

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是payload
export const onItemAdd = (payload: { id: number, text: string }) => (
  { type: 'ADD_ITEM', payload }
)

// onItemAdd處理產生'ADD_ITEM'的動作物件，注意傳入參數是id
export const onItemDel = (id: number) => ({ type: 'DEL_ITEM', id })
```

最後來看我們的React元件怎麼寫，是app.js這個元件，我先把整個元件的程式碼貼上來，再解說主要的部份。程式碼如下:

> app.js

```js
// @flow

import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './action'

class MyComponent extends React.Component {

  // Flow工具檢查用
  state: { inputValue: string }

  constructor(props) {
    super(props)

    // 在文字輸入時使用state
    this.state = { inputValue: '' }
  }

  // 處理文字框中輸入文字用的方法
  handleTextChange = (event: KeyboardEvent) => {
    // flowtype檢查用的
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        inputValue: event.target.value,
      })
    }
  }

  // 處理點按新增按鈕用的方法
  handleItemAdd = () => {
    // store中的狀態值發送要新增的action，onItemAdd方法會被綁到props裡面
    this.props.onItemAdd(
      { id: +new Date(),
        text: this.state.inputValue,
      })

    // 清空文字框中的文字
    this.setState({
      inputValue: '',
    })
  }


  render() {
    // 解構this.props，items值與onItemDel方法會被綁到props裡面
    const { items, onItemDel } = this.props

    return (
      <div>
        <div>
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleTextChange}
          />
          <button
            onClick={this.handleItemAdd}
          >
            新增項目
          </button>
        </div>
        <p>
          {
            items.map(item => (
                <li key={item.id}>
                  <input
                    type="checkbox"
                    id={item.id}
                    onClick={() => onItemDel(item.id)}
                  />
                  {item.text}
                </li>
            ))
          }
        </p>

        </div>
    )
  }
}

// 將store中的items值傳綁到props上
const mapStateToProps = store => (
  { items: store.items }
)

// 連接Redux store
// 並把store.items綁到props.items，
// actionCreators裡面的方法也綁到props上
export default connect(mapStateToProps, actionCreators)(MyComponent)

```

元件的主體與之前沒什麼太大的差異，我們先看要怎麼綁住React與Redux store。

首先我們要在最上面匯入上一節寫的Action Creators(動作建立器)，程式碼如下:

```js
import * as actionCreators from './action'
```

在app.js的最後，你可以看到幾行，這就是連接這個React元件與Redeux store的最重要的幾行:

```js
// 將store中的items值傳綁到props上
const mapStateToProps = store => (
  { items: store.items }
)

// 連接Redux store
// 並把store.items綁到props.items，
// actionCreators裡面的方法也綁到props上
export default connect(mapStateToProps, actionCreators)(MyComponent)
```

`mapStateToProps`是個函式，名稱已經夠白話了，就是把狀態對映到這個元件中的props，是誰的狀態？Redux store裡的狀態。這個`mapStateToProps`有一個傳入參數，就是store，接著你要告訴它，你在這個元件的props屬性，要把哪個值對到store的哪個值上，這裡我們用回傳`{ items: store.items }`，實際上的意思就是把props屬性擴充出一個屬性值，名稱叫作items，裡面的值就是對映到Redux store上的items，也就是`(store.getState()).items`，你再回頭看一下上面的reducer，因為我們有合併過，所以這個就是由我們的reducer產生的記錄項目用的狀態值沒錯。

最後一句的`connect(mapStateToProps, actionCreators)(MyComponent)`是個連接語句，它是一個柯里(Curry)化的函式，下面有附說明。而且它是一個HOC(高階元件)的語法，這個連接的方法設計得很巧妙，它第一部份的(左邊的)呼叫主要的功能是給它兩個傳入參數，一個是剛定義好的`mapStateToProps`，另一個是我們匯入的`actionCreators`，也就是把store上的items狀態值，加掛到這個元件的props上，而Action Creators裡的兩個函式，也加掛到props上，這兩個都會在連接完成後，變成this.props裡的兩種屬性。

最後連接完成後，你可以用`this.props.items`取到目前在Redux store裡的items屬性值，用`this.props.onItemAdd`與`this.props.onItemDel`兩個方法來執行新增項目與刪除項目的動作，就是這麼的方便。

所以在`handleItemAdd`方法中，我們直接呼叫`this.props.onItemAdd`方法，就可以作項目的新增，而且是新增到Redux store中的，像下面的程式碼:

```js
// 處理點按新增按鈕用的方法
handleItemAdd = () => {
  // store中的狀態值發送要新增的action，onItemAdd方法會被綁到props裡面
  this.props.onItemAdd(
    { id: +new Date(),
      text: this.state.inputValue,
    })

  // 清空文字框中的文字
  this.setState({
    inputValue: '',
  })
}
```

刪除項目也是一樣很容易，因為我先用解構賦值，讓程式碼看起來會比較簡短，一樣這裡就是用`this.props.items`取得現在在Redux store裡記錄的項目狀態，當要刪除項目時，呼叫`this.props.onItemDel`方法，程式碼如下:

```js

// 解構this.props，items值與onItemDel方法會被綁到props裡面
const { items, onItemDel } = this.props

// ...

{
  items.map(item => (
      <li key={item.id}>
        <input
          type="checkbox"
          id={item.id}
          onClick={() => onItemDel(item.id)}
        />
        {item.text}
      </li>
  ))
}
```

至於原先範例中的subscribe(訂閱)的部份，這部份react-redux會自動幫你作，不需要使用`store.subscribe(render)`，對於React應用要如何重新渲染的部份，react-redux也是一併自動幫你作。

整個的運作流程就是這樣而已，整個資料流的運作看起來都非常的簡單，只要你能清楚react-redux幫你作了什麼，什麼又是你該作的。使用react-redux後的改變並不是只能用於像這麼小的應用當中，它是具有規模化的一種資料流架構，因為這種方式是可以在這個React應用中的所有元件樹狀結構的子元件中使用，也就是說它給了React應用真正有"應用程式領域的狀態與資料流架構"。

Redux與react-redux的設計都是非常有巧思的，它們應用了幾乎原先Flux架構中的設計精髓，以及所有React中的可用技術，加上精練的函數式程式設計的語法，採用了來自Elm語言的優良設計。不得不令人相當佩服，在這麼少的原始碼中，可以架構出一個完整的應用框架，而且還可以具有擴充的彈性。

或許你會認為Redux只能用於React或JavaScript語言之中，看看[ReSwift](https://github.com/ReSwift/ReSwift)，這是為Swift語言使用的單向資料流框架，也是受Redux啟發的專案。

---

## 其他補充說明

### 為何需要react-redux

因為react-redux可以將Redux中的store的，與元件中的state中串連起來，而且最重要的是，我們不再需要state這個React中的特性，完全使用Redux中的store(與裡面的state)來取代它，store內部會與React上層元件的state溝通，在合適的時刻進行重新渲染，我們只要專心把store與Redux處理好就行了。

React元件中的`state`本身並沒有錯，只是它管不到的事情太多了，`state`與`setState`的設計在之前的章節已經說過了，它有一些特性:

- `state`本身是每個元件內部的私有資料，只能用於儲存單純的資料
- `setState`的執行有延時(delay)的特性，類似於異步，請參考這篇[為何說setState方法是異步的](http://eddychang.me/blog/javascript/98-why-setstate-is-async.html)
- `setState`方法無法完全掌控應用中所有元件的狀態，生命週期方法裡面其實對setState有一些限制，例如`componentWillUpdate`，當然`render`方法裡也不行。
- `setState`方法可能會引發不必要的渲染
- `setState`方法是一個高花費的執行過程，它與應用程式的執行效率有關

再者，我們的應用程式領域的狀態，應該是能夠"穿透"整個React應用，所有在其中的元件都有一個方式可以互相溝通。在簡單的應用中，可以利用之前所介紹過的上層元件與下層元件溝通的方式來作，那複雜的元件呢？如果多達四、五層的元件結構，這種上下層互傳資料的方式顯然不可行，也難以管理。

但React元件中完全不需要`state`在網路上是引起一些爭議的，如果我們完全不需要`state`，那為什麼還學怎麼使用state與setState方法，不是自打嘴巴嗎？在Dan Abramov的這篇[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367#.d6nxm1wx5)中，它有提供一句話，我認為可以作為使用像Redux這樣的框架應用在React應用上的參考:

> Local state is fine.
> 本地端的state(狀態)是合適的。

也就是說，在React的某個元件中，因為要記錄狀態的改變，所以用了這個元件自己的state值來作這件事，這是合適的，沒什麼不對，當然這個方式也是最直覺的一種方式。

那為何我在教學中要改造原有的本地端state(狀態)成為像無狀態元件那樣？

因為我只是想提供另一種撰寫元件的方式來說明，讓你知道有兩種選擇可以使用，並不是說一定要用哪一種來寫。如果你認為用無狀態元件(函式語法的元件)的寫法不夠直覺，或是並不熟練這種寫法，你大可先用一般的ES6類別的寫法來寫元件，我們在Redux整合到React應用的一開始的範例，不也是個用本地端state(狀態)的元件寫法。

而且語法的改進本來不是一次到位的，而且這與每個開發者的個人喜好有關。有些開發者偏愛函數式開發者，有些覺得要以類別物件導向為主，這是每個開發者自己的喜好的差異，就像你今天用了Redux，也有其他像MobX之類的其他狀態容器的函式庫，每個函式庫各有其特色，設計與解決問題的方式都是不同的。

### react-redux中Provider元件

Provider元件是一個在整合React應用時，必須要使用於最上層的元件。

一般情況下，如果你不使用這個元件包住你的React應用的最上層元件，那麼你將無法使用connect方法來綁定React與Redux store。

這個元件裡主要使用了二個React中的技術，第一個是之前我們有提過的像這種上層(外層)元件與下層(內層)元件的關係中，上層(外層)元件可以用`props.children`來對下層(內層)元件作一些屬性上的調整或增加。Provider元件先作完其他該作的事情，把`props.children`回傳作為主要渲染的對象。

第二個我們之前沒說過，是一個名稱為[Context](https://facebook.github.io/react/docs/context.html)的特性，它是一種在React可以"穿透"元件樹結構層級元件的傳遞資料的特性，也就是不需透過porps的一層層傳遞，而是自動直接從最上層元件傳遞某些資料到你想要獲取值的子元件上，這在複雜的元件樹結構中傳遞資料可以得到一些便利。

Context這個特性是一個使用於特別情況下，而且是個隱含的(implicitly)特性，一般情況我們不需要使用到它，在某些函式庫或框架中像Redux, MobX或React Router(路由器)中都有使用到它。而且它的API歷經多次的修改，至今仍然是屬於實驗性質很重的一個特性，其中的內容經常會變動，除非你今天要開發一個像Flux這樣的應用程式領域的框架，不然不要使用它。

### react-redux中的connect方法

connect方法使用了一個很特別的語法樣式，在我們的範例中所看到是:

```js
connect(mapStateToProps, actionCreators)(MyComponent)
```

看起來像是一個函式，但有兩個用於傳入參數的圓括號(())，如果你對柯里或部份應用並不熟悉，可能會對這個語法有發問。以下分幾個裡面使用到的技術來大致上說明一下。

#### 高階元件(HOC)

這實際上這裡面包含了一個由React最近發展出來的語法樣式，稱之為 高階元件(Hight Order Component, 簡稱HOC)，HOC的語法是在之前用ES5的工廠樣式寫元件時，原本有一個用於混合(Mixin)的特性，但它無法在ES6的類別(建構式)樣式的元件寫法中再被使用，所以React開發團隊的Sebastian Markbåge在[Github這裡](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775)提出了一個新的作法，可以作為ES6的元件合成使用，HOC是一種函式，用於增強(Enhance)元件中的功能。Dan Abramov(Redux的創始者)認為這個語法實在太優秀了，在他的部落格分享了一篇[Mixins Are Dead. Long Live Composition](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.stn85ggq3)，比較了原本的混合(Mixin)與HOC的作法。簡單地來說明就是像下面這兩句:

> HOC是一種特別的樣式，主要目的是用來取代原本以工廠模式(React.createClass方式)建立元件時，所使用的Mixins(混合)。

> HOC只是一種函式，傳入一個現成的元件，然後回傳另一個包裝過的元件。這個樣式的目的是為了增強元件而使用。

HOC的語法並不難理解，基本的語法可以簡化為下面兩種，這兩種語法樣式雖然看起來很像，但它們用babel編譯過的程式碼並不太一樣。

```js
//需要state與lifecycle methods時
const hoc = Component => class _hoc extends React.Component {
  render() {
    return <Component { ...this.props } {...this.state} />
  }
}

//不需要state與lifecycle methods時
const hoc = Component => function _hoc(props) {
  return <Component { ...props } />
}
```

HOC本身只是個函式，傳入一個元件，然後回傳另一個，但在這個函式裡，你可以針對元件的各種生命週期方法，或是內部的一些特性，作增強或調整。使用方式大概像下面這個例子:

```js
import { Component } from "React";

export var Enhance = ComposedComponent => class extends Component {
  constructor() {
    this.state = { data: null };
  }
  componentDidMount() {
    this.setState({ data: 'Hello' });
  }
  render() {
    return <ComposedComponent {...this.props} data={this.state.data} />;
  }
};
```

```js
import { Enhance } from "./Enhance";

class MyComponent {
  render() {
    if (!this.data) return <div>Waiting...</div>;
    return <div>{this.data}</div>;
  }
}

export default Enhance(MyComponent); // Enhanced component
```

這個例子就是一開始被提出來的一個範例，Sebastian Markbåge把它稱之為Enhance(增強)函式，你可以看到原本的`MyComponent`元件的內部並沒有`data`這個值，是經過Enhance(增強)函式後，它被加入到回傳的新元件內部中，也就是`Enhance(MyComponent)`語句所回傳出來的元件。

> 註: HOC樣式是一個很新的語法樣式，它也不是完全沒有問題，例如React的靜態方法(static methods)會在HOC元件中消失，這是一個進階的議題，請參考[這裡的討論](https://github.com/acdlite/flummox/issues/173)。目前react-redux用的解決方式是用[hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)。

#### connect方法與connectAdvanced方法

`connect`方法用了HOC(高階元件)的樣式，那麼從上面看到HOC必定有一個樣版元件 - 也就是要把作為傳入參數的元件，增強成什麼樣子的那個元件。

react-redux中有一個在元件分類中的[connectAdvanced](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectadvancedselectorfactory-connectoptions)，但它並不是一個單獨的React元件，精確來說`connectAdvanced`是一個HOC，只是所謂的樣版元件是包在這裡面。`connectAdvanced`的作用是什麼，按照官方的文件說明如下:

```
connectAdvanced(selectorFactory, [connectOptions])

Connects a React component to a Redux store. It is the base for connect() but is less opinionated about how to combine state, props, and dispatch into your final props. It makes no assumptions about defaults or memoization of results, leaving those responsibilities to the caller.

It does not modify the component class passed to it; instead, it returns a new, connected component class for you to use.
```

`connectAdvanced`的最主要工作是連接React元件到Redux的store。而`connectAdvanced`是`connect`方法的基礎，但`connectAdvanced`不像`connect`作了更多的預設設定，例如要先假設好怎麼合併state, props之類、給預設值或記憶結果之類的事情。所以它的名稱是進階的(Advanced)，也就是當開發者需要有更多的自訂彈性時，要用這個`connectAdvanced`方法，開發者要自己想辦法作這些設定。文字的最後一段就是HOC的特性說明，說`connectAdvanced`會回傳一個新的已連接好的元件類別給你用。

#### 柯里(Curry)

react-redux裡的connect方法用了柯里化的技術，它在第一個部份呼叫後，也就是傳入所要使用的參數，會回傳另一個已經帶有這些傳入參數值，並且處理過的函式，第二個部份呼叫才是HOC的部份。這是一個使用了JavaScript語言中閉包結構的樣式，也就是說，第二個部份的呼叫時，裡面就會有已經記憶住第一部份呼叫過後的這些傳入參數值。

為何connect方法要使用柯里化，你可能會有這個疑問？

柯里是一種"惰性(延時)求值"技巧，第一部份(左邊)的呼叫，是connect方法的傳入參數的部份，在[API文件中](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)的函式的原型像下面這樣，用中括號([])括住代表它們都是可自訂的(可有可無):

```js
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
```

其中最重要的是第一個`mapStateToProps`傳入參數，在文件中有這麼一段(摘錄):

```
 [mapStateToProps(state, [ownProps]): stateProps] (Function): If specified, the component will subscribe to Redux store updates. Any time it updates, mapStateToProps will be called. Its result must be a plain object*, and it will be merged into the component’s props. If you omit it, the component will not be subscribed to the Redux store. ...
```

這個傳入參數是個函式，需要有指定元件才會作訂閱(subscribe)到Redux store的動作，每次當Redux store更新時，mapStateToProps都會被呼叫。它的結果(回傳值)必需是個純物件值，然後會被合併進入元件的props值...

所以，用柯里化的樣式自然是有它的用意，connect方法的第一個部份呼叫，算是一個讓開發者自訂的功能，以這個`mapStateToProps`傳入參數來說，也就是當這個React元件要訂閱Redux store時，每次當store有更新時，是要怎麼對應目前元件的props的一段程式碼。這段程式碼不先給，那是要怎麼作增強這個元件的HOC？所以這區分為兩段的呼叫過程，是相當合理的設計。

當然，傳入參數還有其他很多，這份API文件大概8成以上的內容都在講參數與設定值，這也是這個react-redux最讓人剛開始使用的時候會覺得很複雜的地方。這些設計只是react-redux的創作者為了讓使用它的開發者們更方便使用，所以把大概能用到會用的一些情況，通通都用傳入參數拉出來，讓開發者們可以在React元件裡先寫好，然後再進入HOC樣式作增強與連接Redux store的動作，設計上也是很巧妙而且符合彈性使用的。

題外話是，大概寫出Redux與react-redux的函式庫的開發者，能力大概都到一個頂尖的程度，習慣了用函數式開發的寫法，react-redux的API文件內容不多也沒有分成入門版或進階版，並沒有用Flow工具的類型標記，在原始碼中的可參考的註解也不多，我還看到像一句像下面的註解，令人有啼笑皆非的感覺:

```
// TODO: Add more comments
```

一些柯里化簡單的介紹附在這下面，大部份是摘錄自我寫的電子書中的[Closure 閉包](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/closure.html)這章節。

柯里化是一種源自數學中求值的技術，它與部份應用(Partial application)經常被一起討論，這些都是在程式設計上稱為"部份求值"或"惰性(延時)求值"的一種技巧。JavaScript語言中可以使用閉包結構很容易地實現這個技術。

> Curry的英文字詞是"咖哩"的意思，不過這裡是指這個技術以"Haskell Curry(柯里)"數學家的名字來命名。

> 柯里: 一次只套用一個傳入參數，回傳另一個函式，回傳的函式與原來的結構相同，直到所有傳入參數都被套用才會回傳值。

柯里化會比較麻煩些，只能使用閉包結構來改寫原本的函式，例如下面的原本函式與柯里化後的樣子比較:

```js
//原本的函式
add(x, y, z)

//柯里化後
add(x)(y)(z)
```

因為JavaScript中有閉包的特性，所以要改寫是容易的，需要改寫一下原先的函式:

```js
//原本的函式
function add(x, y, z){
  return x+y+z
}
//柯里化
function add(x, y, z){
  return function(y){
    return function(z){
        return x + y + z
    }
  }
}

add(1)(2)(3)
```

第一個傳入值x會變為閉包中的變數被記憶，然後是第二個傳入值y，最後的加總是由閉包結構中的x與y與傳入參數z一起加總。這個範例中用了三個傳入參數，如果你沒辦法一下子看清楚，可以用二個傳入參數的情況來練習看看。

---

### Action Creators(動作建立器)的綁定

在我們的範例中是使用Action Creators(動作建立器)來作為綁定於React元件的props屬性上的Dispatch(發送)方式。也就是在範例中的`actionCreators`實際上它是作為`connect`第二個傳入參數值，也就是`mapDispatchToProps`這個參數來傳入。

這個`mapDispatchToProps`是一個很彈性的傳入參數，在react-redux中的設計共有三種情況，這是在API手冊上可能會說得不清楚的地方，我把它列出來:

- whenMapDispatchToPropsIsFunction: 當這個傳入參數是個函式時，會把這個函式映對到props上。這個函式因為可以得到dispatch，所以用這個方式相當於要自訂dispatch的處理函式，一般會用於只需要部份對映Action Creators(動作建立器)使用。
- whenMapDispatchToPropsIsMissing: 當這個傳入參數沒有指定時，這會直接把dispatch映對到props上。相當於傳入`(dispatch)=>({dispatch})`函式。
- whenMapDispatchToPropsIsObject: 當這個傳入參數是個物件時，它會用一個Redux的[bindActionCreators](http://redux.js.org/docs/api/bindActionCreators.html)方法，這個方法就是要綁定Action Creators(動作建立器)用的。也就是說，這個情況才是我們直接傳入Action Creators(動作建立器)所使用的。

因為設計是如此，`mapDispatchToProps`本身的使用情況有很多種，在API文件中也列了很多不同的使用情況，但最終還是要以上面這三種情況為準。例如使用的幾個情況:

1. 沒給這個傳入參數，也就是connect方法只有一個傳入參數`mapStateToProps`，這時候dispatch會自動映對到props上，你要作`store.dispatch(action)`，相當於用`this.props.dispatch(action)`
2. 給actionCreators，如同我們的例子一樣，Action Creators(動作建立器)映對到props上。
3. 自訂出`mapDispatchToProps`函式，再傳入函式，通常是只需要部份的Action Creators(動作建立器)而已，例如下面的例子是在這個元件中只需要`onItemAdd`，這仍然會使用Redux的[bindActionCreators](http://redux.js.org/docs/api/bindActionCreators.html)方法來作，所以你在這個元件的最上面要匯入redux套件:

```js
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ onItemAdd }, dispatch)
}
```

`mapDispatchToProps`的使用情況就是這樣，這個傳入參數是一個初學者非常搞混的地方。
