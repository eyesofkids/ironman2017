# 鐵人賽第 5 天: ES6篇 - let與const

很快地進入到鐵人賽的第5天，也進入到ES6篇的章節之中。本章的目標是針對let與const這兩個用於宣告變數與常數的語句，作重點式的介紹，當然都是使用較為簡單的說明。

## 關於ES6

因為是ES6篇的第一篇，所以稍微介紹一下ES6標準。

ES6是ECMAScript第6版本的簡稱，又稱為ES2015，因為它是去年(2015年)才正式定案的一個標準。ECMAScript是Javascript程式語言的規格標準，以下是各版本的發行日期，但標準發行並不代表在各個瀏覽器品牌中，即可使用其中的功能規格，還需等待各瀏覽器品牌廠商進行實作。

- ECMAScript 6 (ES6) 發行於2015年中，為目前最新的官方版本
- ECMAScript 5 (ES5) 發行於2009年底
- ECMAScript 4 (ES4) 棄用
- ECMAScript 3 (ES3) 發行於1999年底

Ecma International全名為歐洲計算機製造商協會(European Computer Manufacturers Association)目前設立了一個TC39委員會，專門為制定ECMAScript標準進行討論與審核哪些功能要列入標準。TC39的介紹可以看這篇[TC39 - ECMAScript](http://www.ecma-international.org/memento/TC39-M.htm)，而TC39的制定流程可以參考[The TC39 Process](https://tc39.github.io/process-document/)這篇。目前有很多新的功能標準都正在制定當中。

ES6以[ECMAScript compatibility table(相容性表格)](http://kangax.github.io/compat-table/es6/)網站來看目前的瀏覽器品牌與版本的相容程度，新式的像Chrome、Safari、Edge與Firefox支援性都已達到90%以上，但在IE11(桌面)、Android、iOS9手機內建上，支援性還是非常的差。這也是目前為什麼要先用babel編譯器先轉為ES5標準的程式碼的主要原因。ES5的程式碼可以取得目前市面上最大的相容性，從IE9以上，一直到Android 4.1與iOS6都可以支援得很好。

ES6加入了非常多的新特性，可以說整個提升JavaScript程式語言的內建特性的質與量，有許多新的特性是在現代程式語言中非常重要而不可缺少的。而有一些是新的內建物件或類型，它們是屬於較為進階的內容，在某些使用情況下會特別有用。由於在ES6標準最終發行版本的差不多時間，HTML5與CSS3標準也發行了最後的版本，它們的制定組織是W3C，有許多JavaScript中的特性是與HTML5的標準息息相關的，尤其是在網頁上與DOM元件或事件相關的許多方法。所以除了ES6中的眾多新特性，目前也有很多是來自於HTML5的新特性，這些特性在目前的新式瀏覽器中都逐漸被實作出來，這也是近幾年JavaScript語言蓬勃發展的結果。

## let與const

let與const無疑是要取代原本的使用var語句來定義變數與常數。在ES6之前，並沒有"常數"這個東西，只有變數而已，也就是用var所宣告的識別名稱。在一份有點舊的Google撰寫樣式風格指引中，會告訴你要用全大寫英文字元來作為常數定義，像是`var MAX_HEIGHT = 10`這種定義方式，甚至是使用非常特別的`@const`來指示，有可能Google瀏覽器當時會認為它是個常數在內部處理，不得而知。但對JavaScript來說用了`var`就是變數。

實際上在多年的var與其他亂用亂寫的語法下，在JavaScript中共有4種宣告變數的方式，它們分別是:

```js
a = 10
this.a = 10
window.a = 10
var a = 10
```

> 關於上面的變數宣告方式，只是提出來說明而已，如果有興趣請參考我在segmentfault討論區中回答的[老规矩，先上代码，帮忙指点下变量作用域](https://segmentfault.com/q/1010000007244019/a-1020000007245007)或是這篇[Difference between variable declaration syntaxes in Javascript (including global variables)?](http://stackoverflow.com/questions/4862193/difference-between-variable-declaration-syntaxes-in-javascript-including-global)

上面的寫法只有最後一個`var a = 10`才是真正的變數宣告，其他的都是只在全域物件中加入屬性。從這裡就可以知道，JavaScript的自由度令人覺得可怕，用`a = 10`就可以直接生出一個變數來用，而且是在全域中產出變數。所以需要各種撰寫風格與輔助工具來協助開發者，尤其對初學者來說，這是我一直強調的部份。

雖然在ES5中已經加入了嚴格模式(strict mode)的設計，對`this`的存取使用會變得沒那麼自由，當然，有些老的舊的程式碼會變得無法執行，這是它們需要作調整與改變的，實際上經過bebel編譯工作編出來的ES5程式碼，預設都會加上嚴格模式(strict mode)。

let與const是區塊作用域(block scope)，而var是函式作用域(function scope)，這是第一個我們會看到的差異性。區塊作用域與函式作用域會差在什麼地方？

var是函式作用域的設計，也就是說它只能以函式為變數作用域的分界，在一些使用了區塊語句(用花括號的語句)的像if, else, for, while等等區塊語句中，在這裡面用var宣告的變數仍然是會到全域之中，例如:

```js
function test(){
  var a = 10
}

if(true){
  var b = 20
}

console.log(a) // a is not defined 存取不到
console.log(b) // 存取得到
```

這對初學者容易造成誤解外，如果再搭配到隱藏的提升特性(最下面有說明)，整個程式碼經常會有出人意表的結果。撰寫風格通常會提醒這點，而且叫你一定要把var語句寫在程式碼檔案的最上面。

如果使用了let或const，就是以區塊語句為分界的作用域，它會比較明確而且不易發生錯誤。一些之前對於var語句的麻煩撰寫風格，就可以跳過不需要了。

```js
function test() {
  let a = 10
}

if (true) {
  const b = 20
}

console.log(a) // a is not defined 存取不到
console.log(b) // b is not defined 存取不到
```

總之，不要再用var了，用let或const來取代它就是了。像我們有使用的ESLint檢查工具，一定出現會叫你不要使用var的訊息。

## const

const針對是常數的定義，常數在一宣告時就必定要指定給值，不然會產生錯誤。而對於常數在ES6的定義是:

> 不可再指定(can't re-assignment)

指定的意思就是用等號(=)作指定運算，像下面這例子就是再指定值，所以會產生錯誤:

```js
const a = 10
a = 20  // TypeError: Assignment to constant variable.
```

宣告了一個常數，代表這個識別名稱的參照(reference)是唯讀的(read-only)，並不代表這個參照指定到的值是不可改變的(immutable)。這是在講什麼碗糕？其實是在講如果你宣告的常數是一個物件或陣列，類型這種參照類型的值，裡面的值是可以作改變的。像下面的例子是合法的使用:

```js
const a = []
a[0] = 1

const b = {}
b.foo = 123
```

所以對於物件、陣列、函式來說，使用const常數來宣告就可以，除非你有需要再重新指定這個陣列或物件的參照。

> 撰寫風格提示: 使用let與const時，優先使用const，尤其是在物件、陣列與函式表達式(或箭頭函式)上。實際上只有很少一部份情況才會用到let，例如常見的迴圈語句。

## let使用於for語句中

這其實有兩個重點，第一個只是有可能被誤解所以說出來。第二個重新綁定這件事，算是一個新的特性。

### for圓括號中的let變數仍然是區塊作用域

這很容易從例子中理解，寫出來只是怕可能初學者不確定當在for圓括號中的第一個表達式，用let宣告變數時，是不是也會是被限制到for語句的區塊中作用域，答案是"會"，見下面的例子:

```js
for (let i = 0; i < 10; i++) {
  console.log('in for statement: i', i)
}

console.log(i) // ReferenceError: i is not defined(…)
```

### for迴圈中的let變數會作重新綁定

這個特性算是let的特別之處，這是由於區塊作用域造成的結果，在每次的for迴圈執行時，用let宣告的變數都會重新綁定(re-bind)一次

這是在for語句中的var與let的差異:

> for (let x...)的循環在每次迭代時都為x創建新的綁定

以下用代碼直接看會比較容易的理解。這個改進主要是為了要解決在for語句中的閉包結構的問題。

原來的使用var的代碼，與去糖(desugar)後來看它在執行時是這樣的模擬代碼:

```js
//原來代碼
for (var i = 0; i < 10; i++) { setTimeout(()=>console.log("i:",i), 1000); }

// 不需要加區塊符，因為區塊也不會影響
var i;
i = 0;
if (i < 10)
    setTimeout(()=>console.log("i:",i), 1000);
    i++;
    if (i < 10)
        setTimeout(()=>console.log("i:",i), 1000);
        i++;
//...

```

而使用了let後，會有塊級作用域的影響，原來的代碼與執行時的去糖模擬代碼如下:


```js
// 原來代碼
for (let i = 0; i < 10; i++) { setTimeout(()=>console.log("i:",i), 1000); }

// 用區塊符區分每次循環的語句
// 每次for語句開始，i指定為一個全域刻度__status，這只是方便說明而已
// __status會記錄for語句i最後的值
{ let i;
  i = 0;
  __status = {i};
}
{ let {i} = __status;
  if (i < 10)
      setTimeout(()=>console.log("i:",i), 1000);
      __status = {i};
}
    { let {i} = __status;
      i++;
      if (i < 10)
          setTimeout(()=>console.log("i:",i), 1000);
          __status = {i};
    }
    //...
```

為何可以這樣模擬？因為在ES6標準中，有一段是關於CreatePerIterationEnvironment，也就是for語句每次循環所要建立環境的步驟，裡面有提及有關詞法環境的相關步驟(LexicalEnvironment)，這與使用let時會有關。所以，如果你使用了let而不是var，let的變量除了作用域是在for區塊中，而且會為每次循環執行建立新的詞法環境(LexicalEnvironment)，拷貝所有的變量名稱與值到下個循環執行。以最簡單的方式改寫原先的問題中的代碼，相當於下面這樣寫:

```js
var a = [];
{ let k;
    for (k = 0; k < 10; k++) {
      let i = k; //注意這裡，每次循環都會創建一個新的i變量
      a[i] = function () {
        console.log(i);
      };
    }
}
a[6](); // 6
```

https://segmentfault.com/q/1010000007541743/a-1020000007542563

## 提升(Hoist)

https://segmentfault.com/q/1010000007480947/a-1020000007482239

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let
