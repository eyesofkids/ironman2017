# React篇: TodoListStyle


# CSS style, classname

## inline style(內聯樣式)

inline style(內聯樣式)是一種很早期的對於DOM元素作樣式定義的撰寫風格，指的就是把CSS樣式的定義，直接插入到元素的`style`屬性中。它的範例大概會像下面這樣個範例:

```html
<div style="width: 800px; margin: 1em auto; font: bold 1em/1.2 Verdana, Arial, Helvetica, sans-serif;">
    <div style="float: left; width: 400px; padding: 1em 2em; font-size: 0.9em;">
        some text...
    </div>
</div>
```

inline style(內聯樣式)是一個明顯有許多缺點的作法，一看就知道它不容易撰寫也不容易維護。現今對於網頁上DOM元素的CSS樣式定義方式，都是採用分離出CSS定義檔案的作法，獨立出所有的CSS定義，然後對DOM元素使用id或class屬性來指定風格。例如你可以獨立把CSS樣式放在一個獨立的css檔案中:

```html
<link rel="stylesheet" href="css/base.css" type="text/css" media="screen">
```

或是在HTML檔案中加入<style>標記來定義:

```html
<style>
  #parent{
    width: 800px;
    font: bold 1em/1.2 Verdana, Arial, Helvetica, sans-serif;
  }

  .child{
    float: left;
    width: 400px;
    padding: 1em 2em;
  }
</style>
```

然後把原本的HTML元素中的屬性改為id或class，像下面這樣:

```html
<div id="parent">
    <div class="child">
        some text...
    </div>
</div>
```

這樣的作法有很多優點，幾乎是現在所有網站採行的方式，例如以下幾個:

- 容易集中、組織與管理CSS樣式，可以重覆使用相同的樣式
- CSS定義可以進行壓縮，減少傳輸大小
- CSS定義可以被瀏覽器快取，重覆使用，增加速度

不過在經歷過一段使用後，CSS仍然出現了一些本質上的問題，現在我們看到現今很多新的應用技術在這上面出現，例如LESS、SASS、Stylus之類的預先處理器(Preprocessor)，PostCSS之類的後續處理器(Preprocessor)與CSS Module，這些技術的出現，都是為了要解決CSS目前面臨的問題。

現在的CSS的使用方式是有什麼問題？大致上有以下幾個:

- 所有的東西都是全域的: 在CSS的定義中，所有的選擇子(Selectors)都是全域可見的，並沒有沒有全域(global)與本地(local)的差異，這代表要重覆使用同樣的樣式會變得不容易組織，而且也很容易DOM元素子層會嵌套到父母層的CSS定義。

- CSS檔案愈來愈大: 因為網站的HTML DOM元素樣式愈來愈複雜，CSS通常也會隨著愈來愈大，CSS在進行刪除不必要的定義時會難以取捨，所以總是不斷在新增新的CSS定義，最佳化最後會變成一個令人頭痛的問題。

- 相依性問題: 如果CSS檔案還有使用其他的外部的CSS，CSS的嵌套就會很容易互相影響到，相依性無法進行有效的管理。

- 動態樣式: 動態樣式是一個與程式設計相關的議題，因為程式碼與CSS定義的分離後，只能在程式中使用id與class的變更來進行動態樣式的作法，分割得太清楚反而對於程式開發時並不直觀，在測試與除錯時也會造成困難點。

> 註: 在這份[React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js)簡報中有列出更多的總共7項問題

## CSS in JavaScript

JavaScript中原本就有完整的定義CSS樣式的許多介面(物件)、屬性與方法，只是很少被使用，或是只被包裝在工具函式庫之中。在CSS分離的撰寫風格的時代，HTML、CSS、JavaScript三者分離各自開發是很簡單而且有效率的作法，因為要分離的很清楚，在JavaScript程式之中很少會直接定義CSS樣式，也就是使用內聯的樣式。

JavaScript中原本就有一個對應HTML元素實作HTMLElement介面(物件)，裡面就有一個`style`屬性，可以直接定義某個網頁上的元素的樣式，不過它使用了經過調整的[CSS屬性名稱](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)，因為JavaScript把CSS的定義屬性名稱要當作物件的屬性識別名來使用，所以會原本的CSS中的定義名稱有些差異，不過9成以上都是改成小駝峰式的命名法而已，例如原本的`background-image`改為`backgroundImage`這樣，只有少數幾個例外，像`float`需要改為`cssFloat`。

利用這些CSS屬性名稱就可以寫出套用inline style(內聯樣式)的程式碼，像下面這樣的簡單範例:

```js
function alterStyle(elem) {
  elem.style.background = 'green'
}

function resetStyle(elemId) {
  elem = document.getElementById(elemId)
  elem.style.background = 'white';
}
```

那對於CSS中的class(類別)又要如何套用？

CSS類別要使用的是HTMLElement介面的上層介面Element，其中有一個[className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)的屬性，給定要套用的CSS類別名稱就行了。用法與`style`屬性並都差不了多少，但你要事先定義好CSS類別的名稱，像下面的範例這樣:

```js
function changeBgToRed(){
  document.getElementById('d').className = 'bg-red'
}

function changeBgToGreen(){
  document.getElementById('d').className = 'bg-green'
}
```

> 註: 會採用`className`作為CSS class(類別)的屬性名稱是因為與原本JavaScript中的關鍵字`class`相衝突。

不過因為`className`屬性的用法過於簡單，後來又有一個新的屬性[classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)，它可以完全取代`className`屬性，可以套用多個CSS類別，裡面提供了下面幾個方法，可以更加彈性的套用、移除、切換CSS類別的使用:

- add: 加入CSS類別名稱，如果已經有了就忽略
- remove: 移除CSS類別名稱
- toggle: 在add與remove之間中切換
- contains: 檢查是否有包含某個CSS類別

```js
function addBoldText(){
  document.getElementById('d').classList.add('bold-text')
}

function removeBoldText(){
  document.getElementById('d').classList.remove('bold-text')
}

function toggleBoldText(){
  document.getElementById('d').classList.toggle('bold-text')
}
```

`classList`屬性相當的容易使用，雖一的缺點就是IE瀏覽器對它相當不友善，要在 IE10 以上才能使用。IE9 以下的解決方案請參考[Code with classList does not work in IE?](http://stackoverflow.com/questions/8098406/code-with-classlist-does-not-work-in-ie)。

## 關於React元件樣式

### inline style(內聯樣式)

React官網建議這對於元件會採用內聯樣式的作法完全不意外，React元件是一種元件設計的樣式寫法，為了讓每個元件的外觀樣式獨立，自然會採用內聯樣式的作法。再者，樣式的改變通常與程式的邏輯有關，也就是以元件的狀態或行為對應的樣式。

inline style(內聯樣式)有許多人會誤解這是React自創的寫法，但實際上它是JavaScript中原本就有的HTML元素介面的屬性。內聯樣式可以使用程式碼提供動態的資料，用這種方式可以依不同的情況來套用不同的CSS樣式，一個簡單的範例如下:

```js
const divStyle = {
  color: 'white',
  backgroundImage: 'url(' + imgUrl + ')',
  WebkitTransition: 'all', // 這是新的CSS樣式的定義，注意它的開頭是用大寫'W'
  msTransition: 'all' // 'ms'是指提供商的前綴字
}

ReactDOM.render(<div style={divStyle}>Hello World!</div>, mountNode)
```

### classnames

雖然React中提供了HTML元素可使用的`className`屬性，但它就是像上面說的那個來自Element介面的`className`屬性，React中並沒有`classList`這個屬性可用，也沒有裡面的好用方法，為什麼不提供當然是因為這些方法都是直接影響到實體DOM元素上的方法。在之前React提供了一個cx工具來作類似`classList`中方法的事情，但現在cx已經棄用，要改用[classnames](https://github.com/JedWatson/classnames)專案來作處理，不過說實在一樣是用來組合(join)或組織CSS類別的作法，`classnames`比`classList`中的方法彈性大多了。

### styled-components專案

JavaScript提供的CSS介面畢竟對前端開發工程師來說，是一個很不習慣的語法，雖然它具有程式語言的一些運算的能力，但在社群間有一些新的專案，致力於開發出可以在React中直接寫CSS語法的一些解決方案。

[styled-components](https://github.com/styled-components/styled-components)

## 最佳實踐是？

現今CSS中的問題基本上與React關係並不大，React目的自然是把HTML、CSS、JS三者，全部最好都合在React元件中的程式碼裡來撰寫，React官方說明是用內聯樣式，並不代表開發者就得這樣作，它並不是給了一個最終的答案，而是問了一個好問題，社群上對這個議題提出了許多解決的方案，有人認為React元件用內嵌樣式是絕對合理的，應該就是要這樣作，但也有人認為這個方式是不好的，意見都很多。

以下列出幾種CSS樣式在React中的使用選擇:

### 使用現成的CSS框架

像Bootstrap或Semantic UI這些眾多的現成CSS框架，都可以使用`className`屬性來指定給React中的元件或DOM元素，直接用就可以了，你不需要另外學什麼特別的語法。

### 直接使用CSS(或像SASS的預處理器)



### 使用為React開發的UI框架

這有很多選擇，現在有很多專案都是在開發專門給React使用的整套UI框架，例如

- [Material-UI](http://www.material-ui.com/#/)、
- [React-Bootstrap](https://github.com/react-bootstrap/react-bootstrap)
- [ant-design](https://github.com/ant-design/ant-design)
- [react-toolbox](https://github.com/react-toolbox/react-toolbox/)
- [mui](https://github.com/muicss/mui)
- [grommet](https://github.com/grommet/grommet)

使用這些UI框架自然有一些好處，應用程式的整體設計會一致，而且它們多半都已經設計好很多React相關的UI元件，直接使用就可以了。

### CSS Modules

[CSS Module](https://github.com/css-modules/css-modules)是一個很常被使用的CSS處理技術概念，它可以藉由很多工具來實現，首先它會把原本的CSS定義轉化為更具彈性與可程式化的[Interoperable CSS](https://github.com/css-modules/icss)(可交互操作的CSS, ICSS)，這是一種基於CSS的超集合，原本的CSS檔案(如果是引用外部檔案的方式)，可以在裡面進行更多的定義，例如定義類別合成、全域或本地的作用域等等，這些檔案也可以進行模組化、以及把類別轉換為JavaScript的變數。

CSS Module使用Webpack加上css-loader就可以使用，大部份使用於React的樣版文件，都已經設定與安裝好它。針對React元件還有專門為它打造的[React CSS Modules](https://github.com/gajus/react-css-modules#webpack-css-loader)，如果有需要可以再安裝，提供更多彈性的運用。

### 在JavaScript中使用內嵌樣式(inline style)

[Radium](https://github.com/FormidableLabs/radium)

> 那麼對你來說是要選擇哪一種？




## 參考資料

https://www.youtube.com/watch?v=ERB1TJBn32c

http://stackoverflow.com/questions/26882177/react-js-inline-style-best-practices

https://voice.kadira.io/state-of-react-and-css-501d179443d3#.ft7rk2lie

- [React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js)
- [Setting CSS Styles Using JavaScript](https://www.kirupa.com/html5/setting_css_styles_using_javascript.htm)
- [Using the classList API](https://www.kirupa.com/html5/using_the_classlist_api.htm)
