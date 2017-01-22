# Redux篇 - 介紹 與 第一個範例

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day25_redux_ex1/asset/intro.png)

今天的主題是Redux，一開始我們先看它是如何運作的，Redux並不是只能在React應用中使用，而是可以在一般的應用中使用。第一個例子是一個簡單的JavaScript應用，它與最早之前的我們的TodoList應用的功能有點像。

這個程式最後的呈現結果，就像下面的動態圖片這樣，重點是在於下面有個Redux DevTools，它有時光旅行除錯的功能，可以倒帶重播你作過的任何資料上的變動:

![Redux範例一展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day25_redux_ex1/asset/day25_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day25_redux_ex1/)，所有的程式碼也在裡面。

這支簡單的應用是讓你學習Redux整個運作的過程用的，它只是個範例，在實際的應用中雖然會比較複雜，但基本的運作流程都是一樣的。本章的下面附了一些詳細的說明，建議你一定要看。Redux裡面有很多基本的概念與專有名詞，不學是很難看得到在說什麼東西。而且我覺得也是要再多思考一下，它的設計是集合了許多來自不同技術的合體。

## 程式碼說明

首先我們要使用的是用於寫ES6練習用的那個樣版文件[webpack-es6-startkit](https://github.com/eyesofkids/webpack-es6-startkit)，而不是create-react-app這個，因為這個範例中並沒有要用到React。之前的文章中有說明如何安裝。

接著我們要多安裝redux套件進來，在專案目錄裡用命令列工具(終端機)輸入以下的指令:

```
npm install --save redux
```

另外你也需要安裝Chrome瀏覽器的外掛 - [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)，這可以讓你使用Redux中的時光旅行除錯功能。

我們在index.html中加了一個文字框`itemtext`、按鈕`itemadd`，以及一個準備要顯示項目列表的div區域`itemlist`，程式碼如下:

> index.html

```
<div>
  <p>
    <input type="text" id="itemtext" />
    <button id="itemadd">Add</button>
  </p>
</div>

<div id="itemlist">
</div>
```

程式碼檔案只有一個，就是index.js，它是在src/目錄下的，程式碼如下:

> src/index.js

```js
// @flow
import { createStore } from 'redux'

// @Reducer
//
// action payload = action.text
// 使用純粹函式的陣列unshift，不能有副作用
// state(狀態)一開始的值是空陣列`state=[]`
function addItem(state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return [action.text, ...state]
    default:
      return state
  }
}

// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(addItem)
const store = createStore(addItem,
              window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// @Render
//
// render(渲染)是從目前store中取出state資料，然後輸出呈現在網頁上
function render() {
  const items = store.getState().map(item => (
    (item) ? `<li>${item}</li>` : ''
  ))
  document.getElementById('itemlist').innerHTML = `<ul>${items.join('')}</ul>`
}

// 第一次要呼叫一次render，讓網頁呈現資料
render()

// 訂閱render到store，這會讓store中如果有新的state(狀態)時，會重新呼叫一次render()
store.subscribe(render)

// 監聽事件到 "itemadd" 按鈕,
// 點按事件會觸發store dispatch Action(store發送動作)，例如
// `store.dispatch({ type: 'ADD_ITEM', textValue })
document.getElementById('itemadd')
  .addEventListener('click', () => {
    const itemText = document.getElementById('itemtext')

    // flowtype檢查用的
    if (itemText instanceof HTMLInputElement) {
      // 呼叫store dispatch方法
      store.dispatch({ type: 'ADD_ITEM', text: itemText.value })

      // 清空文字輸入框中的字
      itemText.value = ''
    }
  })
```

這個程式碼中我有排順序與加上中文註解，因為你要啟用Redux中的作用，是有順序的。我們一步步看下來:

第一步，是要從redux中匯入`createStore`方法，這很簡單吧，如下面的程式碼:

```js
import { createStore } from 'redux'
```

第二步，是要建立一個reducer(歸納函式)，reducer要求一定要是純粹函式。那麼到底什麼是reducer的作用，就是傳入之前的state(狀態)與一個action(動作)物件，然後要回傳一個新的state(狀態)。

對我們這個簡單的應用來說，它只會有一種這種行為，就是在文字框輸入一些文字，按下按鈕後，把這串文字值加到state中。

所以它的state(狀態)是個陣列，每次一作動作，就加到這個陣列的最上面(索引值為0)一個，動作呢就是像下面這樣的一個物件描述:

```js
{
  type: 'ADD_ITEM',
  text: text
}
```

reducer裡面通常會用動作的類型(action.type)用switch來區分要執行哪一段的程式碼，因為動作有可能會有很多不同的，像刪除項目、更新項目等等。程式碼如下:

```js
// @Reducer
//
// action payload = action.text
// 使用純粹函式的陣列unshift，不能有副作用
// state(狀態)一開始的值是空陣列`state=[]`
function addItem(state = [], action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return [action.text, ...state]
    default:
      return state
  }
}
```

上面的`[action.text, ...state]`，它就是純粹函式寫法的陣列unshift方法，之前在TodoList中你應該也有見過。

第三步，是由寫好的reducer，建立store，其實這沒什麼好說的，就用匯入的`createStore`方法把reducer傳入就行了。正常情況下是用`const store = createStore(addItem)`，因為你要使用瀏覽器中的[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)，所以要改寫成下面這樣的程式碼:

```js
// @Store
//
// store = createStore(reducer)
// 使用redux dev tools
// 如果要正常使用是使用 const store = createStore(addItem)
const store = createStore(addItem,
              window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
```

第四步，是寫一個render(渲染函式)，這個函式是在如果狀態上有新的變化時，要作輸出呈現的動作。說穿了，這大概是仿照React應用的機制的作法，不過它這設計實際上與React差了十萬八千里，這個渲染函式裡最重要的是用`store.getState()`方法取出目前`store`裡面的狀態值，因為我們現在只有記一個state值，所以直接取出來就是剛剛在reducer裡記錄狀態值的那個陣列。剩下的就是一些格式的調整與輸出工作而已。程式碼如下:

```js
// @Render
//
// render(渲染)是從目前store中取出state資料，然後輸出呈現在網頁上
function render() {
  const items = store.getState().map(item => (
    (item) ? `<li>${item}</li>` : ''
  ))
  document.getElementById('itemlist').innerHTML = `<ul>${items.join('')}</ul>`
}
```

第五步，第一次呼叫一下render，讓目前的資料呈現在網頁上。因為我們一開始在state裡並沒有資料(空陣列)，但也有可能原本是有一些資料的，這只是一個初始化資料的動作而已，也很簡單，程式碼如下:

```js
// 第一次要呼叫一次render，讓網頁呈現資料
render()
```

第六步，訂閱render函式到store中，用的是`store.subscribe`方法，這訂閱的動作會讓store中如果有新的state(狀態)時，就會重新呼叫一次render()。這也是一個很像是從React中抄來的設計吧？"當React中的state值改變(用setState)，就會觸發重新渲染"，不過在React中，setState你要自己作，沒有自動的機制。實際上這是從一個設計模式學來的作法，這種設計模式稱為`pub-sub(發佈-訂閱)系統`，在Flux架構中就有這個設計，Redux中也有，不過它更簡化了整個流程。程式碼也只有一行:

```js
// 訂閱render到store，這會讓store中如果有新的state(狀態)時，會重新呼叫一次render()
store.subscribe(render)
```

第七步，觸發事件的時候要呼叫`store.dispatch(action)`。在我們的這個簡單的範例中，唯一會觸發事件就是按下那個加入文字的按鈕，按下後除了要抓取文字框的文字外，另外就是要呼叫`store`要進行哪一個`action`，這個動作用的是`store.dispatch`方法，把`action`值傳入，action的格式上面有看到過了。程式碼如下:

```js
// 監聽事件到 "itemadd" 按鈕,
// 點按事件會觸發store dispatch Action(store發送動作)，例如
// `store.dispatch({ type: 'ADD_ITEM', textValue })
document.getElementById('itemadd')
  .addEventListener('click', () => {
    const itemText = document.getElementById('itemtext')

    // flowtype檢查用的
    if (itemText instanceof HTMLInputElement) {
      // 呼叫store dispatch方法
      store.dispatch({ type: 'ADD_ITEM', text: itemText.value })

      // 清空文字輸入框中的字
      itemText.value = ''
    }
  })
```

以上就是這七個步驟，這個簡單的小程式，你要套用Redux這個規模化的架構，自然是有些殺雞用牛刀的感覺，但我們的目的是要學習它是怎麼運作的，你可以看到整個運作的核心就是`store`，資料(state)在裡面，要與裡面的資料(state)更動，也是得用`store`的方法才行。實際上到React中也是類似的運作方式，不過因為又加了一些額外的輔助套件，會比目前看到的還複雜些，基本的運作邏輯都差不多。

---
## 其他補充部份

### Redux是什麼

Redux的官網中用一句話來說明Redux是什麼:

> Redux是針對JavaScript應用的可預測狀態容器

這句話說來簡短，其實是有幾個涵義的:

- 可預測的(predictable): 因為Redux用了reducer與pure function的概念，每個新的state都會由舊的state建來一個全新的state，這樣可以作所謂的時光旅行除錯。因此，所有的狀態修改都是"可預測的"。
- 狀態容器(state container): `state`是集中在單一個物件樹狀結構下的單一`store`，`store`即是應用程式領域(app domain)的狀態集合。
- JavaScript應用: 這說明Redux並不是單指設計給React用的，它是獨立的一個函式庫，可通用於各種JavaScript應用。

有些人可能會認為[Redux](https://github.com/reactjs/redux)一開始就是Facebook所建立的專案，其實並不是，它主要是由Dan Abramov所開始的，Dan Abramov進入Facebook的React小組工作是最近的事情。他還有建立另外還有其他的相關專案，像React Hot Loader、React DnD，可能比當時的Redux專案還更廣為人知，在Facebook發表Flux架構不久之後，許多Flux的週邊函式庫，不論是加強版、進化版、大改版…非常的多。Redux一開始的對外展示的大型活動，是在2015年的React-Europe，影片[Live React: Hot Reloading with Time Travel](https://www.youtube.com/watch?v=xsSnOQynTHs)。影片中就有簡單的說明，Redux用了"Flux + Elm"的概念。

[Elm](http://elm-lang.org/)是一個程式語言，它也是一個年輕的語言，與原本的JavaScript的設計本質上有很多不同之處，但最後可以編譯為JavaScript執行。Redux中有很多設計是學習Elm而來的，例如:

- Immutability(不可改變性): 所有的值在Elm中都是不可改變的，Redux中的pure function(純粹函式)與Reducer的設計很類似，但React的設計中也有這類的概念。
- Time Traveling Debugger(時光旅行除錯): 這在Elm有這個設計，Redux學了過來。

當然除了Flux與Elm之外，還有其他的主要像RxJS中的概念與設計方式，Redux融合了各家的技術於一身，除了更理想的使用在Flux要解決的問題上之外，更延伸了一些不同的設計方式。

但是對初學者來說，它也不容易學習，網路上常常見到初學者報怨Redux實在有夠難學，這也並不是完全是Redux的問題，基本上來說Flux的架構原本就不是很容易理解，Redux還簡化了Flux的流程與開發方式。

如果你已經是剛說的幾種技術的熟練開發者，那當然沒什麼問題，Redux用起來很理想，也很容易上手。對初學者可不是那麼一回事，光Immutability、pure function、reducer要搞懂就要花點時間。另外有些來自Flux架構的store、dispatcher、action、action creator等技術名詞，雖然沒幾個，其實它們也是來自一些設計模式的東西，也需要花時間才能掌握。另一個要注意的是，Redux裡用的都是最新的ES6(ES2015)或甚至ES.next的語法，就算你之前有學過JavaScript或jQuery，這些語法如果沒學過也會很陌生。最後，Redux要套用到React中的規則還有很多，你可以看看它的[官方手冊](http://redux.js.org/)中，有很多規則都要遵守才行，要得心應手需要一些時間。

而且原本的Flux有Flux自己的問題，Redux也有自己的問題: Redux的Immutability設計除了時光旅行除錯，當然也有很多好處，函式保持純粹(pure)，容易除錯是一個。但當你要使用不純粹的函式時，例如要用ajax往網路上的伺服器抓取資料時該怎麼作？這就是Redux自己本身的問題了。另一個很明顯的問題，是Redux只用單一個物件大樹結構的store，記錄大大小小的state(狀態)變化，如果在會持續更新狀態的情況下，這個樹會長得滿可怕的，時光旅行當然是很好的功能，但也有可能是變成一個效能上的問題，這效能的最佳化問題又該怎麼作？當然，我說的只是兩個很明顯的問題，而且你也猜得到Redux中早就已經有對應的解決方案，畢竟用得人多，你會遇到的問題大概都有人遇過，也都能找得到解決方式，這是開放原始碼生態圈的紅利。

我只能說如果你真的要學會React，並用它來開發一個稍有規模的應用，學習Redux說是一條必經之路，當然也有其他的Flux類函式庫可以選擇，但目前來說Redux的使用社群是最龐大也是最活躍的，而且也不見得其他的函式庫就會更容易學習與使用。

你心中應該要先有一個概念，這種架構或框架，本身就是為React應用規模化而設計的，這是大應用的架構，所以有很多強硬規則是必然的。雖然在這裡能提供一些較為簡易的入門知識，但真正要套用到實際的應用上，仍然有很多的基礎知識是要再深入與學習的。如果，你會覺得學起來很痛苦或常看不懂範例，大部份是因為基礎不足夠造成的，學習本來就要由淺入深循序漸進，是急不得的。

### Redux的三大原則

這三大基本原則是寫給React或Flux不熟的人看的，因為有可能怕你不理解這些函式庫中的一些限制或設計，所以會先寫出來提醒一下，當然它裡面就說明了Redux的設計原理基礎是如何，所以你要用之前要先理解一下。

#### 單一真相來源(Single source of truth)

> 你的整個應用中的state(狀態)會儲存在單一個store(儲存)之中的一個物件樹狀結構裡。

Redux中只有用單一個物件大樹結構來的儲存狀態，稱之為`store`，但它並不是只有單純的儲存資料而已。`store`就是應用程式領域的`state`(狀態)，已經有像MVC中的Model設計的概念，這名稱是由Flux來的，Flux架構原本是多個`store`的結構，Redux簡化它為單一個。

我們之前的React範例中也到最後，也是只有一個最上層的`state`來管控應用程式中的狀態，但我們能作到的只有單純的保存資料而已，更動這些資料的所有方法，雖然都是寫在上層元件之中，但是它們並沒有一個很標準的寫法。

不過Redux中的`store`儲存資料的結構與React中的`state`不同的地方，就是它會保存所有的更動，任何只要對狀態進行更動，都會保存進去，這是它的特色。

因為只有一個`store`，但如果`store`裡要儲放多個不同的狀態物件，以及每次的更動資料，自然就會變成了物件樹狀結構(object tree)。

#### 狀態是唯讀的(State is read-only)

> 唯一能更動狀態的是發送(emit)一個`action`(動作)，`action`是一個描述發生了什麼事的物件。

這與原先的React中的`state`與`setState`的概念有點像，Redux的意思是你不能直接更動`store`裡面記錄的狀態值，只能"間接"地透過發送`action`物件來叫`store`更動狀態。

發送(emit)一個action，用的是`store.dispatch(action)`語法，下面這個範例就是一個要更動狀態的程式碼:

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})
```

中間的那個物件，就叫作`action`(動作)，它是一個單純用於描述發生了什麼事的物件:

```js
{
  type: 'COMPLETE_TODO',
  index: 1
}
```

還記得我們在React中的`state`與`setState`方法的設計嗎？`state`也是不能直接更動的，一定要透過`setState`方法才能更動它。那這是為什麼呢？因為`setState`不光只是更動`state`值，它還要作重新渲染的動作。

也就是說假設Redux的設計中`store`是會對應到React中的`state`設計的話，它們之間有一些聯結，因為React中的`state`值不能直接更動，所以Redux中的`store`也不能直接更動。

`store`實際上是一種`state`擴充的結構，原先的`state`只能記錄單純的物件資料結構，`store`不止如此，它已經接近MVC的Model(模型)的設計。對於Flux的架構解說，在[我的部落格](http://eddychang.me/blog/javascript/94-flux-concept.html)裡有以下的對`store`的說明:

> store(儲存)的角色並非只是元件中的state(狀態)而已，它也不會只有單純的記錄資料，可能在現今的每種不同的Flux延伸的函式庫，對於store的定義與設計都有所不同。在Flux的架構中的store中，它包含了對資料更動的函式，Flux稱這些函式為Store Queries(儲存查詢)，也把它的角色定位為類似傳統MVC的Model(模型)，但與傳統的Model(模型)明顯不同的是，store只能透過Action(動作)以"間接"的方式來自我更新(self-updates through Actions)。

#### 更動只能由純粹函式來進行(Changes are made with pure functions)

> 要指示狀態樹要如何依actions(動作)來改變，你需要寫純粹的歸納函式(reducers)。

Redux中的reducer的原型會長得像下面這樣，你可以把它當作就是 `之前的狀態 + 動作 = 新的狀態` 的公式:

```js
(previousState, action) => newState
```

> 註: 你可以參考Redux中[Reducers](http://redux.js.org/docs/basics/Reducers.html)這一章的內容，裡面有實例。

不過，Redux中的reducer要求的是一定是pure function(純粹函式)，也就是不能有副作用(side effect)的函式。因此由reducer所產生的新狀態，並不是直接修改之前的狀態而來，而是一個複製之前狀態，然後加上動作改變的部份，產生的一個新的物件，它這樣設計是有原因的。

---

### reducer(歸納器)與pure function(純粹函式)

如果你已經看過Flux的設計與運作原理，那麼在Redux中你需要學習的第一個基礎是reducer與pure function。Flux架構的一些簡單的說明，我在部落格中有一篇[Flux - 為React打造的單向資料流架構](http://eddychang.me/blog/javascript/94-flux-concept.html)，裡面有說一些概念的部份，你可以先看。

Pure function(純粹函式)的概念在之前的章節已經說明過了，就不再重覆說明，你也要先了解。

reducer(歸納器)這種函式的名稱，是由陣列的一個迭代方法reduce(歸納)而來，你可以參考[MDN中的相關說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)，以下的內容與範例出自[從ES6開始的JavaScript學習生活](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part3/array.html)這本電子書中:

---

reduce(歸納)這個方法是一種應用於特殊情況的迭代方法，它可以藉由一個回調(callback)函式，來作前後值兩相運算，然後不斷縮減陣列中的成員數量，最終回傳一個值。reduce(歸納)並不會更動作為傳入的陣列(呼叫reduce的陣列)，所以它也沒有副作用。

```js
const aArray = [0, 1, 2, 3, 4]

const total = aArray.reduce(function(pValue, value, index, array){
    return pValue + value
})

console.log(aArray) // [0, 1, 2, 3, 4]
console.log(total) // 10
```

按照這個邏輯，reduce(歸納)具有分散運算的特點，可以用於下面幾個應用之中:

- 兩相比較最後取出特定的值(最大或最小值)
- 計算所有成員(值)，總合或相乘
- 其它需要兩兩處理的情況(組合巢狀陣列等等)

---

### store(儲存)

`store`也是由Flux架構來的產物，在Flux中的`store`的意義是用來對應元件中的`state`字詞，大概有幾個重點，Redux中的設計也是有類似的概念:

- `store`代表的是應用程式領域的持續性儲存資料
- `state`的容器，經常會對應到最上層元件的`state`，或是各個元件`state`的集合體
- 接近於MVC中的`Model`，不過只能透過動作"間接"作自我更新(self-updates through Actions)

與Flux的設計最大不同，Redux只有單一個`store`，它是一個樹狀結構的物件。而且，在Flux中的AppDispatcher工作，會由store中的方法來取代，大幅度地簡化原本複雜的流程。`store`中有四個主要方法:

- `dispatch(action)` 發送一個Action(動作)。這也是唯一可以觸發狀態改變的方式。常用於元件要用來觸發事件時。
- `getState()` 回傳目前store的狀態樹。常用於最上層元件取得目前狀態值。
- `subscribe(listener)` 加入一個更動的監聽者(函式)。它會在當有一個Action(動作)被發送時呼叫，或是當狀態樹被更動時呼叫。
- `replaceReducer(nextReducer)` 更換目前store用來計算state使用的reducer。屬於進階的API。

> 註: 不用redux-react時，需要用`subscribe(listener)`來作更新時重新渲染。

所以在React與Redux配合時，只會用到前面兩個`dispatch(action)`與`getState()`而已，不需要用到`subscribe`，也不適合使用`subscribe`，這一點要特別注意。

最後，store(儲存)一開始的建立是用`createStore(reducer)`來建立實體，所以你要先寫出一個reducer，才有辦法建立store。

### Action與Action Creator

這兩個是Flux架構中的參與成員，redux中有說明Action的定義:

> Actions are payloads of information that send data from your application to your store.
> 中譯: Actions(動作)是從你的應用送往store(儲存)的資訊負載

你可能會一直在Action(動作)這裡看到`payload`這個字詞，它是`負載`或`有效資料`的意思，這個字詞的意思解說你可以看一下，不難理解:

> Payload用在電腦科學的意思，是指在資料傳輸時的"有效資料"部份，也就是不包含傳輸時的頭部資訊或metadata等等用於傳輸其他資料。它的英文原本是指是飛彈或火箭的搭載的真正有效的負載部份，例如炸藥或核子彈頭，另外的不屬於payload的部份當然就是火箭傳送時用的燃料或控制零件。

這個Action是有一個固定格式的，叫作[FSA, Flux Standard Action(Flux標準動作)](https://github.com/acdlite/flux-standard-action)，格式的範例會像下面這樣，是個JavaScript的物件字面定義:

```js
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'
  }
}
```

這樣一個用於描述動作的單純物件字面定義，就稱為Action(動作)。

為什麼要先寫出明確的Actions(動作)，也就是把所有的元件會用到的Actions(動作)，全部集中寫到一個檔案中？這也是個硬規則，就像你如果參加奧運的體操比賽，每種項目都有規定的動作，在一定的時間內只能作這些動作，按照表定執行。主要還是因為Redux並不知道你的應用程式裡會作什麼動作，需要有一個明確說明有哪些動作的地方，在運作時以這個對照表為基準。

當然，聰明如你一定知道，Actions(動作)必需要有type(類型)，而且在同一個應用中的type(類型)名稱是不能重覆的，它的概念有點類似於資料表中的主鍵屬性。

> 那麼Action Creator(動作生成器)又是什麼？

在程式語言的函式庫中，如果是個英文的名詞，通常都是代表某種物件或資料格式，例如Action(動作)就是個單純的物件。如果叫什麼xxxxter或xxxxtor的，中文翻譯是"器"、"者"，通常就是個函式或方法，像上面的reducer和這裡的Action Creator，都是一種函式。

Action creator的設計也是由Flux架構來的產物，它是一種輔助用的函式，用來建立Action的。因為設計的不同，在Redux中的Action creator比在Flux更簡單，它通常只用來回傳Action物件而已，當然它本身是個函式，在回傳前是可以再針對回傳的動作資料先進行運算或整理的，例如像下面這樣的函式:

```js
export function addTodo(text) {
  return { type: ADD_TODO, text }
}
```

這個`addTodo`函式，有一個傳入參數，這個傳入參數就會用於組成Action物件中的`payload`(有效資料)。

如果一個Action物件簡單到連payload(有效資料)都沒有，通常會是個固定payload(有效資料)的動作，例如每動作一次+1或-1，或是每動作一次在true或false值切換，那麼在Redux中允許連Action或Action Creator都可以不用寫了。但是這種情況大概只有在很小的應用，或是學習階段的範例才會這樣，如果應用還是有一定程度的複雜度，一定都是要寫出來的。

> 註: Action Creator在Redux中並沒有要求一定要是個純粹函式，只是不建議在裡面直接執行有副作用的函式，之後的章節會有說明。請參考這篇在stackoverflow的[Reduce作者的回答](http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34623840#34623840)。
