# React篇: JSX語法撰寫指引

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day18_deeper_jsx/asset/intro.png)

JSX語法是開發React的核心語法，前面的例子中都有用到，也有作一些簡單的解說，在進行下一章前，我們還需要更進一步理解這個語法。它是React自創的`React.createElement(component, props, ...children)`一種簡寫法(或稱為人造的語法糖)，需要經過babel工具編譯才能執行。本篇將說明一些使用上的注意事項，尤其是針對JSX語法的花括號({})。

另外，新的[JSX 2.0](https://github.com/facebook/jsx/issues/65)語法已經開始在確認規格與實作當中，相信很快的地有些語法在使用上會有一些變化，之後有時間再來對新的JSX 2.0作一些整理說明。

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day18_deeper_jsx/)。

## JSX語法中只能有一個根元素

這個是初學者常犯的錯誤，這是JSX語法使用的基本原則，超過一個以上的根元素，將會造成無法編譯為`React.createElement`語句，所以會產生錯誤。所以像下面的範例是一定會出錯的:

```js
// 錯誤示範!!
ReactDOM.render(
    <div>Test</div>
    <div>Test 2</div>,
  document.getElementById('root')
)
```

通常在外圍多加一個`<div>`標記就可以解決這個問題，像下面的範例這樣:

```js
ReactDOM.render(
  <div>
    <div>Test</div>
    <div>Test 2</div>
  </div>,
  document.getElementById('root')
)
```

最後會由babel工具編譯的結果會像下面這樣的程式碼，你可以看到會呈現有巢狀的結構:

```js
ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(
    'div',
    null,
    'Test'
  ),
  React.createElement(
    'div',
    null,
    'Test 2'
  )
), document.getElementById('root'));
```

## JSX在標記中的基本撰寫風格

幾個使用的基本風格指引，這也是一開始使用JSX時會有點不太習慣的地方，它雖然長得很像HTML語法，但用起來卻沒那麼自由。

### 基本風格1: 當使用一般的字串值當屬性值時，字串使用雙引號("")括住，而且等號(=)與屬性之間，以及等號(=)與值之間，不需要加空格。

```js
<TodoItem text="buy book" index="1" />
```
### 基本風格2: 當使用花括號({})作為屬性值時，不需要加上雙引號("")，而且等號(=)與屬性之間，以及等號(=)與值之間，不需要加空格。

在花括號({})中相當於要寫JavaScript的程式碼，JSX會對花括號裡的表達式進行求值運算。所以花括號中的字串建議用單括號('')括住，以此與上一個風格作區別。

```js
<TodoItem text={'play game'} index="1" />
```

### 基本風格3: 夾在元件標記或HTML的DOM元素標記的JavaScript程式碼時，一樣也要使用花括號({})框住

這個在之前的例子中有看到，如果你要在元件標記或DOM元素中加入JavaScript程式碼，也是用花括號({})框住

```js
<ul>
{
  this.state.items.map((value, index) => {
    return <TodoItem key={index} text={value} index={index} onItemClick={this.handleRemoveItem}/>
  })
}
</ul>
```

### 基本風格4: 多個屬性值時儘量使用多行的風格樣式，太長會難以閱讀

每行的字元數儘可以控制在一個畫面就能看得清楚的情況。像下面這樣的寫法，你可以比對一下`type`的屬性值是有雙引號的，使用花括號({})是要加入JavaScript的表達式(Expressions)，所以不加雙引號(""):

```js
<input type="text"
  value={this.state.value}
  placeholder={this.props.initText}
  onChange={this.handleChange}
/>
```

> 註: 在這本電子書的其中一個章節，中有說明更清楚的表達式定義[從ES6開始的JavaScript學習生活 - 第三章 控制流程](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part3/controlflow.html)。

## JSX的花括號使用的情況

JSX語法的花括號({})使用的情況將會有兩個地方，一個是在標記中的props(屬性)指定值時使用，另一個是在標記與標記之間，也就是有可能是在像`<div>...</div>`這樣的標記之中。這兩種情況下，運算求值結果都是類似的，但仍然有一些小差異，以下是一些說明。官網的參考資料在這篇[JSX In Depth](https://facebook.github.io/react/docs/jsx-in-depth.html)。

### 在JSX中的props(Props in JSX)

之前有說過可以在props裡指定JavaScript的各種原始資料類型，而物件、函式、陣列等類型的值也是可以。最終這些值在最下層的元件，也是會轉為HTML的DOM元件標記來作最終輸出的工作。

直接使用雙引號("")，只能對props指定一個字串值，其他的都不行，像下面這樣的例子:

```js
<TodoItem text="a string" index="1" />
```

其實上面的例子相當於用花括號的下面這個程式碼:

```js
<TodoItem text={'a string'} index={'1'} />
```

使用花括號({})因為可以使用表達式，所以在props的指定值時，可以更具彈性，像下面這樣的使用了花括號，指定的值就可以不只有字串值，而且可以運算:

```js
<TodoItem text={'a string'+'other string'} index={1} />
```

JSX語法中的花括號({})會作一些比你想像中還多的求值運算，它並不是標準的JavaScript單純的表達式求值而已，JSX語法會有自動處理的情況，這一點要特別的注意。

在原始資料的情況，一般在輸出到網頁上時，JavaScript總是會把值想辦法轉為字串值，然後呈現在網頁上。但JSX語法中的求值並不是這樣作的。下面是個比較的例子

```js
ReactDOM.render(<div>{true}</div>, document.getElementById('root')) //不出現任何字串

document.getElementById('normal').innerHTML = true //在網頁上呈現 true 字串
```

也就是說，在JSX中的布林值(花括號裡)，一律最後會被略過不輸出。像布林值這樣的，還有`null`與`undefined`值。

> 特別注意: JSX中的布林、null、undefined將會被忽略

在props指定值的部份，如果你只寫出一個屬性名稱，但沒有指定給任何的值，JSX會預設指定給它`true`(布林值)，這也是一個自動的設計。像下面這樣的JSX語法中，autoFocus這屬性是設為`true`:

```js
<input autoFocus type="text" />
```

相當於下面的程式碼:

```js
<input autoFocus={true} type="text" />
```

> 特別注意: JSX中對props(屬性)指定值時，沒給值的情況是給預設的布林值`true`

在JSX中你也沒辦法使用真實的HTML，所有的類似於HTML語法的字串，都會被跳脫(escape)，例如下面的例子:

```js
ReactDOM.render(<div>{'<span>a string</span>'}</div>, document.getElementById('root'))

//HTML語法的字串會被跳脫為`&lt;span&gt;a string&lt;/span&gt;`
```

使用展開運算符(...)在指定props的值上，是另一種更加簡化的語法，它是把已有的props物件值展開來指定這個元件中，例如下面的語法:

```js
const props = {foo: 1, bar: 2}
const component = <Component {...props} />
```

談到這裡，就要再說明一下對於物件、函式(定義)、字串的最後輸出，簡單的比較是用上面的那個比較`innerHTML`與`ReactDOM.render`輸出的差異，像下面的程式碼:

```js
ReactDOM.render(<div>{{a:1}}</div>, document.getElementById('root'))

document.getElementById('normal').innerHTML = {a:1}
```

我把它列成下面的幾個項目(輸出的都是字串值):

|   | 物件({a:1}) | 陣列([1,2]) | 函式(()=>1) |
|---|---|---|---|
| innerHTML | 不顯示  | 1,2  | function () { return 1; } |
| Children in JSX | 錯誤中斷 | 12  | 不顯示 |

上面是直接把JSX語法中的花括號({})寫成元素或元件之中，你可以比較一下與innerHTML的差異。

但如果用在指定props值時，就不是這樣子的結果，下面是使用一個簡單的例子來實驗，程式碼類似下面這樣:

```js
const TodoItem = (props) => <div>{props.text}</div>

ReactDOM.render(<TodoItem text={()=>1} />, document.getElementById('root'))
```

結果與上面很像

|   | 物件({a:1}) | 陣列([1,2]) | 函式(()=>1) |
|---|---|---|---|
| Props in JSX | 錯誤中斷 | 12  | 不顯示 |

上面這個用物件時產生的中斷錯誤訊息如下:

```
Objects are not valid as a React child (found: object with keys {a}). If you meant to render a collection of children, use an array instead or wrap the object using createFragment(object) from the React add-ons. Check the render method of `TodoItem`.
```

由上面的實驗結果來看，JSX用於props中進行指定值，與用於標記或元件之中的情況，設計上在求值運算的結果是一樣的。

> 註: 這裡不使用console.log來比較，是因為console.log是會作強制的toString運算，你也可以比較一下，不過JSX的求值與toString就差更多了。

對props指定物件值，目前看到只有少數幾個屬性的特例，例如像style這個屬性，JSX會自動運算求值轉換正確的字串值，像下面的程式碼:

```js
const divStyle = {
  color: 'blue',
  fontSize: 16,
}

const TodoItem = (props) => <div style={divStyle}>{props.text}</div>

ReactDOM.render(<TodoItem text="Text" />, document.getElementById('root'))
```

最後輸出到真實網頁上的HTML碼，會自動把原本是物件值的divStyle整個轉成一個字串值，像下面這樣:

```
<div data-reactroot="" style="color: blue; font-size: 16px;">Text</div>
```

陣列值也很特別，它是用`join('')`方法運算連接陣列成員。對比一般的JavaScript的陣列轉為字串的強制運算，則是用`join()`，成員之間會有逗號。

### 在JSX中的子元素(Children in JSX)

上一節主要說明在JSX中用於props指定值的情況，這一節主要是說明把JSX用於子元素的情況，實際上上一節也講過了一些。

JSX語法用於子元素，主要是像下面這樣的語法，夾在開頭的標記與結尾標記之間，這`Hello world!`明顯也是一個字串值，只不過用於props指定值時，會需要加雙引號，這裡不用:

```js
<MyComponent>Hello world!</MyComponent>
```

這相當於下面的寫法:

```js
<MyComponent>{'Hello world!'}</MyComponent>
```

當然你也可以混用有花括號與無花括號的字串在一起使用，尤其是作為變數值來作連接時，例如下面的例子:

```js
<MyComponent>Hello world! {prop.text}</MyComponent>
```


JSX語法會自動對其中的字串作幾件事，這與HTML語法不太一樣，首先它會忽略掉中間的`Hello world!`字串值的前面或後面的空白、換行，而如果`Hello`與`world!`中間的有換行，它會自動變為空一格，所以下面的例子都是最後得到和上面一樣的結果:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

> 特別注意: 在寫JSX語法時，要儘可能把其中的字串值的撰寫格式寫得整齊些。不要造成格式的上誤判情況。

JSX語法中，也可以形成巢狀的結構，類似於HTML中的DOM結構。這在之前的例子中也有看到過了，像下面的例子:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

以函式作為子元素(Functions as Children)是一種特殊語法，在JSX中的表達式(一般指在花括號中的)，會進行求值運算，最後主要會求出字串值、React元素或是上面這兩種的列表(陣列值)，當子元素是個JSX表達式時，可以用`props.children`作為函式識別名來使用，像下面這樣的例子:

```js
const TodoItem = (props) => <div>{props.children('Eddy')}</div>

ReactDOM.render(
  <TodoItem>
    {(name)=><div>Hello! {name}</div>}
  </TodoItem>,
   document.getElementById('root'))
```

這種語法很特別，在網路上也有一些討論的文章，你可以再參考這篇[Function as Child Components](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9#.ellbd0ai5)

## JSX中的邏輯與(&&)語法

上面已經有說過，JSX會忽略掉所有在花括號({})中的布林值，不論是true或false，所以你會看到有人會使用邏輯與(&&)作為控制流程的語法，像下面這樣，這個例子出自[這裡](https://facebook.github.io/react/docs/conditional-rendering.html#inline-if-with-logical-ampamp-operator):

```js
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  )
}
```

邏輯與(&&)和之前我們在預設值的那一篇文章中有說過的邏輯或(||)運算，一樣是短路求值，它的運算方式是:

- 當true && expression時，得到expression求出的值
- 當false && expression時，得到false

也就是上面的例子中，當得到false值時，JSX就不輸出任何東西。只有當得到true值時，JSX會以expression(表達式)得到的值來作輸出使用。

這也是一種運用JSX語法的特性所出現的一種簡短寫法。

## JSX中的花括號({})中到底可以塞什麼？

那麼在所謂的在花括號({})中的"JavaScript表達式"到底是可以放什麼？

雖然React官方說是表達式，但很顯然的它並不是只有單純的JavaScript中的表達式而已。由於JSX語法是由babel工具來進行轉換為對應方法，那到底是什麼能轉換什麼不能轉換，講白了就babel工具說了算，babel有提供線上的[測試應用](https://babeljs.io/repl/)，你可以試試看以下的範例是會轉換成什麼可執行的語法。

> 註: 或許你可能不知道，babel工具算是Facebook贊助的專案，它的創造者目前是Facebook的員工，是一個很年輕的程式開發者。之前的[專訪文章](https://medium.com/@sebmck/2015-in-review-51ac7035e272#.v4p4evbdr)。

以下列出常見的幾種情況，不過這些情況可能是重覆的種類，但會特別列出來代表有可能很常這樣用，或是JSX語法在解析時有一些自動的機制。

第一種是就是某個真實的值，或是簡單的運算(例如數字的加減乘除)會求出值的表達式，物件類型的值很常用在定義內聯的CSS樣式(inline CSS styles)時使用，在解析後會自動套用到DOM元素的`style`屬性中，例如:

```
value={123 + 456}

value={true}

<Hello name={{ firstname: 'John', lastname: 'Doe' }} />

<span key={index} style={{
    color: 'red',
    paddingRight: '10px'
}}>{"text"}</span>
```

> 註: 有時候會看到雙層花括號是因為在JSX中代入的值是一個物件值，不過在其他函式庫例如Angular這種符號有其他意義。

第二種是某個變數(或常數)，代表要從這個變數(或常數)得出值(注意函式或方法也是一種值)，例如:

```
value={this.state.value}

defaultValue={this.props.initText}

onChange={this.handleChange}
```

第三種是陣列值，我會特別把它列出來自成一類，是因為陣列在解析時會直接被轉成字串值，很常用在輸出子元素時，像下面的範例這樣:

```js
const arr = [
  <h1>Hello world!</h1>,
  <h2>React is awesome</h2>
]

ReactDOM.render(
  <div>{arr}</div>,
  document.getElementById('root')
)
```

> 特別注意: 陣列值在轉換為字串時，不會像JavaScript中的會加上逗號，而是直接連接每個成員。

第四種是一個函式的呼叫(執行)，通常是會回傳陣列值或某個值的函式。你可以看到函式定義本身可以作為值，也可以用函式呼叫放在這個花括號({})中，真是一物兩用。例如:

```js
{
  this.props.results.map((result) => (
      <ListItemWrapper data={result}/>
  ))
}
```

既然可以以函式定義作為值或是作函式呼叫(IIFE或IIAF也可以)，實際上要加什麼程式碼在花括號裡都是可以的，只要包含函式裡面就行了。現在有很多React的開發者，都是直接把事件處理的函式包在JSX的花括號中，例如下面這個是出自Redux的官網文件:

```js
const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)
```

第五種是三元運算語句，它是`if...else`語法的簡單寫法。這也很常見，最後會由判斷求出一個值而且是單一行的語句，三元運算的值也可以是元件或HTML元素標記，例如:

```js
<Person name={window.isLoggedIn ? window.name : ''} />

<Container>{window.isLoggedIn ? <Nav /> : <Login />}</Container>
```

> 註: `if...else`語句目前"不能"直接用在花括號之中，只有三元運算可以，請參考[If-Else in JSX](https://facebook.github.io/react/tips/if-else-in-JSX.html)

第六種是註解，在花括號({})裡只能用`/*...*/`這種格式的註解，例如:

```js
{/* child comment, put {} around */}
```

第七種是IIFE的樣式語法，它也可以塞到花括號裡，這個大概會在為了把程式碼寫得簡潔的求值情況時使用。範例出自JSX In Depth(舊版的官網文章):

```js
{(() => {
        switch (this.state.color) {
          case "red":   return "#FF0000";
          case "green": return "#00FF00";
          case "blue":  return "#0000FF";
          default:      return "#FFFFFF";
        }
      })()}
```

第八種稱之為"展開運算符(...)"的語法，因為使用在物件上所以是一種ES7+語法，把props當作物件來看，然後直接展開裡面的值就是。範例出自[這裡](https://facebook.github.io/react/docs/jsx-spread-zh-CN.html)

```js
const props = {}
props.foo = x
props.bar = y
const component = <Component {...props} />
```

上面的展開語句相當於經過babel轉換過的下面語句:

```js
//babel轉換
var component = React.createElement(Component, props);
```

不過如果再加上state(狀態)的展開，它就會變成合成(Composition)樣式的語句:

```js
const component = <Component {...props} {...state}/>

//以下為經過babel轉換後
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var component = React.createElement(Component, _extends({}, props, state));
```

## JSX如何分辨是開發者寫的元件還是對應HTML的DOM元素

這個問題的答案很簡單，英文大寫字元為開頭的標記代表自訂的元件，英文小寫字元為開頭的標記則是HTML的DOM元素標記。

因此，你所寫的元件類別或函式型元件的名稱，都必需以"**英文大寫字元**"為開頭。

## JSX語法的風格指引與ESLint外掛

在JSX語法流行後，Airbnb也為了JSX語法編寫一個風格指引文件 - [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)。

而ESLint也有對應的外掛 - [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)可以使用，裡面對針對JSX語法的撰寫格式作檢查。

## 結論



## 參考資料

- https://facebook.github.io/react/docs/jsx-in-depth.html
- https://facebook.github.io/react/docs/conditional-rendering.html
- http://www.infoq.com/cn/articles/react-jsx-and-component
- https://ponyfoo.com/articles/react-jsx-and-es6-the-weird-parts
- https://github.com/airbnb/javascript/tree/master/react
