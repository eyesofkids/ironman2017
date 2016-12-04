# Flow - JavaScript靜態類型檢查工具

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day04_flowtype/asset/intro.png)

本章的目標是提供一些Flow工具的簡介與使用建議。當然Flow也只是個檢查工具，它並不會自動修正程式碼中的錯誤，也不會強制說你沒按照它的警告訊息修正，就不會讓你執行程式。當然，並沒有要求什麼時候一定要用這類的工具，只是這種作法可以讓你的程式碼更具強健性與閱讀性，也可以直接避去很多不必要的資料類型使用上的問題，這種開發方式目前在許多框架與函式庫專案，或是以JavaScript應用為主的公司中都已經都是必用工具。

> 註: 本文章附有影片，影片網址在[Youtube的這個網址](https://youtu.be/UCS8i_sTt-Y)。本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day04_flowtype)。

本文大部份內容改寫自之前我寫的部落格文章 - [Flow靜態資料類型的檢查工具，10分鐘快速入門](http://eddychang.me/blog/javascript/90-flowtype-10-min.html)。在實例的部份有額外加入。

## 注意事項

> "奇異博士"說過「使用警語應該要加註在書的最前面」。所以我把注意事先加在這裡。

- 由於Flow還是個年輕的專案，問題仍然很多，功能也沒你想像中完整，用起來有時候會卡卡，速度仍需改善。以後用得人愈來愈多就會愈作愈好。
- Windows平台的支援也是幾個月前(2016.8)時的事，Flow只支援64位元的作業系統，32位元就不能用了。
- 如果你是要學或用React或Vue.js等等，Flow是必學的。不管你要用不用，函式庫原始碼裡面都用了。

## Flow介紹

[Flow](https://flowtype.org/)是個JavaScript的靜態類型檢查工具，由Facebook出品的開放原始碼專案，問世只有一年多，是個相當年輕的專案。

會有這類解決方案，起因是JavaScript是一種弱(動態)資料類型的語言，弱(動態)資料類型代表在程式碼中，變數或常數會自動依照指定值變更資料類型，而且類型種類也很少，這是直譯式腳本語言的常見特性，但有可能是優點也是很大的缺點。優點可能是容易使用，缺點是像開發者經常會因為指定值或傳入值的類型錯誤，造成不如預期的結果。有些時候在使用框架或函式庫時，如果眼花沒有仔細看文件，亦或是文件寫得不清不楚，也容易造成誤用的情況。

這個缺點在應用程式規模化時，會顯得更加嚴重。我們在開發團隊的協同作業中，一般都是用詳盡的文字說明，來降低這個問題的發生，但語言本身無法有效阻止這些問題。而且說明文件也需要花時間額外編寫，其他的開發者閱讀也需要花時間。在現今預先編譯器流行的年代，像TypeScript這樣的強(靜態)類別的JavaScript超集語言就開始流行，用嚴格的角度，以JavaScript語言為基底，來重新打造另一套具有強(靜態)類型特性的語言，就如同Java或C#這些語言一樣，這也是為什麼TypeScript稱自己是企業級的開發JavaScript解決方案。

> 註: 強(靜態)類型語言，意思是可以讓變數或常數在宣告(定義)時，就限制好只能使用哪種類型，之後在使用時如果發生類型不相符時，就會發出錯誤警告而不能編譯。但不只這些，語言本身也會擴充了更多的類型與語法。

TypeScript自然有它的市場，但它有一些明顯的問題，首先是JavaScript開發者需要再進一步學習，內容不少，也有一定陡峭的學習曲線，不過這還算小事。大條的事情是需要把已經正在使用的應用程式碼，都要整個改用TypeScript程式碼語法，才能發揮完整的功效。這對很多已經有內部程式碼庫的大型應用團隊而言，會是個重大的決定，因為如果不往全面重構的路走，將無法發揮強(靜態)類型語言的最大效用。所以許多現行的開放原始碼函式庫或框架，並不會直接使用TypeScript作為程式碼的語言，另一方面當然因為是TypeScript並非普及到一定程度的語言，社群上有熱愛的粉絲也有不是那麼支持的反對者。當然，TypeScript也有它的優勢之處，自從TypeScript提出了DefinitelyTyped的解決方式之後，讓現有的函式庫能額外再定義出裡面使用的類型，這也是另一個可以與現有框架與庫相整合的方案，這讓許多函式庫與框架都提交定義檔案，提供了另一種選擇。另一個優勢是，TypeScript也是個活躍的開放原始碼專案，發展到現在也有一段時間，算是逐漸成熟的專案。它的背後有微軟公司的支持，在最近發佈的知名的、全新打造過的Angular2框架中(由Google主導)，也採用了TypeScript作為基礎的開發語言。

現在，Flow提供了另一個新的選項，它是一種強(靜態)類型的輔助檢查工具。Flow的功能是讓現有的JavaScript語法可以先作類型的宣告(定義)，在開發過程中進行自動檢查，當然在最後編譯時，一樣可以用babel工具來移除這些標記。

相較於TypeScript是另外重新制定一套語言，最後再經過編譯為JavaScript程式碼來執行。Flow走的則是非強制與非侵入性的路線。Flow的優點是易學易用，它的學習曲線沒有TypeScript來得高，雖然內容也很多，但大概一天之內學個大概，就可以漸進式地開始使用。而且因為Flow從頭到尾只是個檢查工具，並不是新的程式語言或超集語言，所以它可以與各種現有的JavaScript程式碼相容，如果你哪天不想用了，就去除掉標記就是回到原來的程式碼，沒什麼負擔。當然，Flow的功用可能無法像TypeScript這麼全面性，也不可能改變要作某些事情的語法結構。

總結來說，這兩種方式的目的是有些相似的，各自有優點也有不足之處，青菜蘿蔔各有所好，要選擇哪一種方式就看你的選擇。

## 從一個小例子開始

這種類型不符的情況在程式碼中非常容易發生，例如以下的例子:

```js
function foo(x) {
  return x + 10
}

foo('Hello!')
```

`x`這個傳入參數，我們在函數定義時希望它是個數字類型，但最後使用呼叫函式時則用了字串類型。最後的結果會是什麼嗎？ "Hello!10"，這是因為加號(+)在JavaScript語言中，除了作為數字的加運算外，也可以當作字串的連接運算。想當然這並不是我們想要的結果。

聰明如你應該會想要用類型來當傳入參數的識別命名，像下面這樣:

```js
function foo(number) {
  return number + 10
}
```

但如果在複合類型的情況，例如這個傳入參數的類型可以是數字類型也可以是布林類型，你又要如何寫得清楚？更不用說如果是個複雜的物件類型時。另外還有函數的回傳類型又該如何來寫？

利用Flow類型的定義方式，來解決這個小案例的問題，可以改寫為像下面的程式碼:

```js
// @flow

function foo(x: number): number {
  return x + 10
}

foo('hi')
```

你有看到我在函式的傳入參數，以及函式的圓括號(())後面兩個地方，加了`: number`標註，這代表這個傳入參數會限定為數字類型，而回傳值也只允許是數字類型。

當使用非數字類型的值作為傳入值時，就會出現由Flow工具發出的錯誤警告，像下面這樣:

> message: '[flow] string (This type is incompatible with number See also: function call)'

這訊息是說，你這函式的傳入參數是string(字串)類型，與你定義的number(數字)不相符。

如果複合類型也是很容易可以加註記的，如果這個函式可以使用布林與數字類型，但回傳值可以是數字或字串，就像下面這樣修改過:

```js
// @flow

function foo(x: number | boolean): number | string {
  if (typeof x === 'number') {
    return x + 10
  }
  return 'x is boolean'
}

foo(1)
foo(true)
foo(null)  // 這一行有類型錯誤訊息
```

由上面這個小例子你可以想見，如果在多人協同開發某個有規模的JavaScript應用時，這種類型的輸出輸入問題，如果利用Flow工具的檢查，可以避免掉許多不必要的類型問題。

## 一個真實案例

可能你會認為Flow工具只能運用在小型程式碼中，但實際上Facebook會創造出Flow工具，有很大的原因是為了React與React Native所需要的。

舉一個我最近正在研究的的函式庫程式碼中[NavigationExperimental](https://github.com/facebook/react-native/blob/9ee815f6b52e0c2417c04e5a05e1e31df26daed2/Libraries/NavigationExperimental/NavigationTypeDefinition.js)(這網址位置有可能會變，因為是直接連到函式庫裡)，這裡面就預先定義所有的物件的結構，像下面這樣的程式碼:

```js
export type NavigationGestureDirection = 'horizontal' | 'vertical';

export type NavigationRoute = {
  key: string,
  title?: string
};

export type NavigationState = {
  index: number,
  routes: Array<NavigationRoute>,
};

// ...

```

Flow具備有像TypeScript語言中，預先定義物件類型的功用。上面程式碼的都是這個元件中預先定義的類型，這些類型可以再套用到不同的程式碼檔案之中。

```js
export type NavigationGestureDirection = 'horizontal' | 'vertical';
```

上面這行類似於列舉(enum)的類型，意思是說要不就是'horizontal'(水平的)，要不然就'vertical'(垂直的)，就這兩種字串值可使用。

```js
export type NavigationRoute = {
  key: string,
  title?: string
};
```

這行裡面用了一個問號(?)定義在`title`屬性的後面，這代表這屬性是可選的(Optional)，不過你可能會有點搞混，因為問號(?)可以放在兩個位置，見下面的例子:

```js
export type Test = {
  titleOne?: string,
  titleTwo: ?string
}
```

`titleOne`代表的是屬性為可自訂的(可有可無)，但一定是字串類型。`titleTwo`代表的是類型可自訂，也就是值的部份除了定義的類型，也可以是null或undefined，不過這屬性是需要的，而且你一定要給它一個值。好吧，這講得太細了，如果有用到再查文件就可以。

```js
export type NavigationState = {
  index: number,
  routes: Array<NavigationRoute>,
};
```

上面的程式碼可以看到，只要是定義過的類型(type)，同樣可以拿來拿在其他類型中套用，像這邊的`Array<NavigationRoute>`，就是使用了上面定義的`NavigationRoute`類型。

剛已經有說過Flow工具有很大的原因是為了React與React Native所設計，因為Flow本身就內建對PropTypes的檢查功能，也可以正確檢查JSX語法，在這篇[官方的文件](https://flowtype.org/docs/react.html#_)中有說明，而這在之後介紹React的文章的範例中就可以看到。

## 安裝與使用

Flow目前可以支援macOS、Linux(64位元)、Windows(64位元)，你可以從以下的四種安裝方式選擇"**其中一種**":

- 直接從Flow的[發佈頁面](https://github.com/facebook/flow/releases)下載可執行檔案，加到電腦中的PATH(路徑)，讓`flow`指令可以在命令列視窗存取即可。
- 透過npm安裝即可，可以安裝在全域(global)或是各別專案中。下面為安裝在專案中的指令:

```
npm install --save-dev flow-bin
```

- macOS中可以使用homebrew安裝:

```
brew update
brew install flow
```

- 透過OCaml OPAM套裝管理程式打包與安裝，請見Flow的[Github頁面](https://github.com/facebook/flow)。

## Flow簡單使用三步驟

### 第1步: 初始化專案

在你的專案根目錄的用命令列工具輸入下面的指令，這將會建立一個`.flowconfig`檔案，如果檔案已經存在就不需要再進行初始化，這個設定檔一樣是可以加入自訂的設定值，請參考[Advanced Configuration](https://flowtype.org/docs/advanced-configuration.html)這裡的說明，目前有很多專案裡面都已經內附這個設定檔，例如一些React的專案:

```
flow init
```

### 第2步: 在程式碼檔案中加入要作類型檢查的註解

一般都在程式碼檔案的最上面一行加入，沒加Flow工具是不會檢查的:

```js
// @flow
```

或

```js
/* @flow */
```

### 第3步: 進行檢查

當有安裝搭配編輯工具的外掛時，編輯工具會輔助顯示，不過有時候會有點卡卡的要等一下，因為檢查速度還不是那麼快。

或是用下面的命令列指令來進行檢查:

```
flow check
```

在Visual Studio Code中因為它內建TypeScript與JavaScript的檢查功能，如果要使用Flow工具來作類型檢查，需要在使用者設定中，加上下面這行設定值以免衝突:

```
"javascript.validate.enable": false
```

## 轉換(編譯)有Flow標記的程式碼

> 註: 在我們之前所教的"開發環境與工具"篇中，其中的樣版文件就已經裝好與設定好這個babel擴充外掛，你不用再多安裝了。

在開發的最後階段要將原本有使用Flow標記，或是有類型註釋的程式碼，進行清除或轉換。轉換的工作要使用babel編譯器，這也是目前較推薦的方式。

使用babel編譯器如果以命令列工具為主，可以使用下面的指令來安裝在全域中:

```
npm install -g babel-cli
```

再來加裝額外移除Flow標記的npm套件[babel-plugin-transform-flow-strip-types](https://www.npmjs.com/package/babel-plugin-transform-flow-strip-types)在你的專案中:

```
npm install --save-dev babel-plugin-transform-flow-strip-types
```

然後建立一個`.babelrc`設定檔案，檔案內容如下:

```json
{
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

完成設定後，之後babel在編譯時就會一併轉換Flow標記。

下面的指令則是直接把`src`目錄的檔案編譯到`dist`目錄中:

```
babel src -d dist
```

當然，babel的使用方式不是只有上面說的這種命令列指令，你可以視專案的使用情況來進行設定。

## Flow支援的資料類型

Flow用起來是的確是簡單，但裡面的內容很多，主要原因是是要看實際不同的使用情況作搭配。JavaScript裡面的原始資料類型都有支援，而在函式、物件與一些新的ES6標準中的像類別，在搭配使用時就會比較複雜，詳細的情況就請到官網文件中觀看，以下只能提供一些簡單的介紹說明。

### 基礎資料類型

Flow支援原始資料類型，如下面的列表:

- boolean
- number
- string
- null
- void

其中的`void`類型，它就是JavaScript中的`undefined`類型。

這裡可能需要注意的是，在JavaScript中`undefined`與`null`的值會相等但類型不同，意思是作值相等比較時，像`(undefined == null)`時會為`true`，有時候在一些執行期間的檢查時，可能會用值相等比較而不是嚴格的相等比較，來檢查這兩個類型的值。

所有的類型都可以使用垂直線符號(|)作為聯合使用(也就是 OR 的意思)，例如`string | number`指的是兩種類型其中一種都可使用，這是一種聯合的類型，聯合(Union)類型最下面有再說明。

最特別的是可選的(Optional)類型的設計，可選類型代表這個變數或常數的值有可能不存在，也就是允許它除了是某個類型的值外，也可以是`null`或`undefined`值。要使用可選類型，就是在類型名稱定義前加上問號(?)，例如`?string`這樣，下面是一個簡單的範例:

```
let bar: ?string = null
```

### 字面文字(literal)類型

字面文字類型指的是以實際的值作為資料類型，可用的值有三種，即數字、字串或布林值。字面文字類型搭配聯合的類型可以作為列舉(enums)來使用，例如以下的一個撲克牌的類型範例:

```js
type Suit =
  | "Diamonds"
  | "Clubs"
  | "Hearts"
  | "Spades";

type Rank =
  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | "Jack"
  | "Queen"
  | "King"
  | "Ace";

type Card = {
  suit: Suit,
  rank: Rank,
}
```

> 註: type是Flow中定義類型別名(Type Alias)的關鍵字，是一種預先定義的類型，這些定義的標記一樣只會在開發階段中使用，最後會去除。

## 類型別名

類型別名(Type Alias)提供了可以預先定義與集中程式碼中所需要的類型，一個簡單的範例如下:

```js
type T = Array<string>
var x: T = []
x["Hi"] = 2 //flow警告
```

類型別名(Type Alias)也可以用於複雜的應用情況，詳見Flow網站提供的[Type Aliases](https://flowtype.org/docs/type-aliases.html)內容。

### 任何的資料類型

在某一些情況可能不需要定義的太過於嚴格，或是還在開發中正在調整測試時，有一種作為漸進地的改善程式碼的類型。

Flow提供了兩種特殊的類型可以作為鬆散的資料類型定義:

- any: 相當於不檢查。既是所有類型的超集(supertype)，也是所有類型的子集(subtype)
- mixed: 類似於any是所有類型的超集(supertype)，但不同於any的是，它不是所有類型的子集(subtype)

`mixed`是一個特別的類型，中文是`混合`的意思，`mixed`算是`any`的"囉嗦"進化類型。`mixed`用在函式的輸入(傳入參數)與輸出(回傳值)時，會有不一樣的狀態，例如以下的範例會出現警告:

```js
function foo(x: mixed): string {
  return x + '10'
}

foo('Hello!')
foo(1)
```

會出現警告訊息如下:

> [flow] mixed (Cannot be added to string)

這原因是因為雖然輸入時可以用`mixed`，但Flow會認為函式中`x`的值不見得可以與`string`類型作相加，所以會要求你要在函式中的程式碼，要加入檢查對傳入類型在執行期間的類型檢查程式碼，例如像下面修改過才能過關:

```js
function foo(x: mixed): string {
  if (typeof x === 'number' || typeof x === 'string') {
    return x + '10'
  }
  throw new Error('Invalid x type')
}

foo('Hello!')
foo(1)
```

`mixed`雖然"囉嗦"，但它是用來漸進取代`any`使用的，有時候往往開發者健忘或偷懶沒作傳入值在執行期間的類型檢查，結果後面要花更多的時間才能找出錯誤點，這個類型的設計大概是為了提早預防這樣的情況。

> 註: 從上面的例子可以看到Flow除了對類型會作檢查外，它也會要求對某些類型需要有動態的檢查。在官方的文件可以參考[Dynamic Type Tests](https://flowtype.org/docs/dynamic-type-tests.html#_)這個章節。

### 複合式的資料類型

#### 陣列(Array)

陣列類型使用的是`Array<T>`，例如`Array<number>`，會限定陣列中的值只能使用數字的資料類型。當然你也可以加入埀直線(|)來定義允許多種類型，例如`Array<number|string>`。

#### 物件(Object)

物件類型會比較麻煩，主要原因是在JavaScript中所有的資料類型大概都可以算是物件，就算是基礎資料類型也有對應的包裝物件，再加上有個例外的`null`類型的`typeof`回傳值也是物件。

物件類型在Flow中的使用，基本上要分作兩大部份來說明。

第一種是單指`Object`這個類型，Flow會判斷所有的基礎資料類型都"**不是**"屬於這個類型的，以下的範例全部都會有警告:

```js
// 以下都有flow警告

(0: Object);
("": Object);
(true: Object);
(null: Object);
(undefined: Object);
```

其他的複合式資料類型，除了陣列之外，都會認為是物件類型。如下面的範例:

```js
({foo: "foo"}: Object);
(function() {}: Object);
(class {}: Object);
([]: Object); // Flow不認為陣列是屬於物件
```

> 注意: 上面有兩個特例，`typeof null`與`typeof []`都是回傳'object'。也就是說在JavaScript的標準定義中，`null`與`陣列`用typeof檢測都會回傳物件類型。所以，Flow工具的檢查會與JavaScript預設會有差異，這一點要注意。

> 註: `typeof`在Flow中有一些另外的用途，詳見[Typeof](https://flowtype.org/docs/typeof.html#use-of-typeof)的說明。

第二種方式是要定義出完整的物件的字面文字結構，像`{ x1: T1; x2: T2; x3: T3;}`的語法，用這個結構來檢查，以下為範例:

```js
let object: {foo: string, bar: number} = {foo: "foo", bar: 0};

object.foo = 111; //flow警告
object.bar = '111'; //flow警告
```

#### 函式(Function)

上面已經有看到，函式也屬於物件(Object)類型，當然也有自己的`Function`類型，函式的類型也可以從兩大部份來看。

第一是單指`Function`這個類型，可以用來定義變數或常數的類型。如下面的程式碼範例:

```js
var anyFunction: Function = () => {};
```

第二指的是函式中的用法，上面已經有看到函式的輸出(回傳值)與輸入(傳入參數)的用法範例。例如以下的範例:

```js
function foo(x: number): number {
  return x + 10;
}
```

因為函式有很多種不同的使用情況，實際上可能會複雜很多，Flow工具可以支援目前最新的arrow functions、async functions與generator functions，詳見官方的這篇[Functions](https://flowtype.org/docs/functions.html)的說明。

#### 類別(Class)

類別是ES6(ES2015)中新式的特性，類別定義語法目前仍然只是原型的語法糖，類別本身也屬於一種物件(Object)類型。類別的使用情況也可能會複雜，尤其是涉及多型與實例的情況，詳見Flow網站提供的[Classes](https://flowtype.org/docs/classes.html)內容。

## Flow的現在與未來的發展

Flow在最近的[部落格](https://flowtype.org/blog/2016/10/13/Flow-Typed.html)中說明引入了[flow-typed](https://github.com/flowtype/flow-typed/)的函式庫定義檔("libdefs")，在這個Github儲存庫中將統一存放所有來自社群提供的函式庫定義檔案。這是一種可以讓現有的函式庫與框架，預先寫出裡面使用的類型定義。讓專案裡面有使用Flow工具與這些函式庫，就可以直接使用這些定義檔，以此結合現有的函式庫與框架來使用。這個作法是參考TypeScript的DefinitelyTyped方式。因為這還是很新的消息(2016.10)，目前加入的函式庫還沒有太多，不過React週邊的一些函式庫或元件都已經開始加入，其他常用的像underscore、backbone或lodash也已經有人在提交或維護。

Flow另一個發展會是在開發工具的自動完成功能的改進，因為如果已經能在撰寫程式碼期間，就知道變數或常數的類型(靜態類型)，那麼在自動完成功能中就可以更準確地給出可用的屬性或方法。這一個功能在Facebook自家的Nuclide開發工具的[Flow說明頁](https://nuclide.io/docs/languages/flow/#autocomplete)中就有看到。Nuclide是基於Atom開發工具之上的工具，電腦硬體如果不夠力是跑不動的，而且它的確穩定性與執行速度都還需要再努力。

## 影片

這個影片中展示了所有這個章節中的設定與安裝的內容。

[![Day04](http://img.youtube.com/vi/UCS8i_sTt-Y/0.jpg)](https://www.youtube.com/watch?v=UCS8i_sTt-Y)

影片網址在[Youtube的這個網址](https://youtu.be/UCS8i_sTt-Y)


## 結論

本文簡單的說明了Flow工具的功能介紹，以及其中的一些簡要的內容等等。相信看過後你已經對這個Flow工具有一些認識，以我個人學過TypeScript的經驗，相較於TypeScript的學習曲線，Flow大概是等於不用學。Flow雖然是一個很新的工具，但相當的有用，建議每個JavaScript開發者都可以試試，一開始不用學太多，大概這篇文章看完就可以開始用了。複雜的地方就再查看官方的文件即可。

對於每個正在使用JavaScript開發稍具規模化的應用，或是開發開放原始碼的函式庫或框架的團隊來說，讓JavaScript具有靜態類型特性，是一個很重要而且必要的決定。以我的觀察，在網路上一直有很多的超集語言(例如TypeScript)的愛好者，會提出要全面改用TypeScript(或其他超集語言)的聲音，例如Vue.js在很早之前就有[討論](https://github.com/vuejs/vue/issues/478)是不是要全面採用TypeScript的聲音。後來Vue.js只有提交TypeScript的[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/vue)檔案，不過在2.0中則採行了Flow工具。在這篇Vue作者對於: [Vue 2.0 为什么选用 Flow 进行静态代码检查而不是直接使用 TypeScript？](https://www.zhihu.com/question/46397274)的內容中，你可以看到為何選擇Flow的理由，這也不一定是作者自己決定的，這是整個開發團隊所認同的最後結果。作者回答的文中可以總結下面這句話:

> 全部換 TS(TypeScript) 成本過高，短期內並不現實。 相比之下 Flow 對於已有的 ES2015 代碼的遷入/遷出成本都非常低 … 萬一哪天不想用 Flow 了，轉一下，就得到符合規範的 ES。

總之，Flow提供了另一個選擇，要用什麼工具就看聰明的你如何選擇了。
