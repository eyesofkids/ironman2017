# 展開運算符與其餘運算符

展開運算符(Spread Operator)與其餘運算符(Rest Operator)是ES6中的其中兩種新特性，雖然這兩種特性的符號是一模一樣的，都是(...)三個點，但使用的情況與意義不同。我們常常在文字敘述或聊天時，這個(...)常用來代表了"無言"、"無窮的想像"或"還有其他更多的"的意思。

簡單摘要一下這個語法的內容：

- 符號都是三個點(...)
- 都與陣列有關
- 一個是展開陣列中的值，一個是集合其餘的值成為陣列

## 展開運算符(Spread Operator)

> 展開運算子是把一個陣列展開成個別的值的速寫語法，它只會在"陣列字面定義"與"函式呼叫"時使用。

展開運算符(Spread Operator)是把一個陣列展開(expand)成個別值，這個運算符後面必定接著一個陣列，它是個一元運算符。最常見的是用來組合(串聯)陣列，以下是一個簡單的範例：

```js
const params = [ "hello", true, 7 ]
const other = [ 1, 2, ...params ] // [ 1, 2, "hello", true, 7 ]
```

你也可以用來把某個陣列展開，然後傳入函式之中作為傳入參數值，例如下面這個一個加總函式的範例：

```js
function sum(a, b, c) {
  return a + b + c
}
const args = [1, 2, 3]
sum(…args) // 6
```

對照ES5中的相容語法，則是用`apply`函式，它的第二個參數也是使用陣列，以下是用ES5語法與上面相同結果的範例程式：

```js
function sum(a, b, c) {
  return a + b + c;
}

var args = [1, 2, 3];
sum.apply(undefined, args) ;// 6
```

展開運算符還有一個特別的功能，就是把可迭代(iterable)或與陣列相似(Array-like)的物件轉變為陣列，在JavaScript語言中內建的可迭代(iterable)物件有String、Array、TypedArray、Map與Set物件，而與陣列相似(Array-like)的物件指的是函式中的隱藏物件"arguments"。下面的範例是轉變字串為字元陣列:

```js
const aString = "foo"
const chars = [ ...aString ] // [ "f", "o", "o" ]
```

下面的範例是把函式中的隱藏偽物件"arguments"轉成真正的陣列物件:

```js
function aFunc(x){
  console.log(arguments)
  console.log(Array.isArray(arguments))

  //轉為真正的陣列
  const arr = [...arguments]
  console.log(arr)
  console.log(Array.isArray(arr))
}

aFunc(1)
```

## 其餘運算符(Rest Operator)

> 其餘運算符對比展開運算子，它是收集其餘的(剩餘的)這些值，轉變成一個陣列。

其餘運算符有兩個功能，一個是用在函式定義中的其餘參數(Rest parameters)，另一個是用在解構賦值(destructuring)時。

### 其餘參數(Rest parameters)

> 就像在電影葉問中的台詞："我要打十個"，其餘參數可以讓你一次打剩下的全部，不過葉問會變成一個陣列。

既然是一個參數的語法，當然就是用在函式中的傳入參數定義。其餘參數代表是將"不確定的傳入參數值們"在函式中轉變成為一個陣列來進行運算。例如下面這個加總的範例：

```js
function sum(…numbers) {
  const result = 0

  numbers.forEach(function (number) {
    result += number
  })

  return result
}

sum(1) // 1
sum(1, 2, 3, 4, 5) // 15
```

其餘參數在傳入參數定義中，必定是位於最後，而且在參數中也只能有一個其餘參數，這是使用它需要注意的事項。

其餘參數的值在沒有傳入值時，會變為一個空陣列，而不是`undefined`，以下的範例可以看到這個結果:

```js
function aFunc(x, ...y){
  console.log('x =', x,  ', y = ' , y)
}

aFunc(1,2,3) //x = 1, y = [2, 3]
aFunc() //x = undefined, y = []
```

其餘參數的設計有一個很明確的用途，就是要取代函式中那個隱藏"偽陣列"物件`arguments`，`arguments`雖然會包含了所有的函式傳入參數，但它是個類似陣列的物件卻沒有大部份陣列方法，它不太像是個隱藏的密技，比較像是隱藏的陷阱，很容易造成誤解或混亂，完全不建議你使用這個東西。

其餘參數的值是一個真正的陣列，而且它需要在傳入參數宣告才能使用，至少在程式碼閱讀性上勝出太多了。

## 解構(destructuring)賦值時

解構賦值在另一獨立章節會講得更詳細，這裡只是要說明其餘運算符的另一個使用情況。解構賦值也是一個ES6中的新特性。

解構賦值是用在"陣列指定陣列"或是"物件指定物件"的情況下，這個時候會根據陣列原本的結構，以類似"鏡子"對映樣式(pattern)來進行賦值。聽起來很玄妙但用起來很簡單，這是一種為了讓陣列與物件賦值時更方便所設計的一種語法。例如以下的範例:

```js
const [x, y, z] = [1, 2, 3]

console.log(x) //1
```

像這個例子就是最簡單的陣列解構賦值的範例，x當然會被指定為1，y與z你應該用腳底板也想得到是被指定了什麼值。

當使用其餘運算符之後，就可以用像其餘參數的類似概念來進行解構賦值，例如以下的範例:

```js
const [x, ...y] = [1, 2, 3]

console.log(x) //1
console.log(y) //[2,3]
```

當右邊的值與左邊數量不相等時，"鏡子對映的樣式"就會有些沒對到，就會像下面這個例子一樣:

```js
const [x, y, ...z] = [1]

console.log(x) //1
console.log(y) //undefined
console.log(z) //[]
```

你可以回頭再看一下"其餘參數"的使用方式，是不是與解構賦值時很相似。而且在解構賦值時一樣只能用一個其餘運算符，位置也只能放在最後一個。

## 其餘屬性(Rest Properties)與展開屬性(Spread Properties)

上面都只有談到與陣列搭配使用，但你可能會看到在物件上也會使用類似語法與符號(...)，這些都還在制定中的ES7之後草案標準，稱為其餘屬性(Rest Properties)與展開屬性(Spread Properties)。例如下面這樣的範例，來自[這裡](https://github.com/sebmarkbage/ecmascript-rest-spread)：

```js
// Rest Properties
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 }
console.log(x) // 1
console.log(y) // 2
console.log(z) // { a: 3, b: 4 }

// Spread Properties
let n = { x, y, ...z }
console.log(n) // { x: 1, y: 2, a: 3, b: 4 }
```

有些新式的框架或函式庫中已經開始使用了，例如Redux、React-Native，babel轉換工具可以支援轉換這些語法，但使用時要注意要額外加裝`babel-plugin-transform-object-rest-spread`外掛。

## 結語

展開運算符比較容易理解，它是把已有(看得到)的陣列值"展開"為一個個獨自的值。其餘運算符都是用在函式定義或指定值時，它的設計是要收集其餘的(剩餘的)值，形成一個陣列再來進行運算，

你可能還對展開運算符與其餘運算符的分別有點混亂，因為符號相同(...)，要區分它們要從使用情況來區分:

- 展開運算符: 用在陣列的字面定義裡面(例如`[1, ...b]`)，或是函式"**呼叫**"時(例如`func(...args)`)
- 其餘運算符: 用在函式的定義的傳入參數(例如`function func(x, ...y)`)，或是在解構賦值時(例如`const [x, ...y]=[1,2,3]`)

## 參考資源

- [Spread syntax(MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)
- [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [Exploring ES6 - 10.7.2 Rest operator](http://exploringjs.com/es6/ch_destructuring.html#sec_rest-operator)
- [Exploring ES6 - 11.8 The spread operator](http://exploringjs.com/es6/ch_parameter-handling.html#sec_spread-operator)
- [ES6 — default + rest + spread](https://medium.com/ecmascript-2015/default-rest-spread-f3ab0d2e0a5e#.pmsbw2tdb)
- [ES6 Spread and Butter in Depth](https://ponyfoo.com/articles/es6-spread-and-butter-in-depth)
