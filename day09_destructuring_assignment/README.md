# 解構賦值

解構賦值(Destructuring Assignment)是一個在ES6的新特性，用於提取(extract)陣列或物件中的資料，這是一種對原本語法在使用上的改進，過去要作這件事可能需要使用迴圈或迭代的語句才行，新語法可以讓程式碼在撰寫時更為簡短與提高閱讀性。

解構賦值的解說只有一小段英文，這一段是來自[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)(不過是舊版的網站上)：

> The destructuring assignment syntax is a JavaScript expression that makes it possible to extract data from arrays or objects using a syntax that mirrors the construction of array and object literals.

這句後面的`mirrors the construction of array and object literals`，代表這個語法的使用方式 - 如同"**鏡子**"一般，對映出陣列或物件字面的結構。也就是一種樣式(pattern)對映的語法。它在處理具有多層次的巢狀的物件結構會顯得特別有用。

在使用時有以下幾種常見的情況:

- 從陣列解構賦值
- 從物件解構賦值(或是從混用物件或陣列)
- 非物件或非陣列解構賦值
- 解構賦值時給定預設值
- 搭配函式的傳入參數使用

> "解構賦值"這個中文翻譯老實講是簡體中文的翻譯字詞，繁體中文應該要翻為"析構指定值"或"解構指定值"，解構是"解析結構"的簡稱意思。
> destructuring: 變性、破壞性。使用"解構"是對照`de-`字頭有"脫離"、"去除"的意思。
> assignment: 賦值、指定。賦值通常指的是程式中使用等號(=)運算符的語句。解構賦值是屬於ES6標準中指定運算的章節。

## 從陣列解構賦值(Array destructuring)

從陣列解構賦值沒太多學問，唯一比較特別的是可以用其餘運算符(Rest Operator)的語法，既然是其餘運算符，最後就會把其餘的對應值集合成一個陣列之中。下面是幾個幾個範例：

```js
//基本用法
const [a, b] = [1, 2] //a=1, b=2

//先宣告後指定值，要用let才行
let a, b
[a, b] = [1, 2]

// 略過某些值
const [a, , b] = [1, 2, 3] // a=1, b=3

// 其餘運算
const [a, ...b] = [1, 2, 3] //a=1, b=[2,3]

// 失敗保護
const [, , , a, b] = [1, 2, 3] // a=undefined, b=undefined

// 交換值
const a = 1, b = 2;
[b, a] = [a, b] //a=2, b=1

// 多維複雜陣列
const [a, [b, [c, d]]] = [1, [2, [[[3, 4], 5], 6]]]

// 字串
const str = "hello";
const [a, b, c, d, e] = str
```

用法就是這麼簡單，用來賦值的等號符號(=)左邊按照你寫的變數或常數樣式，然後在右邊寫上要對映數值，就像之前說的"鏡子"般的樣式對應。當沒有對應的值時，就會得到`undefined`。

## 從物件解構賦值(Object destructuring)

物件除了有使用特別的字面符號，也就是花括號({})來定義，其中也會包含屬性。按照基本的原則，也是用像"鏡子"般的樣式對應，一樣看範例就很容易理解：

```js
// 基本用法
const { user: x } = { user: 5 } // x=5

// 失敗保護(Fail-safe)
const { user: x } = { user2: 5 } //x=undefined

// 賦予新的變數名稱
const { prop: x, prop2: y } = { prop: 5, prop2: 10 } // x=5, y=10

// 屬性賦值語法
const { prop: prop, prop2: prop2 } = { prop: 5, prop2: 10 } //prop = 5, prop2=10

// 相當於上一行的簡短語法(Short-hand syntax)
const { prop, prop2 } = { prop: 5, prop2: 10 } //prop = 5, prop2=10

// ES7+的物件屬性其餘運算符
const {a, b, ...rest} = {a:1, b:2, c:3, d:4} //a=1, b=2, rest={c:3, d:4}
```

下面的語法是個有錯誤的語法，這是一個常見錯誤的示範：

```js
// 錯誤的示範:
let a, b
{ a, b } = {a: 1, b: 2}
```

> 註: 這個語法只能用`let`來宣告變數

因為在Javascript語言中，雖然使用花括號符號({})是物件的宣告符號，但這個符號用在程式敘述中，也就是前面沒有`let`、`const`、`var`這些宣告字詞時，則是代表程式碼的區塊(block)。要修正這個語法可以在整個語句的外面再框上圓括號符號(())，圓括號符號(())有是群組運算符，具有表達式求值的作用，修正後正確的寫法如下：

```js
let a, b
({ a, b } = {a: 1, b: 2}) //a=1, b=2
```

> 註: 在大部份情況，你應該是在定義常數或變數時，就進行解構賦值。

複雜的物件或混合陣列到物件，如果你能記住之前說的鏡子樣式對映基本原則，其實也很容易就能理解：

```js
// 混用物件與陣列
const {prop: x, prop2: [, y]} = {prop: 5, prop2: [10, 100]}

console.log(x, y) // => 5 100

// 複雜多層次的物件
const {
  prop: x,
  prop2: {
    prop2: {
      nested: [ , , b]
    }
  }
} = { prop: "Hello", prop2: { prop2: { nested: ["a", "b", "c"]}}}

console.log(x, b) // => Hello c
```

## 從非陣列或非物件解構賦值

從其他的資料類型進行陣列或物件解構，一開始是`null`或`undefined`這兩種時，你會得到錯誤：

```js
const [a] = undefined
const {b} = null
//TypeError: Invalid attempt to destructure non-iterable instance
```

如果是從其他的原始資料類型布林、數字、字串等作物件解構，則會得到`undefined`值。

```js
const {a} = false
const {b} = 10
const {c} = 'hello'

console.log(a, b, c) // undefined undefined undefined
```

從其他的原始資料類型布林、數字、字串等作陣列解構的話，只有字串類型可以解構出字元，在上面的例子有看到這種情況，其他也是得到`undefined`值：

```js
const [a] = false
const [b] = 10
const [c] = 'hello' //c="h"

console.log( a, b, c)
```

> 註: 字串資料類型的值只能用在陣列的解構賦值，無法用在物件的解構賦值。

以上會有出現這樣的結果，是當一個值要被進行解構時，它會先被轉成物件(或陣列)，因為`null`或`undefined`無法轉成物件(或陣列)，所以必定產生錯誤，這是第一階段。下一個階段如果這個值轉換的物件(或陣列)，沒有附帶對應的迭代器(Iterator)就無法被成功解構賦值，所以最後回傳`undefined`。

## 解構賦值時的預設值

在等號左邊的樣式(pattern)中是可以給定預設值的，作為如果沒有賦到值時(對應的值不存在)的預設數值。

```js
 const [missing = true] = []
 console.log(missing)
 // true

 const { message: msg = 'Something went wrong' } = {}
 console.log(msg)
 // Something went wrong

 const { x = 3 } = {}
 console.log(x)
 // 3
```

要作一個簡單的陷阱題滿簡單的，你可以試看看下面這個範例中到底是賦到了什麼值：

```js
const { a ='hello' } = 'hello'
const [ b ='hello' ] = 'hello'

console.log( a, b)
```

## 在函式傳入參數定義中使用

在函式傳入參數定義中也可以使用解構賦值，因為函式的傳入參數本身也有自己的預設值設定語法，這也是ES6的一個特性，所以使用上會容易與解構賦值自己的預設值設定搞混。這地方會產生不少陷阱。

一個簡單的解構賦值用在函式的參數裡，這是正常情況的語法：

```js
function func({a, b}) {
  return a + b
}

func({a: 1, b: 2}) // 3
```

當你用上了預設值的機制，而且前面的a有預設值，後面的b就沒有，這時候因為沒有賦到值時，都會是`undefined`值，任何數字加上`undefined`都會變成`NaN`，也就是非數字的意思：

```js
function func({a = 3, b}) {
  return a + b
}

func({a: 1, b: 2}) // 3
func({b: 2}) // 5
func({a: 1}) // NaN
func({}) // NaN
func() // Cannot read property 'a' of undefined
```

當a與b兩個都有預設值時，`NaN`的情況不存在：

```js
function func({a = 3, b = 5}) {
  return a + b
}

func({a: 1, b: 2}) // 3
func({a: 1}) // 6
func({b: 2}) // 5
func({}) // 8
func() // Cannot read property 'a' of undefined
```

實際上函式傳入參數它自己也可以加預設值，但這情況會讓最後一種`func()`呼叫時與`func({})`相同結果：

```js
function func({a = 3, b = 5} = {}) {
  return a + b
}

func({a: 1, b: 2}) // 3
func({a: 1}) // 6
func({b: 2}) // 5
func({}) // 8
func() // 8
```

另一種情況是在函式傳入參數的預設值中給了另一套預設值，這只會在`func()`時發揮它的作用：

```js
function func({a = 3, b = 5} = {a: 7, b: 11}) {
  return a + b
}

func({a: 1, b: 2}) // 3
func({a: 1}) // 6
func({b: 2}) // 5
func({}) // 8
func() // 18
```

你可以觀察一下，當對某個變數賦值時你給他null或void 0，到底是用預設值還是沒有值，這個範例的`g()`函式是個對照組：

```js
function func({a = 1, b = 2} = {a: 1, b: 2}) {
  return a + b
}

func({a: 3, b: 5}) // 8
func({a: 3}) // 5
func({b: 5}) // 6
func({a: null}) // 2
func({b: null}) // 1
func({a: void 0}) // 3
func({b: void 0}) // 3
func({}) // 3
func() // 3
```

```js
function g(a = 1, b = 2) {
  return a + b
}

g(3, 5) // 8
g(3) // 5
g(5) // 7
g(void 0, 5) // 6
g(null, 5) // 5
g() // 3
```

> 註：所以在函式傳入參數中作解構賦值時，給定null值時會導致預設值無用，請記住這一點。當數字運算時，null相當於0。

## 實例應用

### 迭代物件中的屬性值

這個範例用了`for...of`語法。出自[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)：

```js
const people = [
  {
    name: 'Mike Smith',
    family: {
      mother: 'Jane Smith',
      father: 'Harry Smith',
      sister: 'Samantha Smith'
    },
    age: 35
  },
  {
    name: 'Tom Jones',
    family: {
      mother: 'Norah Jones',
      father: 'Richard Jones',
      brother: 'Howard Jones'
    },
    age: 25
  }
];

for (let {name: n, family: { father: f } } of people) {
  console.log('Name: ' + n + ', Father: ' + f)
}

// "Name: Mike Smith, Father: Harry Smith"
// "Name: Tom Jones, Father: Richard Jones"
```

### 結合預設值與其餘參數

這個範例混用了一些ES6的語法，出自[Several demos and usages for ES6 destructuring.](https://gist.github.com/mikaelbr/9900818)：

```js
// 結合其他ES6特性
const ajax = function ({ url = 'localhost', port: p = 80}, ...data) {
  console.log('Url:', url, 'Port:', p, 'Rest:', data)
}

ajax({ url: 'someHost' }, 'additional', 'data', 'hello')
// => Url: someHost Port: 80 Rest: [ 'additional', 'data', 'hello' ]

ajax({ }, 'additional', 'data', 'hello')
// => Url: localhost Port: 80 Rest: [ 'additional', 'data', 'hello' ]
```

### \_.pluck

這個例子相當於Underscore.js函式庫中的`_.pluck`，把深層的屬性值往上拉出來。

```js
var users = [
  { user: "Name1" },
  { user: "Name2" },
  { user: "Name2" },
  { user: "Name3" }
]

var names = users.map( ({ user }) => user )

console.log(names)
// => [ 'Name1', 'Name2', 'Name2', 'Name3' ]
```

### React Native的解構賦值

這個是React Native的一個教學，裡面有用了解構賦值的語法。出自[React Native Tutorial: Building Apps with JavaScript](http://www.raywenderlich.com/99473/introducing-react-native-building-apps-javascript)：

```js
var React = require('react-native')

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React
```

## 參考資料

- [Several demos and usages for ES6 destructuring.](https://gist.github.com/mikaelbr/9900818)
- [Destructuring Assignment in ECMAScript 6](http://fitzgeraldnick.com/weblog/50/)
- [Destructuring assignment MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Destructuring assignmentのご利用は計画的に](http://qiita.com/armorik83/items/ec3210a1942471fba612)
