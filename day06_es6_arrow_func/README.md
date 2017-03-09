## ES6篇 - 箭頭函式

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day06_es6_arrow_func/asset/intro.png)

本章的目標是對箭頭函式提供一些較為全面性的介紹，除了基本的語法之外，也補充了很多React搭配使用時的實例，此外也提供撰寫的風格建議。當然，箭頭函式並不光只是語法簡短而已，它有一些與原來JavaScript中函式不同的設計，你可以把它當成是原本(傳統)的函式的改進版本。

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day06_es6_arrow_func)。

根據網路上統計的統計資料，箭頭函式(Arrow Functions)是ES6標準中，是最受歡迎的其中一種ES6新特性。它會受歡迎的原因是好處多多，只要注意在某些情況下不要用過頭就行了。有什麼好處呢？大致上有以下幾點:

- 語法簡單，少打很多字元
- 可以讓程式碼的可閱讀性提高
- 可以綁定詞法上的`this`值

> 註: 上述的統計可以參考[2ality](http://www.2ality.com/2015/07/favorite-es6-features.html)與[ponyfoo](https://ponyfoo.com/articles/javascript-developer-survey-results)這兩個網站的相關統計資料。

> 註: 本文大部份的基本語法內容是來自我電子書中的[箭頭函式](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/arrow_function.html)章節。

## 語法介紹

箭頭函式的語法如下，出自[箭頭函數(MDN)](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)：

```js
([param] [, param]) => {
   statements
}

param => expression
```

簡單的說明如下:

- 符號是肥箭頭符號(=>) (註: "->"是瘦箭頭)
- 基本上是"函式表達式(FE)的簡短寫法"

一個簡單的範例是：

```js
const func = (x) => x + 1
```

相當於

```javascript
const func = function (x) { return x + 1 }
```

所以你可以少打很多英文字元與一些標點符號之類的，函式是個匿名的函式。基本上的使用如下說明：

- 花括號({})是有意義的，如果函式有多行語句(表達式)時就要使用花括號，花括號中的`return`回傳值語句要自己寫。例如 `() => {}`
- 只有單一個傳入參數時，可以不需要左邊(前面)作為傳入參數使用的圓括號(())符號，例如 `x => x*x`

因此，初學者最容易搞混的是下面這個例子，因為有花括號({})與沒有是兩碼子事:

```js
const funcA = x => x + 1
const funcB = x => { x + 1 }

funcA(1) //2
funcB(1) //undefined
```

當沒使用花括號({})時，代表要會使用自動有`return`的作用，所以它也只能用在單一行的表達式的時候使用。使用花括號({})則是可以加入多行的語句，不過`return`不會自動加，有需要你要自己加上，沒加這個函式最後等於`return undefined`

> 註: 表達式與語句仍然有一些差異，像`throw "Error2"`是一個只有單一行的語句，但它並不能用於箭頭函式中無花括號的情況。

> 註: JS語言中函式的設計，必有回傳值，沒寫相當於回傳undefined

第二個會容易造成混亂與誤解的是，在肥箭頭符號(=>)的後面可以直接換行，下面指的是單行回傳表達式的情況，雖然不會造成錯誤但很難閱讀，所以不建議這樣寫。像下面這幾個的例子都是合法語法:

```js
// !! 不建議這樣寫 !!
const funcA = x =>
x + 1

// !! 不建議這樣寫 !!
const funcB =
x =>
x + 1
```

在這裡容易造成誤解，理由是肥箭頭符號(=>)的後面可以用換行，但"前面"不能直接接到換行，這個會造成編譯器無法編譯，瀏覽器也無法執行。我想主要原因是，畢竟這個符號是等號(=)與大於符號(>)組合而成的一個新符號，等號還有其他的用途。放在語句的前面應該就是等號的作用，再加上一個大於符號會造成語法錯誤。不管如何，別亂寫語法就對了，按照一般的你所看到的正常語法來寫就對了。

通常要換行或是寫成多行的語句時，則是要配合使用花括號或圓括號，但它們兩者在實際上的意義不同。在使用某些函式庫例如React時，你會看到在箭頭後面使用圓括號(())而非花括號({})，會使用圓括號(())會有兩個情況，第一個是仍然是有自動加retrun回傳的作用，但這個只有單一行的表達式在撰寫時區分為多行來寫，第二個是回傳值是個物件的類型值，因為物件的字面文字定義同樣也是用花括號({})，為了明顯區分出是物件的字面文字，所以用圓括號框住，這一點要相當注意。

React中因為使用了JSX語法，所以有可能你會看到一大串的JSX語法最外圍都會加上圓括號(())，例如下面的範例，我這裡只有寫一小串不過通常是一大串:

```js
const HelloWorld = (props) => (
  <div>
    <h1>{props.text}</h1>
  </div>
)
```

圓括號在JavaScript中的用途你應該有看過了一些，用於函式呼叫定義，if之類的語句中的表達式，以及它是一個群組運算符(Grouping operator)，可以明確地控制運算求值的優先次序，例如`((a + b) * c)`。在這裡的用法，則是形成一種未完結的語句，也就是撰寫時多行實際是單一整行的語句，這是由於按照JS中的ASI(Automatic Semicolon Insertion, 自動插入分號)機制，當讀到圓括號的開頭符號(`(`)會被認為這個語句尚未完成，並不會自動插入分號(;)來作語句的結束，一直到看到圓括號的結尾符號(`)`)，才會整個算作一個語句。這與使用花括號({})作為區塊語句的語法，或是函式的傳入參數寫成多行(下面的範例中就有這樣寫)有點類似，但意義不同。但用在這裡的情況仍然是箭頭函式有自動回傳的情況，也就是仍然屬於單一行的表達式。

不過，JSX語法畢竟只是一種簡寫語法，上面的範例透過babel編譯器後，它的程式碼相於下面這樣:

```js
"use strict";

var HelloWorld = function HelloWorld(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      null,
      props.text
    )
  );
};
```

要補充一點的是，雖然與箭頭函式無關，但在React中也很常見到的一種JSX的寫法，就是使用圓括號開頭符號(`(`)接在`return`關鍵字的後面，尤其是在`render`函式中，例如像下面這樣的例子:

```js
class HelloWorld extends React.Component {
    render() {
        return (
          <div>
            <h1>{props.text}</h1>
          </div>
        )
    }
}
```

它的功能也是類似上面所說的，形成一個未完結的語句，讓JS認為這行語句尚未結束，而不會作ASI的來結束語句。如果return後面沒有加上圓括號的開頭符號(`(`)，ASI會起作用然後會幫你自動加上分號(;)，這將會造成語法錯誤或是不預期的結果。這一點要特別的小心注意。

> 註: 以上關於ASI(Automatic Semicolon Insertion, 自動插入分號)的機制，可以參考這篇我寫的[部落格文章](http://eddychang.me/blog/javascript/97-js-semicolon.html)。

## `this`值的綁定

箭頭函式可以取代某些原有使用`self = this`或`.bind(this)`的情況，它可以在詞法上綁定`this`變數。但要視情況而定，而不是每種情況都一定可以用箭頭函式來取代。下面來簡單說明一下。

### 箭頭函式為什麼可以綁定this

一開頭要說的是，箭頭函式並不是完全只是原本JS中函式的縮寫語法而已，它與原本的函式內部設計有些不同，稱得上是改進過的函式。

箭頭函式與原本(傳統)的函式的不同之處，以下這兩點簡單說明:

- 沒有定義本地端綁定(local bindings)的以下幾個變數，也就是說這些變數將由lexical(詞法的)綁定: arguments, super, this, new.target
- 不能作為建構函式(constructor)使用，不能使用`new`

函式在JS中的功用很多，除了像一般的其他程式語言中的函式那樣使用外，函式也可以作為建構函式使用，這是JS中設計出來的四不像的以類別為基礎的物件導向語法，不得不說它又是一個容易造成混亂的設計，這邊我就不再多描述。

函式區塊中還有另一個隱藏的自動生成物件 - arguments。它是一個討論區中的常客，這個物件因為是隱藏的機制，除了是個"偽"陣列的物件，而且它與傳入參數有互相參照的作用，初學者如果用了它就像踏到坑裡面去，不是很容易能掌握它而且會常常出現問題。如果是以我的看法，"不要使用它"就是最佳的回答。連JavaScript的創造者[Brendan Eich](https://brendaneich.com/author/brendanmozilla-org/page/4/)都認為在ES6之後，這個物件應該逐漸要退出舞台，不需要再使用它。

在ES6之後，JS引進了一種新式的設計，稱為`Lexical this`(詞法的this)，下面簡單的說明一下。

一般而言，在JS中的預設this值，就是呼叫這個函式的物件，例如是`o.m()`，除非`m`是一個綁定方法(一般指bind這個方法)，不然this預設就是`o`。在ES5嚴格模式的作用下，一般的在詞法中函式呼叫(`f()`)的this預設都會是`undefined`，而不是window或全域物件。但如果預設的this值是`undefined`時，它也沒什麼太大的功用。

> 註: 上面這一段是摘譯[Brendan Eich](https://brendaneich.com/author/brendanmozilla-org/page/4/)的部落格的。

`Lexical this`(詞法的this)是一種預設this的自動機制，這裡所謂的詞法(Lexical)一般指的是在函式區塊中，這因為在函式呼叫時才會產生this。也就是說`Lexical this`(詞法的this)是在函式中使用一些特定的語法時，這些語法就會從週邊的作用域(函式或全域作用域)中，捕捉this值，作為自己的預設this。雖然有可能你還搞不清楚，這是在講什麼，但是這的確會非常的有用處。

箭頭函式的預設this就是用`Lexical this`(詞法的this)，它雖然是函式，但它並沒有像原本(傳統)的函式的設計，在被呼叫時以呼叫它的物件作為預設this值，或是在全域呼叫時以window或全域物件作為預設this(或是嚴格模式下是undefined)。它不是這樣設計的，它是從詞法的作用域中捕捉this值，作為自己的預設this值。

> 註: 不要把this與scope搞混了，是不一樣的東西。你可以參考這裡書中的[this](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/this.html)的內容。

> 註: 雖然說詞法環境(LexicalEnvironment)我們指的就是作用域，而ES6中也有區塊作用域(block scope)，但因為這裡討論到的是`this`，會影響到`Lexical this`(詞法的this)的只有函式或全域的作用域，其他的區域作用域(例如if, for等等)並沒有影響到。

上面講了一堆，實際看例子就會很容易理解，這是一個在函式中使用箭頭函式的例子:

```js
const obj = { a:1 }

function func() {

  setTimeout( () => {
    // 這裡`this`會以詞法上的func中為預設
    console.log(this.a)
  }, 2000)
}

func.call(obj)
```

在`setTimeout`中的箭頭函式，可以有效地捕抓到外層的func區塊中的this值，作為自己的預設this。所以當使用obj呼叫func時。箭頭函式中的`this.a`可以正確地得到`1`。

看起來沒啥大不了，比對一下如果用一般的函式定義會如何？下面是一般的函式定義方式:

```js
const obj = { a: 1 }

function func() {

  setTimeout( function() {
    // 這裡`this`，會是這個callback的自己本地(local)綁定值
    // this為window物件(嚴格模式為undefined)
    // this.a必是undefined
    console.log(this.a)
  }, 2000)
}

func.call(obj)
```

在以往這個有名的常見問題中，解決方式有很多種，要不就是要開發者自己作"捕捉"外層函式this的動作，或是用`bind`方法自己綁定，下面這是其中一種用"捕捉"外層函式this的解決方式:

```js
const obj = { a: 1 }

function func(){

  // 這裡用一個常數that先捕捉到this，讓它到作用域鏈上
  const that = this

  setTimeout(
    function(){
      // 這裡可以存取得到that
      console.log(that)
    }, 2000)
}

func.call(obj) //Object {a: 1}
```

> 註: 上面的程式碼中的`that`是隨便取的名稱，有人喜歡用`self`、`_self`、`_that`都一樣的用途。不要誤以為它是個關鍵字。

類似的問題非常多，你可以從`setTimeout`的例子就可以看到，這種用了callback(回調, 回呼)作為傳入參數的方法，在JS中多到一個程度，語法也是很常見，可見在真實的應用情況，如果能像箭頭函式能作週邊的捕抓this值，作為自己的預設this，可以得到多大的方便與減少多少的濳在問題。

當然，箭頭函式的`Lexical this`(詞法的this)作用在大部的情況都可以運作得很好，但它也有在某些下不適合使用的情況，因為`Lexical this`(詞法的this)一旦綁定過了，就無法再覆蓋，即使是用new關鍵字也不行。不過，這部份可能會比較進階，你可以參考[You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch2.md#lexical-this)與[這篇文章](https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/)中的內容。也因為如此，有些情況下你不應該使用箭頭函式，在下面的內容中會說明。

總結來說，這一章的關於this在原本(傳統)的函式與箭頭函式是不同之處如下:

- 傳統函式: this值是動態的，由呼叫這個函式的擁有者物件(Owner)決定
- 箭頭函式: this是lexical(詞法的)作用域決定，也就是由週邊的作用域所決定

## 不可使用箭頭函式的情況

以下這幾個範例都是與`this`值有關，所以說如果你的箭頭函式裡有用到`this`值的確要特別注意，並不是不能用而是要小心它的行為是不是你要的結果。

以下的每個範例都只能用一般的函式定義方式，"**不可**"使用箭頭函式。

> 註: 本節的內容大部份是參考自[When 'not' to use arrow functions](https://rainsoft.io/when-not-to-use-arrow-functions-in-javascript/)

### 用物件字面文字定義物件時，物件中的方法

因為箭頭函式會以物件在定義時的捕捉到的週邊`this`為預設`this`，也就是window或全域物件(或是在嚴格模式的undefined)。所以會造成是存取不到物件中的`array`屬性值。

```js
const calculate = {
  array: [1, 2, 3],
  sum: () => {
    return this.array.reduce((result, item) => result + item)
  }
}

//錯誤: TypeError: Cannot read property 'array' of undefined
calculate.sum()
```

### 在物件的prototype屬性中定義的方法

這種情況與上面一點類似，箭頭函式的`this`值這時會是window或全域物件(或是在嚴格模式的undefined)。

```js
function MyCat(name) {
  this.catName = name
}

MyCat.prototype.sayCatName = () => {
  return this.catName
}

cat = new MyCat('Mew')

cat.sayCatName() // undefined
```

### DOM事件處理的監聽者(事件處理函式)

箭頭函式的`this`值，相當於window或全域物件(或是在嚴格模式的undefined)。這裡的`this`值如果用一般函式定義的寫法，正確應該是要對應到被監聽DOM元素本身。

```js
const button = document.getElementById('myButton')

button.addEventListener('click', () => {
  this.innerHTML = 'Clicked button'
})
```

### 建構函式

箭頭函式沒有constructor這個設計(原本的函式中有)，直接使用`new`運算符時會拋出例外產生錯誤。

```js
const Message = (text) => {
  this.text = text
}

// 錯誤 Throws "TypeError: Message is not a constructor"

const helloMessage = new Message('Hello World!');
```

### 其他注意的限制或陷阱

- 函式物件中的`call`、`apply`、`bind`三個方法，無法"覆蓋"箭頭函式中的`this`值。
- 箭頭函式沒有原本(傳統)的函式有的隱藏arguments物件。
- 箭頭函式不能當作generators使用，使用`yield`會產生錯誤。
- 在一些函式庫像jQuery、underscore函式庫有些有使用callback(回調, 回呼)的API中不一定可以用。

## 撰寫風格建議

- callback(回調, 回呼)優先使用箭頭函式。 (Airbnb 8.1, Google 5.5.3)
- 雖然箭頭函式的左邊(傳入參數)只有一個時可以省略圓括號(`()`)，但建議你還是不論幾個都用圓括號框起來。(Google 5.5.3, eslint: [arrow-parens](http://eslint.org/docs/rules/arrow-parens.html))
- 避免合併使用箭頭函式與其他的比較運算符(>=, <=)，這會造成閱讀上不使與混亂。(Airbnb 8.5)
- 肥箭頭符號的前後要加一個空格，不要黏在一起。另外，不要直接在符號前後換行。(前面不行，後面要用圓括號或花括號，上面有說明) (eslint: [arrow-spacing](http://eslint.org/docs/rules/arrow-spacing.html))

## 結論

本章對於箭頭函式的用法作了一翻全面性的說明，語法上很簡單，但其中比較不同的是對箭頭函式中的`Lexical this`(詞法的this)作了一些簡單的說明，相信你看過之後，應該會對箭頭函式有更進一步的認識。這個ES6新的函式語法，改善了許多長久以來在函式中使用上的this綁定問題。在之後的類別章節中，我們會再見到箭頭函式的用法。
