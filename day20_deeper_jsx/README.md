# JSX語法注意事項

JSX語法是開發React的核心語法，前面的例子中都有用到，也有作一些簡單的解說。簡單的來說，它是React自創的`React.createElement`一種簡寫法，需要經過babel工具編譯才能執行。JSX語法的內容就不再多介紹，這裡是說明一些使用上的注意事項，尤其是針對JSX語法的花括號({})。

新的JSX 2.0語法已經開始在確認規格與實作當中，或許很快的地有些語法在使用上會有一些變化，最後有提供一些2.0語法中的新加入功能。

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

## JSX格式中的屬性值

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

### 基本風格3: 夾在元件標記或HTML標記的JavaScript程式碼時，一樣也要使用花括號({})括住


### 基本風格4: 多個屬性值時儘量使用多行的風格樣式，太長會難以閱讀。

像這樣的下面這樣的寫法，你可以比對一下`type`的屬性值是有雙引號的，使用花括號({})是要加入JavaScript的表達式(Expressions)，所以不加雙引號(""):

```js
<input type="text"
  value={this.state.value}
  placeholder={this.props.initText}
  onChange={this.handleChange}
/>
```

> 註: 在這本電子書的其中一個章節，中有說明更清楚的表達式定義[從ES6開始的JavaScript學習生活 - 第三章 控制流程](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part3/controlflow.html)。

## JSX中的花括號({})中到底可以塞什麼？

那麼在所謂的在花括號({})中的"JavaScript表達式"到底是可以放什麼？

雖然React官方說是表達式，但很顯然的它並不是只有單純的JavaScript中的表達式而已。由於JSX語法是由babel工具來進行轉換為對應方法，那到底是什麼能轉換什麼不能轉換，講白了就babel工具說了算，babel有提供線上的[測試應用](https://babeljs.io/repl/)，你可以試試看以下的範例是會轉換成什麼可執行的語法。

> 註: 或許你可能不知道，babel工具算是Facebook贊助的專案，它的創造者目前是Facebook的員工，是一個很年輕的程式開發者。之前的[專訪文章](https://medium.com/@sebmck/2015-in-review-51ac7035e272#.v4p4evbdr)。

以下列出常見的幾種情況，不過這些情況可能是重覆的種類，但會特別列出來代表有可能很常這樣用，或是JSX語法在解析時有一些自動的機制。

第一種是就是某個真實的值，或是簡單的運算(例如數字的加減乘除)會求出值的表達式，物件類型的值很常用在定義內聯的CSS樣式(inline CSS styles)時使用，在解析後會自動套用到DOM元素的`style`屬性中，例如:

```js
value={123 + 456}

value={true}

<Hello name={{ firstname: 'John', lastname: 'Doe' }} />

<span key={index} style = {{
    color: 'red',
    paddingRight: '10px'
}}>{"text"}</span>
```

> 註: 有時候會看到雙花括號({{}})是因為代入的值是一個物件值，在其他函式庫例如Angular這種符號有其他意義。

第二種是某個變數(或常數)，代表要從這個變數(或常數)得出值(函式或方法也是一種值)，例如:

```js
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

第四種是一個函式的呼叫(執行)，通常是會回傳陣列值或某個值的函式。你可以看到函式定義本身可以作為值，也可以用函式呼叫放在這個花括號({})中，真是一物兩用。例如:

```js
{
  this.props.results.map((result) => (
      <ListItemWrapper data={result}/>
  ))
}
```

既然可以以函式定義作為值或是作函式呼叫(IIFE也可以)，實際上要加什麼程式碼在花括號裡都是可以的，只要包含函式裡面就行了。現在有很多React的開發者，都是直接把事件處理的函式包在JSX的花括號中，例如下面這個是出自Redux的官網文件:

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

第七種是IIFE的樣式語法，它也可以塞到花括號裡，這個大概會在為了把程式碼寫得簡潔的求值情況時使用。範例出自[JSX In Depth](https://facebook.github.io/react/docs/jsx-in-depth.html):

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

> 註: 另外有一篇文章是討論有關[傳遞props](https://facebook.github.io/react/docs/transferring-props-zh-CN.html)，也是類似的語法。


## JSX中的邏輯與(&&)語法


## JSX如何分辨是開發者寫的元件還是對應HTML的DOM元素

這個問題的答案很簡單，英文大寫字元為開頭的標記代表自訂的元件，英文小寫字元為開頭的標記則是HTML的DOM元素標記。

因此，你所寫的元件類別或函式型元件的名稱，都必需以"**英文大寫字元**"為開頭。

## JSX語法的風格指引與ESLint外掛

在JSX語法流行後，Airbnb也為了JSX語法編寫一個風格指引文件 - 。

而ESLint也有對應的外掛可以使用，裡面對針對JSX語法的撰寫格式作檢查。

## JSX 2.0摘要


https://facebook.github.io/react/docs/jsx-in-depth.html

https://facebook.github.io/react/docs/conditional-rendering.html

http://www.infoq.com/cn/articles/react-jsx-and-component

https://segmentfault.com/a/1190000007814334

https://ponyfoo.com/articles/react-jsx-and-es6-the-weird-parts

https://github.com/airbnb/javascript/tree/master/react
