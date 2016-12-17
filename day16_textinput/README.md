# React篇: TextInput程式

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day16_textinput/asset/intro.png)

"本文章附有影片"。這個程式最後的呈現結果，會是在網頁上出現一個文字輸入框，當你輸入文字時，下面的顯示區域會一併跟著顯示，就像下面的動態圖片這樣:

![TextInput元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day16_textinput/asset/textinput_demo.gif)

> 註: 本文章附有影片，影片網址在[Youtube的這個網址](https://youtu.be/h2_40fj5AjI)。本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day16_textinput)，所有的程式碼也在裡面。

我們在這個範例程式中，要使用四個程式碼檔案，其中二個與之前的幾乎是一樣的。

第一個是無狀態的顯示元件，名稱是TextShow，它的檔案名稱是TextShow.js，裡面的內容很簡單，只有下面這樣而已:

> components/TextShow.js

```js
// @flow
import React from 'react'

const TextShow = (props: { text: string }) => (
    <h1>{props.text}</h1>
)

// 加入props的資料類型驗証
TextShow.propTypes = {
  text: React.PropTypes.string.isRequired
}

// 匯出TextShow模組
export default TextShow
```

你可以看到這支程式最上面已經有加了`// @flow`的註記，這代表它會被Flow工具進行檢查，Flow工具有一些與React特別搭配的檢查工具，其中它會檢查`props`在這種函式元件語法中，在傳入值時是什麼樣的物件類型結構，因為我們的TextShow只有一個text屬性會由上層元件傳入，所以用`props: { text: string }`來指定傳入的props的型態。

另一個檔案是我們主要的元件名稱是TextInput，而且它裡面會匯入使用到TextShow元件，檔名一樣是用`TextInput.js`，因為檔案滿長的，所以分幾個部份來看首先是最前面的部份:

> components/TextInput.js

```js
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

    //後面還有程式碼...
}
```

這支程式的最上面也有加了`//@flow`的註記，它會對React中的一些特性作檢查，一個是props，另一個是state這兩個物件的結構。你可以注意到它們的設定方式不太一樣，這個部份的程式展示了建構式的寫法，建構式區塊中的第一行，通常都是使用`super()`來呼叫繼承的父類別。

```js
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
```

這個接下來的程式碼部份，是這個範例的重點。首先這使用了之前說明的在類別中的箭頭函式，這是一個超出ES6標準的語法。這是為了要綁定this在這個方法中可以使用，因為在這個方法中，我們需要使用到`this.setState`這個方法。

`setState`是一個元件中非常重要的方法，state(狀態)是元件的內部使用的一個值(一般為物件值)，在元件中的state是不可以直接更動其中所包含的值，也就是如果你直接用`this.state.text = 'Hello'`這樣的更動語句，React會產生錯誤給你。唯一可以更動state的，只有透過`setState`這個方法，這是React中我們學到的第二條強硬規則。

> 特別注意: 唯一可以更動元件中的state(狀態)，只有使用setState方法。

這個`handleChange`方法主要是要處理文字框輸入的事件，它可以獲取得到事件物件，在React中使用JSX語法所寫的事件都是人造(假的)事件，是由React中設計出來對應真實DOM中的事件物件，實際在使用時與一般的事件差不多。React中的事件的對應，類似於DOM事件處理模型的內聯模型的寫法，是寫在JSX語法中對應的DOM元件標記上的。也就是對應下面的這段在`render`方法中`onChange`的語法:

```js
<input type="text"
  value={this.state.text}
  placeholder={this.props.initText}
  onChange={this.handleChange}
/>
```

React中的人造事件，都是使用小駝峰的命名法，例如`onChange`、`onClick`這樣，而DOM事件處理內聯模型是用全小寫，React會協助處理用監聽的方式來處理事件，你**不需要**再使用`addEventListener`的方法來作事件的監聽。關於React中處理事件的方式，你可以參考官方的[這篇文件](https://facebook.github.io/react/docs/handling-events.html)中的說明。

第三個檔案是App.js，它仍然是最上層的用於集中所有元件的元件，與之前的範例相同。它會設定TextInput中的props.initText這個屬性值。程式碼如下:

> components/App.js

```js
import React from 'react'
import TextInput from './TextInput'

class App extends React.Component {
  render() {
    return <TextInput initText="開始輸入文字吧！" />
  }
}

//輸出App元件
export default App
```

第四個檔案是我們用來呈現元件在網頁上的程式碼檔案index.js，裡面會引用TextInput元件，程式碼如下:

> index.js

```js
import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

render(
  <App />,
  document.getElementById('root')
)
```

---

## 其他部份的詳細解說

### 用propTypes限制props(屬性)值的類型

props(屬性)並沒有限制你只能指定給它什麼樣類型的值，可以是JavaScript中常見的幾種資料類型，字串、數字、布林、函式、陣列、物件與符號(Symbol)。你從範例中看到，元件會自動就會取得你所定義的props(屬性)值，例上面的範例中`TextShow`元件中的程式碼使用了一個名稱為`text`的props(屬性)，在JSX中使用它就可以獲取得到設定的值。

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

關於其他的可使用的props驗証，請參考[React官網這裡](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)的說明，可用的規則還滿多的。不過你大概已經發現了，`propTypes`只會出警告，並不會發生錯誤來中斷你的程式，也就是說它並不是一種強制性的類型限制。我們之後在其他的教學範例中會看到使用這些規則

### 用Flow標記來限制props與state的值類型

在程式碼的最上面，你可能已經有注意到加入了`//@flow`。因為使用了Flow工具協助檢查，Flow對React的程式碼可以作一些特別的檢查，在這一節提供一些說明。

對於像`TextShow`這樣的函式元件語法來說，它會針對函式的傳入參數(也就是props)作檢查，所以你需要加上props的物件結構，作為傳入參數的靜態類型，像下面這樣的程式碼:

```js
const TextShow = (props: { text: string }) => (
    <h1>{props.text}</h1>
)
```

props是一個物件的類型，裡面的結構就只能是`{ text: string }`，代表它裡面只有一個`text`屬性，而且值限定為字串類型。

當然，之前我也有提過在這種函式元件語法中，可以在傳入參數的地方使用解構的語法，如果像上面範例，在傳入參數用了解構賦值的話，會像下面這樣的語法:

```js
const TextShow = ({ text = '' }: { text: string }) => (
    <h1>{text}</h1>
)
```

另外，在TextInput元件中則展示了Flow工具，對於像類別元件的語法，如何加上標記來作state與props的語法，這兩種有些差異。

porps(屬性)的類型需要寫在整個類別之外，用type來定義一個類型別名，像下面這樣的語法:

```js
type Props = {
  initText: string,
}
```

然後在建構式中有用到props時，加上標記，像下面這樣的程式碼:

```js
constructor(props: Props) {
    super(props)
    this.state = {
        text: '',
    }
}
```

state(狀態)的類型則是要寫在類別裡面，直接用state作類型設定就可以了，這在建構式的上面有這一行，就是針對state的靜態類型的結構設定:

```js
state: {
      text: string,
    }
```

Flow工具可以協助我們，進行state與props的靜態類型的預先設定，相較於目前React只能用`PropTypes`設定`props`值類型的設計還要更具彈性，但目前這個檢查仍然只是多了一層保障而已，它與程式真正在執行時無關。對於Flow工具如何搭配React來使用，可以參考Flow官網的[這篇文章](https://flowtype.org/docs/react.html#_)。

### props(屬性)的預設值

props(屬性)也可以設定一個預設值，可以使用`defaultProps`來給定某個props(屬性)的預設值，這個屬性的設定方式與上面的`propTypes`屬性一模一樣。

所以在`TextShow`元件中設定其中的text屬性的預設值語法，注意這是設定在函式的外面:

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

這個預設值只會在元件的這個屬性，沒有被設定任何值時才會使用到。當有設定預設值(`defaultProps`)時，`propTypes`中的`isRequired`(必要)檢查就會算通過了。

### 元件的"擁有者-被擁有者(owner-ownee)"關係

`props`(屬性)中有關"擁有者-被擁有者(owner-ownee)" 的關係，這關係只會存在於React元件定義中，擁有者通常指的是某個位於上層的元件。規則很簡單:

- A元件在`render()`中建立了B元件，A就是B的擁有者。(或者可以說因為A元件的定義中設定了B元件的屬性)
- 元件是無法改變自己的`props`(屬性)，這是它的擁有者才可以作的事。

擁有者-被擁有者 關係對比DOM元素中的樹狀結構中的父母-子女關係，父母-子女是類似DOM中的直接的上下層結構關係，而擁有者-被擁有者 關係是定義時的設定props(屬性)的關係。以我們的例子來說:

- "擁有者-被擁有者" 關係: TextInput元件是div、input與TextShow元件的擁有者
- "父母-子女" 關係: TextShow元件的父母節點是div

"擁有者-被擁有者(owner-ownee)"的關係之所以會重要，因為它涉及到資料流(Data Flow)的概念。元件本身無法改變自己的props(屬性)，對元件本身來說，自己的屬性是無法改變的(immutable)，但它的擁有者元件可以。

這可以形成我們看到的第一種元件互相溝通的關係，由"擁有者-被擁有者(owner-ownee)"所建立的 - `擁有者 -> 被擁有者`的資料流，以我們的範例來說，也就是直接在TextInput(擁有者)元件中的定義裡，直接設定TextShow(被擁有者)元件的props屬性。

### state(狀態)

> Components are Just State Machines (元件就是狀態的機器) ~ React官方文件

state(狀態)是元件中重要的特性，React認為元件就是狀態的機器，代表state(狀態)特性在元件中的重要程度。不過並不是所有的元件都要變成狀態機器，在你的應用程式中使用的組成元件們，大部份都是無狀態(Stateless)的元件，只有少數幾個會是有狀態的(Stateful)的元件。無狀態(Stateless)的元件一般都只會寫成函式元件的語法。

在React中的設計是，你只要簡單地更新元件的狀態(state)，React會負責用最有效率的的方式來更新真實的DOM的樣子。對開發者來說，就是整個重新渲染的概念，一有小更動就整個全部渲染，有點類似不斷在瀏覽器中重新整理你的網頁。但在React中只是對Virtual DOM(虛擬DOM)作這件事而已，React自己會想辦法真正渲染到真實網頁上的DOM中。你可以把React想成是一個女僕或男管家，大小事都叫他去幫你處理就行了。當然為了在有些情況下，一定需要在真實的DOM元素上處理，React也提供了一些方式可以存取到真實的DOM元素。

那麼在React中，要怎麼觸發重新渲染的事件？

就是靠改變`state(狀態)`，也就是使用`setState`方法來改變原有的狀態值，就會觸發重新渲染(re-render)的事件，就這麼簡單而已。再次強調，`state(狀態)`也只能靠`setState`方法才能改變，這是一個強硬規則。

state(狀態)是代表會在程式執行時，會被改變的一種值，像我們的範例中，那個文字輸入框中的輸入文字，就會一直被改變(因為一直在輸入，它也只有這個功能…)，很明顯的它就是一個`state(狀態)`中的值。

state(狀態)一開始會在元件定義，因為state(狀態)也是個物件，所以會先定義它的初始值，以我們的範例來說是在建構式中定義`this.state`物件，其中有一個`text`屬性，初始值是空白字串:

```js
//建構式
constructor() {
    //super是呼叫上層父類別的建構式
    super()

    //設定初始的狀態。注意！這裡有個反樣式，不要用props的值來設定state的初始值。
    this.state = {
        text: ''
    }
}
```

當使用者在文字框中不斷輸入字串時，要設計讓它會觸發`state(狀態)`的改變，以此來觸發重新渲染，所以程式碼會像下面這樣寫，`event.target.value`代表要把`text`屬性的值改變為文字框當下輸入的值:

```js
//處理的方法，用e.target可以獲取到輸入框的值，用箭頭函式可以綁定`this`
handleChange = (e) => {
    this.setState({text: e.target.value})
}
```

因為`state(狀態)`時，我們還需要把它顯示到`TextShow`元件中，所以用上面的 擁有者-被擁有者 關係的資料傳遞方式，把TextShow元件標記中的`text`屬性值先定義為`{this.state.text}`，因為`TextShow`元件位於render方法中，每次只要重新渲染時，`text`屬性值也會跟著`state(狀態)`的值改變。像下面的程式碼這樣:

```js
//渲染方法，回傳React Element(元素)
render() {
    return <div>
              <TextShow text={this.state.text}/>
            </div>
}
```

範例程式中整體的`state(狀態)`使用，以及搭配被擁有者元件的`props(屬性)`資料流，程式碼的流程就是這樣。

`state(狀態)`的運用與概念並不困難，只要花點時間就能掌握。因為這個範例還算非常簡單的應用程式，之後的教學中的使用開始會複雜些。`state(狀態)`是被鎖住在每個元件中使用的，這也造成`state(狀態)`有一些限制，在複雜的使用者介面應用程式中，`state(狀態)`需要搭配其他的架構來協助資料流的處理。

### state(狀態) 比較 props(屬性)

那props(屬性)相較於state(狀態)是什麼？

前面說了那麼多，props(屬性)就是元件的屬性值，在元件的標記裡設定，它的主要功能是設定元件中的"屬性"值用的，就像一顆西瓜中的屬性有重量、大小、產地、顏色、甜度之類的屬性。要特別注意，並不是說props(屬性)的值是不能改變的，而是元件不能改變自己本身的屬性，只有它的擁有者元件可以作這件事。

state(狀態)並不是props(屬性)的相反特性，這是一個常見的誤解，它們兩個是相關配合使用的屬性，只是某些其中的屬性設計成很類似。如果你有看到網路上的比較表，我建議你可以跳過，這兩個並不是相對的東西，拿來作比較反而會造成誤解。它們是相輔相成的特性。一個元件自主在內容中管理自己本身的state(狀態)，它可以說是元件中"私有的(private)"特性。

props(屬性)可以先設定預設值，只是在沒有給定某個props(屬性)時自動給定這個預設值。state(狀態)代表的是在應用程式執行中一直改變的值，state(狀態)給定初始值只會在一開始第一次應用程式建立執行時，才使用這個初始值，之後應用程式就不會再使用它。state(狀態)的初始值的概念與props(屬性)的預設值不太一樣。

所以上面的程式碼註解中有一個反樣式，這個反樣式就是**不要用props(屬性)來設定state(狀態)的初始值**，根據官方(上一版的)的文章內容，單純的使用屬性值來設定作內部的狀態初始而已是可接受的樣式，但是如果還要利用props(屬性)的運算結果值就不能接受。這個原因是state(狀態)的初始值只會在應用程式第一次建立時使用，之後的重新渲染並不會再使用初始值。

### Flow工具對於文字輸入框的檢查

在TextInput元件中，這個`handleChange`方法，除了定義傳入參數的事件e是個Event物件外，另外在裡面也對e.target需要作檢查，它必須要是`HTMLInputElement`的物件實體，才能夠獲取到`value`值，這些都是因為使用了Flow工具，如果你不加這些檢查或標記，Flow工具會認為這個地方是有錯誤的。

```js
handleChange = (e: Event) => {
  // Flow會檢查必定要HTMLInputElement的物件才能有輸入值
  if (e.target instanceof HTMLInputElement) {
    this.setState({text: e.target.value})
  }
}
```

當然，如果沒用Flow工具，程式碼寫起來很簡單，快要可以寫成一行了:

```js
handleChange = (e) => {
  this.setState({text: e.target.value})
}
```

Flow工具自然有它的好處，它可以針對是不是文字輸入框作一些預先的檢查，在DOM元素上的事件基本上原本就需要經過判斷，才能知道它是由文字輸入框輸入的，還是一般的DOM元素像div的觸發事件。我覺得這是要逐漸習慣的部份。

## 影片

[![Day16](http://img.youtube.com/vi/h2_40fj5AjI/0.jpg)](https://www.youtube.com/watch?v=h2_40fj5AjI)

## 結論

本章簡單的寫了一個範例，這是文字輸入欄位，並且用了state(狀態)，以及props裡的`propTypes`與`defaultProps`設定。從這個小小的範例當中，我們可以學到以下重要的幾個知識:

- state(狀態)是每個元件內部的私有資料，只能透過setState才能更動它
- propTypes可以協助開發者限制props的類型與決定是否必要
- defaultProps可以在沒有設定props的值的時候使用
- Flow工具可以針對React中的state與props作預先定義靜態類型
