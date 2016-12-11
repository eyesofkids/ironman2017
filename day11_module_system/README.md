# ES6篇: Module System(模組系統)

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day11_module_system/asset/intro.png)

本章的目標是對模組系統(Module System)提供一些使用上的簡單說明。模組系統是一個重要的ES6特性，搭配目前的NPM相依性管理工具，可以說是目前JavaScript發展的一個重大的改變，也是目前開發JavaScript應用的主要方式。對開發者來說，語法很簡單就可以開始使用，其他的工作會交由打包與編譯工具來幫你作。

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day11_module_system)。

> 特別注意: 截至目前為止(2016.12)，所有的瀏覽器都沒有原生(內建)完整支援import/export語法，就算有支援也是實驗性質(需額外開啟)或是功能不完整。你必須使用如babel編譯工具來作預編譯的工作。如果你有需要在瀏覽器上直接執行，也可以[打填充(polyfill)](https://github.com/ModuleLoader/es-module-loader)來讓瀏覽器可以使用這個語法。

> 註: ES6標準中雖然定義了模組的語法，但卻沒定義如何載入模組(只有抽象的表達字詞)，但這也是最複雜的一部份，未來可能會因為環境而實作不同。

## 模組系統是什麼？

當程式碼愈寫愈多，應用程式的規模愈來愈大時，我們需要一個用於組織與管理程式碼的方式，這個需求相當明確，或許不只是應用程式發展到一定程度才會考慮這些，而是應該在開發程式之前的規劃就需要考量進來。JavaScript語言是一個沒有命名空間設計的程式語言，也沒有支援類似的組織與程式碼分離的設計。有些人認為使用物件定義的字面文字，可以定義出物件的方法與屬性，但如果你看過"物件"、"this"與"原型物件導向"的章節內容，就知道物件中並沒有區分私有、公開成員或方法的特性，這個組織方式頂多只是把方法或屬性整理集中而已。

在應用程式規模化的階段，我們需要一種機制，能夠區分出每個獨立檔案的作用域，而不會影響到全域的作用域，也就是不會任意的污染到全域。而在很早之前(2003)在社群上發展出一個稱之為模組樣式(module pattern)，以及之後的變型如 暴露模組樣式(Revealing Module Pattern)，就是第一代的程式碼組織管理方式。模組樣式實作相當簡單，有許多早期開始發展的函式庫或框架採用這個樣式，甚至到今天也可以看到它的使用身影。一個簡單的範例如下(以下範例來自[jQuery](https://learn.jquery.com/code-organization/concepts/)):

```js
// 模組樣式
var feature = (function() {

    // 私有的變數與函式
    var privateThing = "secret"
    var publicThing = "not secret"

    var changePrivateThing = function() {
        privateThing = "super secret"
    };

    var sayPrivateThing = function() {
        console.log( privateThing )
        changePrivateThing()
    };

    // 公開的API
    return {
        publicThing: publicThing,
        sayPrivateThing: sayPrivateThing
    }
})()

feature.publicThing // 公開部份的存取

// 透過公開的API來存取私有的變數
feature.sayPrivateThing()
```

模組樣式使用了IIFE函式的特性，區分出作用域，不過它並沒有辦法徹底解決問題，它在小型的應用程式可以用得很好，但在複雜的程式中仍然有很大的問題，例如以下的問題:

- 沒辦法在程式中作模組載入
- 模組之間的相依性不易管理
- 異步地載入模組
- 除錯與測試都不容易
- 在大型專案中不易管理

模組樣式似乎是一個暫時性的解決方案，但不得不說它的確是上一代很重要的程式碼組織方式。第二代的模組系統，是在2009年之後的CommonJS與AMD(Asynchronous Module Definition)專案，它們實作出真正完整的模組系統，CommonJS是專門設計給伺服器端的Node.js使用的，而AMD的目標則是瀏覽器端。當然它們兩者的設計有所不同，也不相容，使用時也可能需要搭配載入工具來一併使用，不過這個階段的模組系統已經是較前一代完善許多，在相依性與模組輸出與匯入，都有相對的解決方式，程式碼的管理與組織方便了許多。

CommonJS與AMD並不會在這裡討論，我們的重點是是ES6中的模組系統，ES6中加入了模組系統的支援，它採用了CommonJS與AMD的優點，是一個語言內建的模組系統，而且它可以使用於瀏覽器與伺服器端，這是一個相當重大的新特性，可以讓你的開發日子更輕鬆許多。

## 模組如何開始使用

ES6的模組系統使用上相當簡單，各模組有自己的獨立的作用域，所以你必須指示要在應用程式中匯入或輸出哪一些模組。使用上大致上只有三個重點:

- ES6的模組程式碼會自動變成[Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)(嚴格模式)，不論你有沒有使用"use strict"在程式碼中。
- ES6的模組的分隔原則是一個檔案一個模組
- ES6模組使用export進行輸出，與import語句來進行匯入。通常匯入語句位於程式碼檔案中最前面，輸出則可以位於識別名稱處，或是位於程式碼檔案最後。

### 模組的名稱

模組的名稱是由目錄與檔案名稱的組合，而省略掉副檔名(.js或.jsx)。如果是由NPM工具所安裝的模組，則是只需要模組的名稱即可，不需要有路徑部份。

- 如果你要匯入的檔案名稱是utils.js，而且是在同目錄下，則使用import(匯入)這個檔案的名稱，例如`./utils`
- 如果你要匯入的檔案名稱是在相對目錄components下，則加上目錄的相對路徑來作匯入，例如`./components/utils`

## 模組輸出與匯入

有使用模組輸出語句的程式碼檔案，才能讓其他程式碼檔案進行匯入的工作。模組輸出可以使用`export`關鍵字，在想要輸出(也就是變為公開部份)加在前面，物件、類別、函式定義(function 或 function*)與原始資料類型(變數與常數)都可以輸出，例如以下的範例:

### 多個輸出名稱

```js
export const aString = 'test'

export function aFunction(){
  console.log('function test')
}

export const aObject = {a: 1}

export class aClass {
  constructor(name, age){
    this.name = name
    this.age = age
  }
}
```

上面稱之為多個輸出名稱的情況，有兩種方式可以進行匯入，一種是每個要匯入的名稱都需要定義在花括號({})之中，這在匯入模組部份的內容時很常用到。例如以下的範例:

```js
import {aString, aObject, aFunction, aClass} from './lib'

console.log(aString)
console.log(aObject)
```

另一種是使用萬用字元(\*)，代表要匯入所有的輸出定義的值，不過你需要加上一個模組名稱，例如下面程式碼中的`myModule`，這是為了防止命名空間的衝突之用的，之後的程式碼中都需要用這個模組名稱來存取輸出模組中的值，這個作法不常使用:

```js
import * as myModule from './lib'

console.log(myModule.aString)
console.log(myModule.aObject)

myModule.aFunction()
const newObj = new myModule.aClass('Inori', 16)
console.log(newObj)
```

### 單一(預設)輸出識別名稱

這個要輸出成為模組的程式碼檔案中，只會有一個輸出的變數/常數、函式、類別或物件時，或是用於作為最低使用情況的預設輸出時，通常會加上`default`關鍵詞。如果要使用有回傳值的函式，通常也是用單一輸出的方式。例如以下的範例:

```js
function aFunction(param){
  return param * param
}

export default aFunction
```

對單一輸出的模組來進行匯入就不需要用花括號，這代表只匯入以`default`值定義的輸出語句:

```js
import aFunction from './lib2'

console.log(aFunction(5))
```

這是最特別的，可以在匯入時改變匯入值的名稱，這樣可以讓作匯入檔案中，確保不會有名稱衝突的情況:

```js
import square from './lib2'

console.log(square(5))
```

> 特別注意: 當使用var, let 或 const時，"不能"使用`export default`

## 輸出與匯入的語法參考

輸出與匯入的語法實際看例子會比較快。不過常用的就是那幾種而已。如果你有看到不同的語法，可以再對照一下MDN上的相關說明，這裡只有列出常見的幾個。

### 合法的輸出語法

```js
export var x = 42;                      // 輸出一個變數識別名稱
export function foo() {};               // 輸出一個函式識別名稱

export default 42;                      // 輸出一個預設值
export default function foo() {};       // 輸出一個預設值，是個函式定義

export { encrypt };                     // 輸出一個已存在的變數
export { decrypt as dec };              // 輸出一個已存在的變數，改用新的識別名稱
export { encrypt as en } from 'crypto'; // 從另一個模組，輸出一個已存在的變數，改用新的識別名稱
export * from 'crypto';                 // 從另一個模組，輸出所有要輸出的
```

### 合法的匯入語法

```js
import 'jquery';                        // 匯入一個模組，整個匯入
import $ from 'jquery';                 // 匯入模組的預設的輸出部份
import { $ } from 'jquery';             // 匯入模組的一個識別名稱
import { $ as jQuery } from 'jquery';   // 匯入模組的一個識別名稱，用不同的識別名稱取代
import * as crypto from 'crypto';    // 匯入整個模組，改用不同的識別名稱
```

## 撰寫風格

- 不要使用萬用符(wildcard, *)作匯入模組。(Airbnb 10.2)
- 從一個位置只作一次匯入。(Airbnb 10.4)
- 匯入語句都放在程式碼檔案中其他語句的上面。(Airbnb 10.7)
- 不要輸出可以改變的識別名稱(變數)，類別與函式要小心被重新指定。(Airbnb 10.5)
- 如果在一個模組只需要單一個輸出，優先使用預設(default)輸出的語法。(Airbnb 10.6)

## 結論

ES6的模組系統樣式設計得簡單易用，這篇文章只是簡單的提供一些使用上的說明。雖然它有很多種不同樣式的語法，但常見的只有幾種而已，用久了你自然會很習慣。模組系統是一個已經是像日常生活吃飯喝水這樣的功能，開發JavaScript不能少了它，要運用豐富的模組資源，就是使用這個語法來使用這些開放原始碼的模組。
