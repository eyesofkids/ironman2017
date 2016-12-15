# React篇: HelloWorld解說與JSX語法

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day15_jsx/asset/intro.png)

"本文章附有影片"。本章的目標是提供上一章的HelloWorld應用的詳盡說明，JSX語法的基礎與元件的三種語法。不過在這之前，我要先說明幾個學習的重點。

> 註: 本文章附有影片，影片網址在[Youtube的這個網址](https://youtu.be/fFmHSta1On0)。本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day15_jsx)。

第一，不要一開始學習React就用官方的例子或是複雜的TodoMVC，例如像TodoMVC或新版官網現在上面的圈叉遊戲這些例子，這些例子不是給剛學習React的開發者看的，TodoMVC這種例子，比較像是現在每個函式庫或框架用來展示能力用的。之前我在一開始學習時，也是一開始就看TodoMVC，老實說是有看沒有懂，後來先把其他的基礎學會了，才能理解這個例子在寫什麼。所以我建議一開始先放慢速度，先把基礎紥實地學會才是比較好的方式。此外，有些人在學這種新的函式庫時，會覺得要像參加旅遊團一樣，用走馬看花的方式一天跑十個旅遊景點，把所有的新的、熱門的東西都花點時間學一遍，我不明白這樣作的目的是為了什麼，目的是趕風潮嗎？我也不認為這樣能真正學到什麼，在網路上已經有看到的，有些人說他已經學過學會的，但寫出來的程式碼可能自己在寫什麼都不知道，英文專有名詞錯字連篇，文章裡面中英文名詞混雜不通順難以理解。如果你學一項技術要學成這樣，那我覺得還是別浪費時間。

第二，我要再次強調，不要用單一個網頁的方式來寫React程式碼。這也是我認為不正確的學習方式，所謂的直接使用網頁，就是用類似jquery的寫法，把所需的函式庫加到script標籤中，在一個html檔案中寫程式碼，聽起來似乎很便利，但這並不是真實開發的情況。如果真的大家都是這樣寫就可以，那就不需要大費周章專門為了寫ES6或React的應用，建立一個開發測試的環境。在官方提供的範例中，有不少簡單的例子都是這樣子的作法，這些例子都是很簡單的一個小功能範例，甚至沒用到ES6或JSX語法。另外，雖然是直接用單一個網頁的方式，實際上如果需要經過babel工具編譯，都還需要額外加一個babel-core。一個之前在討論區中常遇到的問題，像React官方的單一個網頁的這些範例，一直不改用新版的babel-core函式庫，是有什麼原因嗎？因為新版的babel-core一直無法正確編譯React元件，這裡面有很多問題與bugs。

相同的情況也發生在如果你今天去上一門課或看網路上的教學，教授的老師都是用JS Bin或JSFiddle這些網站服務，而不是用電腦的開發環境在教程式碼內容，或許在單純的解說某段程式碼是ok的，但如果一直都是這樣教，這會很容易誤導到學習者，讓學習者們都認為原來大家都是這樣在開發ES6或React應用的。之前的章節已經有提過，這個方式有很多問題，它與真實的開發情況並不相同，假使你今天要套用一個別人寫好的元件模組，這個方式也沒辦法用。

學得精比學得廣來得重要，尤其是在一開始的階段，如果你不能夠的掌握真正的基礎，那麼這段學習時間也是浪費掉而已。再者，知識是一點一滴的學習所累積的結果，每天不間斷地花1小時學習，比一天花12小時學習會來得有效果。對於像這種開發技術的知識學習，實作遠比紙上或網上學習來得重要，看一看這些教學就能學會是不可能的，只有親自動手下去作，才有可能真正的學會。

## 學習目標

1. HelloWorld程式碼說明
2. 基本的開發與執行的流程
3. JSX語法與React Element(元素)
4. React Component(元件)語法

## HelloWorld程式碼說明

上一章最後使用了一個簡單的範例 - `HelloWorld`。這是一個在React中稱之為元件的撰寫方式，現在我們開始來解說這個元件的程式碼內容。或許你會認為這程式碼這麼簡單，有什麼好說的，不過這裡面包含了React應用最基礎的結構，對初學者來說，這些都是必學的基礎知識，之後在複雜的元件中都是同樣的結構。

首先是最上面的兩個語句，這是ES6中引用模組的語句，這兩個是所有React根程式檔案所需要的模組，一個是`React`，另一個是`ReactDOM`:

```js
import React from 'react'
import ReactDOM from 'react-dom'
```

如果你在這個程式碼檔案只需要撰寫元件，不需要渲染(render)到網頁上，那只需引用`React`模組即可。

> 注意: 這裡會有個常遇見的問題，如果你在程式碼裡用了JSX語法，至少要匯入'react'套件，因為JSX語法是個簡寫語法(下面有說明)，裡面用了這個套件裡的方法。

通常我們會把每個元件寫在一個獨立的程式碼檔案之中，這樣比較容易管理，通常檔案名稱就是那個元件的名稱，例如`MyButton`元件的檔案名稱就會使用`MyButton.js`或是`MyButton.jsx`。

> 注意: .jsx副檔名的檔案格式，其實與.js副檔名的並無差異，有些人認為如果程式碼裡用了JSX語法，就使用.jsx副檔名，這樣比較好作區別。不過但前提是你的開發工具要認得這種副檔名，不然語法無法作高亮度顯示，也沒有自動完成的功能。

如果你需要引用某個你自己的元件檔案，只需要用以下的語法就可以引用，不過前提是你的`MyButton.js`中也要有對應的`export`語句，代表輸出模組。這語句中的`./`代表是同一目錄中，注意後面並不需要加上副檔名:

```js
import MyButton from './MyButton'
```

一般來說，在較具規模的應用中，你可以使用元件(Components)、樣式(Style)等等資料夾，來區分不同的程式碼檔案，作為一個檔案管理組織分類的方式。`import`語句可以針對這些資料夾來使用，例如你把`MyButton.js`放在`Components`資料夾中，可以用下面的語法來匯入:

```js
import MyButton from './Components/MyButton'
```

接下來的程式碼是一個元件的類別繼承宣告，因為我們一開始用的元件內容很簡單，所以幾乎沒寫什麼，只有一個`render`方法的定義而已，類別定義是ES6標準的新內容。

```js
class HelloWorld extends Component {
    render() {
        return <h1>{this.props.text}</h1>
    }
}
```

這個宣告代表著元件都是由`React.Component`類別繼承而來的，所有的元件都是一樣的寫法。

```js
<h1>{this.props.text}</h1>
```

那麼這一段是什麼？看起來好像是HTML中的`<h1>`標記的寫法，但中間的又好像是JavaScript的程式碼。

這種把HTML寫在JavaScript的程式碼中的技術，稱之為JSX語法，是React中很特別的一種語法，它可以讓你把HTML中的各種標記，直接混在JavaScript程式碼中來寫(並不是字串，而是直接使用)。JSX語法在React中是一種必學的語法。當HTML的標記與JavaScript互相混在一起時，為了要標明與執行JavaScript的程式碼，所以用了花括號({})把程式碼的部份括起來。所以`this.props.text`這一句是JavaScript的程式碼沒錯。

那麼`this.props.text`指的又是什麼？

`this`是這個元件類別所產生的物件實體，`props`則代表屬性(property)的複數簡寫，也就是有可能有多個屬性，屬性這個東西，其實如果你懂HTML大概就很容易理解，像下面這樣的HTML標記:

```html
<img src="images/test.jpg" width="100" height="100" alt="..." />
```

對`img`元素標記來說，"src"、"width"、"height"、"alt"就是它的屬性。(不過在英文裡專有名詞叫"attributes"，中文翻譯也是"屬性")

我們的`HelloWorld`元件會拿來與HTML中的`img`標記比對，那有什麼是它的屬性(props)？就是`text`這個。下面這段程式碼的意思是，要把`HelloWorld`元件中的`text`屬性的值，顯示在這個位子上:

```js
{this.props.text}
```

怎麼看出來它這個屬性，最後是什麼值？就App.js中的這一段的程式碼:

```js
<HelloWorld text="今天就開始學React!" />
```

有看到`<HelloWorld text="今天就開始學React!" />`這行了嗎？它是不是長得和上面說的HTML中的`img`標記的語法有點像，當然我們只能透過這個方法來作這件事，你不能直接存取或修改網頁上DOM元素。

那麼要渲染(顯示)怎麼樣的內容呢？就是`<HelloWorld text="今天就開始學React!" />`這個元件的內容。

`HelloWorld`是我們設計好的元件，它真正的HTML顯示內容是下面這個，所以最後的輸出就是把`text`裡面的值代換入這個內容中:

```js
<h1>{this.props.text}</h1>
```

也就是像下面這樣:

```html
<h1>今天就開始學React!</h1>
```

props是讓元件之間建構出擁有者元件(owner)與被擁有者元件(ownee)間的關係，這也是父母元件與子女元件間的傳遞資料(溝通)的第一種關係，可以由下圖來說明:

![props](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day15_jsx/asset/props.png)

擁有者通常指的是某個位於上層的元件。規則很簡單:

- A元件在`render()`中建立了B元件，A就是B的擁有者。(或者可以說因為A元件的定義中設定了B元件的屬性)
- 元件是無法改變自己的`props`(屬性)，這是它的擁有者才可以作的事。

> 特別注意: 元件無法改變自己的`props`，這是我們學習到的第一條React的強硬規則。一定要記住。

> 註: 在這個範例中，我們使用了三個程式檔案，分別是index.js, App.js, HelloWorld.js。這只是一般應用上的分隔，你不一定要按照這個區分方式。index.js作為最後把虛擬DOM轉譯為直實DOM的檔案，它算是個入口檔案(entry)。App.js則是集中整合所有的元件，它是整個應用的元件控制中心。HelloWorld.js則是我們自己寫的元件內容，之後有可能有很多元件。這樣作看起來很麻煩，但這樣的分隔實際上有一些好處，它可以讓每個程式檔案要作的事情分隔清楚。之後如果元件愈來愈多時，就可以獲得比較好的組織管理。

## 開發與執行的流程

React開發的流程大致上像下面這樣:

1. 撰寫每個元件的內容，每個元件區分不同的程式碼檔案，每個元件之間可以互相輸出匯入來引用。
2. 最後統整到index.js中，以`ReactDOM.render`方法作最後的輸出(渲染)的工作。
3. 開發完成打包(壓縮 & 醜化)成一個js檔案，然後發佈這個檔案。

因為React函式庫並沒有附帶可以負責組織整體流程的框架，要作資料流與元件之間的溝通，只能使用一些基本方式。如果要在複雜的元件間作互動管理，需要另外再使用Redux之類的Flux概念架構函式庫來協助。不過這個要等到你對React的開發已經有一定的熟悉程度再來使用，後面的課堂會再說明。

另外，React是一種SPA(單頁式應用程式)的開發函式庫，如果要作複雜一點的不同功能畫面的切換，一般都會使用像[react-router](https://github.com/reactjs/react-router)函式庫來作不同元件間的切換工作，實際上這也算是一個必學的函式庫，後面的課堂會再說明。

## JSX語法與React Element(元素)

React的核心概念中有兩個，一個是React Element(元素)，另一個是React Component(元件)，兩者都是虛擬DOM中的東西。React Element(元素)是其中最基本的概念。

React Element(元素)是一個React用於描述虛擬DOM元素的物件，它只有單純用於描述的屬性值，其中沒有帶有方法，在(prototype)原型中也沒有其他東西，它用四個重要的屬性來描述DOM元素:

- type: 一個字串，代表任何合法的HTML元素類型名稱，例如h1、div，或是參照到React程式碼中定義的的元件類別。
- props: 對應到元素的屬性值的屬性。
- key: React用來識別元素的屬性，尤其是在同樣類型的元素間要用這個屬性來區分。
- ref: React用來存取對應的實體(真實)DOM用的屬性。

React Element(元素)需要透過`ReactDOM.render`方法，才能把虛擬DOM元素，轉換為實體(真實)DOM，也就是說React Element(元素)代表的是一種無狀態的、不可改變的、虛擬的DOM元素，它就是所謂的"**Virtual DOM**"的組成分子。React元素與元件間是一種"你之中有我，我之中有你"的結構。

React提供了`React.createElement`方法，讓開發者可以自行定義React Element(元素)，也可以組合元素們間的 父母-子女(parent-children) 關係。下面的程式碼範例中，使用了`React.createElement`方法來建立虛擬的DOM元素:

```js
var child = React.createElement('li', null, '項目')
var root = React.createElement('ul', { className: 'my-list' }, child)

ReactDOM.render(root, document.getElementById('root'))
```

最後在網頁上的真實DOM元素的結構會像下面這樣:

```html
<ul data-reactroot="" class="my-list">
  <li>項目</li>
</ul>
```

這個React Element(元素)，也就是用於描述的虛擬DOM元素的JavaScript物件會長這個樣子，實際上是可以有巢狀結構的:

```js
{
  type: 'ul',
  props: {
    className: 'my-list',
    children: {
      type: 'li',
      props: {
        children: '項目'
      }
    }
  }
}
```

講了這麼久，那JSX語法與這個React Element(元素)有什麼關係？

我們先說明JSX語法是什麼，是一種可以讓HTML標記直接寫在JavaScript程式碼中的擴充語法，`X`代表的是`XML`語法的意思，React允許你可以這樣作，是因為它在讀到JSX語法時，會自動幫你用`React.createElement`方法來建立虛擬的DOM元素，也就是說JSX語法實際上就是使用`React.createElement`方法的簡寫語法。這當然需要透過babel編譯工具才能正確轉譯，之前有提過babel是Facebook贊助的專案，自然會跟著React要作什麼運用而加這些功能。

雖然React並沒有強迫你一定要用JSX語法來定義虛擬的DOM元素的結構與內容，但說實在的，如果DOM元素複雜了些，加上又在其中要混用JavaScript語句，使用`React.createElement`會讓程式碼顯得混亂，所以JSX語法是一定要用的。上面的範例寫成JSX語法會非常的直覺，就像在寫一般的網頁HTML碼一樣:

```js
const root =  <ul className='my-list'><li>項目</li></ul>
```

當然，JSX語法中的這些HTML標記，並不是真正的網頁上HTML的標記，而是人造的、假的，這是經過React中設計的用來對應合法的HTML標記。有些HTML的標記中的屬性會和JavaScript語言相衝突，所以會被改用別的名稱，不過這種例外情況並不多見，只有HTML標記中的屬性`class`與`for`，它們在JSX語法中要改用`className`與`htmlFor`來取代，官方的這個[深入 JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)網頁上可以參考更多資訊。

你如果要把用JSX語法寫成的語句，倒回去看真正的`React.createElement`的方法應該怎麼寫，可以用[babel提供的線上轉換程式](https://babeljs.io/repl/)來轉換，這一段JSX的語法，真正的JavaScript執行語句是，和上面的寫法差不多，只是寫到同一個語句中:

```js
var root = React.createElement(
  'ul',
  { className: 'my-list' },
  React.createElement(
    'li',
    null,
    '項目'
  )
);
```

React Element(元素)也可以用來描述我們自訂的元件，就像一般的HTML元素一樣。我們在`HelloWorld`範例中用的JSX語法有兩個地方，我把它們的對照createElement方法的程式碼寫在下面。其中一個是元件的類別定義處:

```js
//JSX
<h1>{this.props.text}</h1>

//createElement
React.createElement(
  "h1",
  null,
  undefined.props.text
);
```

另一個是在最後的`ReactDOM.render`方法中:

```js
//JSX
<HelloWorld text="今天就開始學React!" />

//createElement
React.createElement(HelloWorld, { text: "今天就開始學React!" });
```

React Element(元素)會把我們自訂的元件，當作一種特別的`type`(類型)，也就是把它當作是一種可以使用的DOM元素來描述，當然同樣也可以有巢狀的結構。

## React Component(元件)語法

React Component(元件)是React的真正的心臟與靈魂。可以說React就是一個讓開發者打造自訂元件用的函式庫。相較於React Element(元素)只是單純的描述虛擬DOM的屬性內容，React Component(元件)則是裡面可以封裝多個React Element(元素)或封裝其他元件，也可以帶有狀態(state)，以及各種事件處理的方法。

在React v15中，我們可以用下面三種方式來定義一個元件。會有這麼多種的方式，大概是React的設計者們認為，多幾種方式可以讓不同需求的開發者增加來使用React的誘因，菜色不同但都可以吃好吃飽。

第一種在`HelloWorld`的範例中有看到了，這是ES6+的類別定義方式，是使用繼承自React.Component類別的語法，這樣式又可以稱為建構式樣式(constructor pattern)。因為現在可以直接執行ES6+相關語法與API的瀏覽器，通常會需要要新版本的瀏覽器，而且還不見得會100%相容。所以我們會先經由babel工具幫忙先轉成ES5語法再執行，這樣在瀏覽器各種不同版本與品牌中，可以得到最大的相容性。ES6+是一種未來將會普及的語法，這也是時間早晚的問題而已。

```js
class HelloWorld extends Component {
    render() {
        return <h1>{this.props.text}</h1>
    }
}
```

> 註: ES6+指的是使用了ES6標準以上的語法或API。

第二種是ES5的語法，這是為了要能相容於只支援ES5的瀏覽器，所使用的一種方式，最早React的版本中只有這種語法，所以現在官網或網路上的範例大部份都是用這種語法，如果你連JSX語法也不使用的話，那麼是完全可以不需要babel工具，就可以在各種支援ES5標準的瀏覽器中執行。這種樣式又可以稱之為工廠樣式(factory pattern)。不過現在開始這種語法會慢慢減少，主因是它在自訂方法或屬性時，比第一種方式的彈性少很多。

```js
var HelloWorld = React.createClass({
  render: function() {
    return <h1>{this.props.text}</h1>
  }
});
```

第三種是函式定義樣式，這只能在無狀態的函式元件(Stateless functional components)上使用，像我們這個`HelloWorld`就是無狀態的(stateless)，裡面沒有定義`state`值與相關生命週期的方法，純粹是個顯示用的簡單元件，所以可以用這個語法。這個語法是在React 0.14版本才加入的，也是前不久的事情而已(2015/10)。通常這個樣式還會使用ES6中的箭頭函式語法，讓程式碼更簡潔，不過它看起來不太像是個功能很強大的元件就是了，純粹是個函式而已:

```js
 const HelloWorld = (props) => (
   <h1>{props.text}</h1>
 )
```
> 註: 不知道你有發覺到了嗎，這無狀態元件的寫法，其實就是我們之前有一章談到的"純粹函式"。
>
> 註: React的最近版本是從0.14直接大跳板號到15.0的。
>
> 註: 箭頭函式的後面使用括號(())是只有單個語句時使用的，會自動加上return在語句前。如果是多行語句要用花括號({})，而且要自行加上return的語句。


結果這三種語法對我們的`HelloWorld`元件來說，都可以得到同樣的結果。實際上不論你是用ES6類別的定義(建構式樣式)，或是`React.createClass`方法(工廠樣式)，React都不允許你自己建立元件的實體，元件仍然是在虛擬DOM中的東西，也就是說就算你使用類別的定義方式，你在整個的應用中，也不能使用`new`運算符來由類別產生實體。產生實體這件事要交給React來作，`ReactDOM.render`是唯一能將虛擬DOM(渲染)到實體DOM的方法。

所以，不論你是使用類別、`React.createClass`方法或函式定義，它們都是React的元件，仍然是把props(屬性)當成輸入，最後把React Elements(元素)作為回傳，這也是元件最基本的結構。不過當然每種語法所能使用的特性有所不同，使用的語法也不相同。

在本課堂中，我們只會使用第1種ES6+語法與第3種，工廠模式是算是舊的ES5語法，現在有很多新的範例或教學都開始改用新式的ES6+語法了。如果你會第1種語法，要看得懂ES5語法不會很困難。

## 影片

[![Day15](http://img.youtube.com/vi/fFmHSta1On0/0.jpg)](https://www.youtube.com/watch?v=fFmHSta1On0)

## 結論

本章說明了簡單的HelloWorld應用中的幾個基本的知識，在讀過本章後，應該掌握的幾個重點如下:

- JSX語法是React.createElement的簡寫語法，要使用它需要匯入(import)react函式庫，並且要透過babel工具編譯才可以。
- props(屬性)是在JSX語法中，用類似HTML標記的方式，在標記中指定屬性給元件的一種語法。
- 元件不能改變自己的props，只有它的擁者有元件(owner)可以作這件事。
- 元件共有三種語法，不同的語法可以得到同樣的結果，目前都是使用ES6類別的語法，以及無狀態的函式元件語法。
