# Component(元件)與JSX

## 學習目標

1. 第二支程式: TextInput元件(文字輸入框+顯示區)
2. props(屬性)
3. state(狀態)
4. 事件處理
5. JSX語法注意事項
6. 範例程式的解說

## 第二個範例程式: TextInput元件(文字輸入框+顯示區)

我們在這個範例程式中，要使用三個程式碼檔案，一個是無狀態的顯示元件，名稱是TextShow，它的檔案名稱是TextShow.js，裡面的內容很簡單，只有下面這樣而已:

```js
import React from 'react'

const TextShow = (props) => (
    <h1>{props.text}</h1>
)

//加入props的資料類型驗証
TextShow.propTypes = {
  text: React.PropTypes.string.isRequired
}

//匯出TextShow模組
export default TextShow
```

另一個檔案是我們主要的元件名稱是TextInput，而且它裡面會使用到TextShow元件，檔名一樣是用TextInput.js，裡面的內容如下:

```js
import React from 'react'
import TextShow from './TextShow'

class TextInput extends React.Component {

    //建構式
    constructor() {
        //super是呼叫上層父類別的建構式
        super()

        //設定初始的狀態。注意！這裡有個反樣式。
        this.state = {
            text: ''
        }

    }

    //處理的方法，用event.target可以獲取到輸入框的值，用箭頭函式可以綁定`this`
    handleChange = (event) => {
        this.setState({text: event.target.value})
    }

    //渲染方法，回傳React Element(元素)
    render() {
        return <div>
                  <input type="text"
                    value={this.state.text}
                    placeholder={this.props.initText}
                    onChange={this.handleChange}
                  />
                  <TextShow text={this.state.text}/>
                </div>
    }
}

//加入props的資料類型驗証
TextInput.propTypes = {
  initText: React.PropTypes.string.isRequired
}

//匯出TextInput模組
export default TextInput
```

第三個檔案是我們用來呈現元件在網頁上的程式碼檔案index.js，裡面會引用TextInput元件，程式碼如下:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import TextInput from './TextInput'


//最後用來輸出到實體DOM的方法
ReactDOM.render(
    <TextInput initText={"開始輸入吧!"}/> , document.getElementById('root'))
```

這個程式最後的呈現結果，會是在網頁上出現一個文字輸入框，當你輸入文字時，下面的顯示區域會一併跟著顯示，就像下面的動態圖片這樣:

![TextInput元件展示](https://raw.githubusercontent.com/eyesofkids/react-entry-level-book/master/assets/textinput_demo.gif)

## props(屬性)

### 值的類型

props(屬性)並沒有限制你只能指定給它什麼樣類型的值，可以是JavaScript中常見的7種資料類型，字串、數字、布林、函式、陣列、物件與符號(Symbol)。你從範例中看到，元件會自動就會取得你所定義的props(屬性)值，例上面的範例中`TextShow`元件中的程式碼使用了一個名稱為`text`的props(屬性)，在JSX中使用它就可以獲取得到設定的值。

當元件中的結構很複雜時，props(屬性)的值有很多不同種類時，對於屬性值不加上限制會變得麻煩，我們需要一個檢查的機制可以來預先聲明，哪一些props(屬性)是必要的或可選的，或是它們只能使用哪種資料類型，這對於打造可重覆使用的元件很重要。

React中可以使用類別中的`propTypes`屬性來定義props(屬性)的限制，在執行時會對這些受限制的props(屬性)作檢查，`propTypes`屬性需要定義為靜態屬性，如果是像`TextShow`是一個使用 無狀態的功能性元件(Stateless functional components)的定義法，它的`propTypes`屬性只能使用下面的語法再額外定義，這語句是寫在函式區塊的"**外面**":

```js
TextShow.propTypes = {
  text: React.PropTypes.string
}
```

這將會限制這個屬性只能使用字串類型，當你傳入其他資料類型時(例如數字)，就會出現以下的警告訊息(不會中斷程式):

```
Warning: Failed prop type: Invalid prop `text` of type `number` supplied to `TextShow`, expected `string`.
```

不過這時候只會對`text`作資料類型的檢查，如果你想要設定這個props(屬性)是必要的，需要再加上`isRequired`在檢查類型的後面(連鎖語法)，像下面這樣:

```js
TextShow.propTypes = {
  text: React.PropTypes.string.isRequired
}
```

當你沒使用這個props(屬性)時，就會出現以下的警告訊息(不會中斷程式):

```
Warning: Failed prop type: Required prop `text` was not specified in `TextShow`.
```

而另外一個`TextInput`元件，它是使用ES6類別定義的，有兩種方式可以使用來定義`propTypes`屬性。

第一種和上面類似，在類別定義區塊的"**外面**"，加上下面的語法，程式碼如下:

```js
TextInput.propTypes = {
  initText: React.PropTypes.string.isRequired
}
```

第二種是ES7的語法，稱為"property initializers"(屬性初始子)。這需要在類別定義區塊的"**裡面**"，加上static關鍵字，程式碼如下:

```js
static propTypes = {
  initText: React.PropTypes.string.isRequired
}
```

> 註: 這個ES7語法需要額外安裝babel工具中的"babel-preset-stage-2"或"babel-plugin-transform-class-properties"，才能夠轉換程式碼。我們使用的create-react-app中已經有幫你裝好了。

關於其他的可使用的props驗証，請參考[React官網這裡](https://facebook.github.io/react/docs/reusable-components-zh-CN.html#prop-)的說明，可用的規則還滿多的。我們之後在其他的教學範例中會看到使用這些規則。

### 預設值

props(屬性)也可以設定一個預設值，可以使用`defaultProps`來給定某個props(屬性)的預設值，這個屬性的設定方式與上面的`propTypes`屬性一模一樣。

所以在`TextShow`元件中設定其中的text屬性的預設值語法:

```js
TextShow.defaultProps = {
  text: '文字秀!'
}
```

在`TextInput`元件中的定義`getDefaultProps`的方式一樣有兩種。第一種是用在類別定義區塊外面的寫法:

```js
TextInput.defaultProps = {
  initText: '來輸入一些文字吧!'
}
```

第二種是ES7的語法:

```js
static defaultProps = {
  initText: '來輸入一些文字吧!'
}
```

當有設定預設值(`defaultProps`)時，`propTypes`中的`isRequired`(必要)檢查就會算通過了。這個預設值會在元件的這個屬性沒有被設定任何值時使用。

> 註: 用`React.createClass`定義元件的方式中是設定使用`getDefaultProps`函式來定義，並不是`defaultProps`屬性。

### 父母-子女(parent-childen)關係

props(屬性)的概念上一堂有談過了，它是React Element(元素)中的屬性值，要思考props(屬性)絕對不能以單一個元件的角度來看，元件是具有層級性的東西，共有兩種層級的概念，以下分別討論。

props(屬性)在React Element(元素)中是可以存在有 父母-子女(parent-childen) 的關係，這個設計與真實網頁上的DOM元素的樹狀結構類似，所以當父母(parent)節點想要存取它的子女們(childen)節點時，React中提供了`this.props.children`屬性可以使用。不過，React會認為`this.props.children`屬性是一個含糊不清(opaque)的資料結構，為什麼呢？因為它有可能有幾種回傳情況:

- 子節點不存在，資料為"undefined"：例如`<Component />`或`<Component></Component>`
- 只有單一個子節點，資料為"單一物件/元件"：例如`<Component><span></span></Component>`或`<Component><ChildComponent></ChildComponent><Component>`
- 有多個子節點，資料為"陣列(物件/元件)"：例如`<Component><span></span><ChildComponent></ChildComponent></Component>`
- 資料為"字串"：例如`<Component>我是字串</Component>`

React中在`React.Children`裡有幾個方法來協助你處理`this.props.children`的資料，其中`map`與`forEach`和陣列的方法有點相像:

- React.Children.map：迭代(iterate)資料並呼叫你提供的回調函式，回傳陣列或undefined
- React.Children.forEach：迭代(iterate)資料並呼叫你提供的回調函式，和map類似，但不會回傳陣列
- React.Children.count：回傳>=0的個數
- React.Children.only：回傳一個子元件，只能用於單個子元件的情況
- React.Children.toArray：回傳為陣列型態

一個經常會被使用的樣式是迭代(iterate)所有的子節點，複制新的子節點後加上新的props值:

```js
var newChildren = React.Children.map(this.props.children, function(child) {
  return React.cloneElement(child, { foo: true })
});
```

### key屬性

講到子節點，就不得不說明一下`key`這個React Element(元素)中的屬性之一。`key`是一個可選的，具唯一性的識別子，當你的一個元件使用動態來生成具有同樣結構的子元素節點時，不論這些子元素是其他的元件還是HTML中的DOM元素，React都要求你要提供`key`的屬性值，以此來區分不同的子元素，當然每個子元素的`key`值不能相同。`key`屬性與Virtual DOM要進行渲染的運算有關。

```js
const ListItem = (props) => (
    <li>{props.text}</li>
)

const names = ['鮎川天理', '汐宮栞', '中川加儂', '小阪千尋']

//最後用來輸出到實體DOM的方法
ReactDOM.render(
    <ul>
    {
      /* 用map方法回傳陣列 */
      names.map(function (value, index, array) {
        return <ListItem text={value}/>
      })
    }
    </ul>, document.getElementById('root'))
```

會出誢以下的警告訊息:

```
Warning: Each child in an array or iterator should have a unique "key" prop. Check the top-level render call using <ul>. See https://fb.me/react-warning-keys for more information.
```

把key屬性加上，就可以避免這個警告訊息，如果是陣列值的話，使用索引值剛好可以用來當不能重覆的key屬性，改寫過的map方法如下:

```js
{
  names.map(function (value, index, array){
    return <ListItem key={index} text={value}/>
  })
}
```

要特別注意的是，`key`值應該是在進行render時直接給定就行了，而不是在元件定義的時候給定。

### "擁有者-被擁有者(owner-ownee)"關係

談過了`props`(屬性)中有關 "父母-子女(parent-childen)" 的關係，我們要談另一種關係，就是 "擁有者-被擁有者(owner-ownee)" 的關係，這關係只會存在於React元件定義中，擁有者通常指的是某個位於上層的元件。規則很簡單:

- A元件在`render()`中建立了B元件，A就是B的擁有者。(或者可以說因為A元件的定義中設定了B元件的屬性)
- 元件是無法改變自己的`props`(屬性)，這是它的擁有者才可以作的事。

擁有者-被擁有者 關係對比剛剛說的父母-子女關係，父母-子女是類似DOM中的直接的上下層結構關係，而擁有者-被擁有者 關係是定義時的設定props(屬性)的關係。以我們的例子來說:

- "擁有者-被擁有者" 關係: TextInput元件是div、input與TextShow元件的擁有者
- "父母-子女" 關係: TextShow元件的父母節點是div

"擁有者-被擁有者(owner-ownee)"的關係之所以會重要，因為它涉及到資料流(Data Flow)的概念。元件本身無法改變自己的props(屬性)，對元件本身來說，自己的屬性是無法改變的(immutable)，但它的擁有者元件可以。

這可以形成我們看到的第一種元件互相溝通的關係，由"擁有者-被擁有者(owner-ownee)"所建立的 - `擁有者 -> 被擁有者`的資料流，以我們的範例來說，也就是直接在TextInput(擁有者)元件中的定義裡，直接設定TextShow(被擁有者)元件的props屬性。如下面的圖解:

![Owner-ownee data flow](https://raw.githubusercontent.com/eyesofkids/react-entry-level-book/master/assets/owner_ownee_data_flow.png)

更多有關於這兩種關係的內容可以參考[官網這裡](https://facebook.github.io/react/docs/multiple-components-zh-CN.html)。

## state(狀態)

> Components are Just State Machines (元件就是狀態的機器) ~ React官方文件

state(狀態)是元件中重要的特性之一，React認為元件就是狀態的機器，代表state(狀態)特性在元件中的重要程度。不過並不是所有的元件都要變成狀態機器，在你的應用程式中使用的組成元件們，大部份都是無狀態(Stateless)的元件，只有少數幾個會是有狀態的(Stateful)的元件。"無狀態的(Stateless)"這個字詞的反義詞是"有狀態的(Stateful)"，這兩個形容詞都是在形容元件用的。

在React中的設計是，你只要簡單地更新元件的狀態(state)，然後渲染(render)依照這個新狀態的新使用者介面，React會負責用最有效率的的方式來更新真實的DOM的樣子。對設計師來說，就是整個重新渲染的概念，一有小更動就整個全部渲染，有點類似不斷在瀏覽器中重新整理你的網頁。但在React中這個只是對Virtual DOM(虛擬DOM)作這件事而已，React自己會想辦法真正渲染到真實網頁上的DOM中。你可以把React想成是一個女僕或男管家，大小事都叫他去幫你處理就行了。當然為了在有些情況下，一定需要在真實的DOM元素上處理，React也提供了一些方法來存取到真實的DOM元素。

那麼在React中，要怎麼觸發重新渲染的事件？就是靠改變`state(狀態)`，也就是使用`setState`方法來改變原有的狀態值，就會觸發重新渲染(re-render)的事件，就這麼簡單而已。`state(狀態)`也只能靠`setState`方法才能改變，這是一個硬規則。

state(狀態)是代表會在程式執行時，會被改變的一種值，像我們的範例中，那個文字輸入框中的輸入文字，就會一直被改變(因為一直在輸入，它也只有這個功能…)，很明顯的它就是一個`state(狀態)`中的值。

state(狀態)一開始會在元件定義，因為state(狀態)也是個物件，所以會先定義它的初始值，以我們的範例來說是在建構式中定義`this.state`物件，其中有一個`text`屬性，初始值是空白字串:

```js
//建構式
constructor() {
    //super是呼叫上層父類別的建構式
    super()

    //設定初始的狀態。注意！這裡有個反樣式。
    this.state = {
        text: ''
    }
}
```

當使用者在文字框中不斷輸入字串時，要設計讓它會觸發`state(狀態)`的改變，以此來觸發重新渲染，所以程式碼會像下面這樣寫，`event.target.value`代表要把`text`屬性的值改變為文字框當下輸入的值:

```js
//處理的方法，用event.target可以獲取到輸入框的值，用箭頭函式可以綁定`this`
handleChange = (event) => {
    this.setState({text: event.target.value})
}
```

因為`state(狀態)`時，我們還需要把它顯示到`TextShow`元件中，所以用上面的 擁有者-被擁有者 關係的資料傳遞方式，把TextShow元件標記中的`text`屬性值先定義為`{this.state.text}`，因為`TextShow`元件位於render方法中，每次只要重新渲染時，`text`屬性值也會跟著`state(狀態)`的值改變。像下面的程式碼這樣:

```js
//渲染方法，回傳React Element(元素)
render() {
    return <div>
              //...
              <TextShow text={this.state.text}/>
            </div>
}
```

範例程式中整體的`state(狀態)`使用，以及搭配被擁有者元件的`props(屬性)`資料流，程式碼的流程就是這樣。

`state(狀態)`的運用與概念說它很容易理解也不是太容易，說很困難也不是太難，總之需要花點時間從程式的運作中去理解是最理想的。因為這個範例還算非常簡單的應用程式，之後的教學中的使用開始會複雜些。`state(狀態)`是被鎖住在元件中使用的，這也造成`state(狀態)`有一些限制，在複雜的使用者介面應用程式中，`state(狀態)`需要搭配其他的架構來協助資料流的處理。

### state(狀態)比較props(屬性)

那props(屬性)相較於state(狀態)是什麼？這個問題初學者很常問。

前面說了那麼多，props(屬性)就是元件的屬性值，在元件的標記裡設定，它的主要功能是設定元件中的"屬性"值用的，就像一顆西瓜中的屬性有重量、大小、產地、顏色、甜度之類的屬性。要特別注意，並不是說props(屬性)的值是不能改變的，而且元件不能改變自己本身的屬性，只有它的擁有者可以作這件事。

state(狀態)根本就不是是props(屬性)的相反特性，這是一個常見的誤解，它們兩個是相關配合使用的屬性，只是某些其中的屬性設計成很類似。如果你有看到網路上的比較表，我建議你可以跳過，這兩個並不是相對的東西，而且相輔相成的特性。一個元件自主在內容中管理自己本身的state(狀態)，它可以說是元件中"私有的(private)"的特性。

props(屬性)可以先設定預設值，只是在沒有給定某個props(屬性)時自動給定這個預設值。state(狀態)代表的是在應用程式執行中一直改變的值，state(狀態)給定初始值只會在一開始第一次應用程式建立執行時，才使用這個初始值，之後應用程式就不會再使用它。state(狀態)的初始值的概念與props(屬性)的預設值不太一樣。

所以上面的程式碼註解中有一個反樣式，這個反樣式就是"**不要用props(屬性)來設定state(狀態)的初始值**"，根據官方的文章內容，單純的使用屬性值來設定作內部的狀態初始而已是可接受的樣式，但是如果還要利用props(屬性)的運算結果值就不能接受。這個原因是state(狀態)的初始值只會在應用程式第一次建立時使用，之後的重新渲染並不會再使用初始值。官方的相關文章在[官網這裡](https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html)。

### 會有`state(狀態)`的元件可能是哪些元件？

React應用程式中，大部份的元件都是無狀態的(stateless)。以基本的React元件設計來說，通常最上層的元件會有狀態，因為它要管控整個應用程式中會被事件觸發的，然後可能會一直被改變的資料。另一種常見會有`state(狀態)`的元件，是裡面有包含HTML表單元素，像是文字輸入框、下拉選單之類的元件，但這不是絕對一定的，要看元件如何被設計。

基於以上的討論，元件可分成兩大類型，差別只是有沒有使用`state(狀態)`而已:

- Stateless Component(無狀態的元件): 只用`props(屬性)`，沒有使用`state(狀態)`。所有的邏輯只會依照它們所接收到的`props`值。
- Stateful Component(有狀態的元件): 有使用`props(屬性)`與`state(狀態)`的元件。

## 事件處理

React Components(元件)中的事件都是合成的(Synthetic)，並不是真正在DOM元素上的事件，也不是JavaScript中內建設計的事件物件(介面)。

React的元件從定義開始，到真正的執行完成渲染到真實的DOM元素中，是一個很複雜的過程，這裡面也包含了事件處理函式到底是要用什麼方式來執行。事件處理函式原本就是一個很特別的回調函式，當在事件觸發時是要執行從什麼地方來的函式，是在元件自己本身定義的函式(方法)？還是上層元件定義的函式(方法)？或者來自外部的模組或函式？

要講到函式的`this`值與上下文(Context)，先需要對JavaScript再科普一下，以下的內容在這本電子書[從ES6開始的JavaScript學習生活 - this章節](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/this.html)中已經有很詳盡的解說。不過因為這裡是配合React中的使用情況，所以再摘要出來加上說明。

在JavaScript中，函式一共有以下四種呼叫的樣式，它們分別是:

- 一般的函式呼叫(Function Invocation Pattern)
- 物件中的方法呼叫(Method Invocation Pattern)
- 建構函式呼叫(Constructor Invocation Pattern)
- 使用apply, call, bind方法呼叫(應用呼叫樣式 Apply invocation pattern / 間接呼叫樣式 Indirect Invocation Pattern)

對函式庫或框架(或是對具熟練技術的開發者)來說，最具彈性的是最後一種，因為它可以提供最多的方便性，以間接的呼叫樣式，在必要的時候才進行呼叫，也可以轉換函式(方法的)上下文(Context)。當你真正理解為何`this`值的真正涵義時，你會發現以下幾個事實，這可能會顛覆原本對於JavaScript中函式的想像:

- "函式定義是定義，呼叫是呼叫": 實際上在物件定義的所謂方法，你可以把它當作只是讓程式設計師方便集中管理的函式定義。
- 對`this`值來說，它根本不關心函式是在哪裡定義或是怎麼定義的，它只關心是誰呼叫了它。
- 所有的函式在呼叫時，其實都有一個擁有者物件來進行呼叫"。所以你可以說，其實所有函式都是物件中的"方法。所有的函式執行都是以`Object.method()`方式呼叫。

回到React中，新版本(0.13後)允許我們可以使用ES6的類別(Class)定義方式來定義元件，但原本的工廠模式(也就是使用`React.createClass`方法)並沒有因此而廢止不用，也就是說這兩種定義方式在基本使用上是可以獲得相等結果的，只是裡面所使用的語法細節會有所不同。對於React來說，實際上它根本也不允許你在使用new來產生ES6+類別定義的實體，那它的內部又是如何來呼叫或執行這些我們在類別裡面定義的方法的？

答案已經很明顯了，絕對不是單純的"建構函式呼叫樣式"，它是混用了多種的函式呼叫樣式，而且會使用最具彈性的那種"間接的呼叫樣式"，也就是說它明顯的使用了`this`中"**函式定義是定義，呼叫是呼叫**"的作法。

在官方對建構式樣式(ES6類別)定義方式與工廠模式(也就是使用`React.createClass`方法)的說明中，有一個非常大的差異，稱為"Autobinding"(自動綁定)，工廠模式(也就是使用`React.createClass`方法)中的`this`值是會自動綁定的，但建構式樣式(ES6類別)定義方式的`this`值"**不會**"再自動綁定。

自動綁不綁定最大的影響會在於當元件的render方法中，在React元素(JSX語法)中呼叫我們定義的函式(方法)時，最早之前的工廠模式(也就是使用`React.createClass`方法)也不會自動綁定，是後來加入的功能(v0.4, 2013)，以下的範例顯示`React.createClass`有沒自動綁定與有自動綁定的差異，出自[React官網這裡](https://facebook.github.io/react/blog/2013/07/02/react-v0-4-autobind-by-default.html):

```js
//沒自動綁定時的寫法，但這會是一個反樣式，render會被呼叫多次，回調會被建立多次
React.createClass({
  onClick: function(event) {/* do something with this */},
  render: function() {
    return <button onClick={this.onClick.bind(this)} />;
  }
});

//沒自動綁定時的正確寫法，先呼叫`React.autoBind`綁定this
React.createClass({
  onClick: React.autoBind(function(event) {/* do something with this */}),
  render: function() {
    return <button onClick={this.onClick} />;
  }
});

//有自動綁定
React.createClass({
  onClick: function(event) {/* do something with this */},
  render: function() {
    return <button onClick={this.onClick} />;
  }
});
```

> `React.autoBind`是當時的一個方法，現在應該已經沒這個東西了

由此得知，自動綁定並非一個JavaScript中的自然機制，而是由React所提供的內部實作功能。但在v0.13(2015)版本中取消了ES6類別裡面這個機制，理由除了像上面所說的，當在事件觸發時要執行的回調函式，來源可能有很多種。另一個主要的理由是為了不讓開發者造成混亂，以為在ES6類別裡這個機制是自然就有的，所以在建構式樣式(ES6類別)改成了你需要手動綁定。

要綁定類別中的方法(函式)可用下面兩種語法，出自[React官網這裡](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding):

第一種是在建構式中`constructor`加入綁定你定義的方法的語句:

```js
class Counter extends React.Component {
  constructor() {
    super()
    this.tick = this.tick.bind(this);
  }
  tick() {
    //...
  }
  //...
}
```

第二種是用箭頭函式來宣告方法:

```js
class Counter extends React.Component {
  tick = () => {
    //...
  }
  //...
}
```
> 註: 不過這個語法既非ES6也非ES7，暫且稱它為ES7+或ES8，eslint工具有可能會回報錯誤。babel工具可以正確的轉譯這個語法，所以你不需要擔心會有執行上的問題。

這樣你就可以在render方法裡的React元素中事件處理函式直接使用，與自動綁定的語法沒有差異。

```js
render: function() {
  return <button onClick={this.tick} />;
}
```
