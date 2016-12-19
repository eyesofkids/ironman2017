# React篇: TodoList程式 + 樣式(Style)

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day19_todolist_style/asset/intro.png)

本章的目標是在React元件中的套用樣式(Style)，而且可以因狀態改變的作樣式變化，從上一章的程式碼作這些修改都是很簡單的，在React中使用CSS的樣式是個很重要而且有很多議論的主題，本章的重點在後面的說明部份，程式碼部份純粹是個簡單的範例而已。

這個程式最後的呈現結果，會是在網頁上出現一個文字輸入框，當你輸入文字後按下Enter鍵，就會把文字加到下面的列表中，每個項目用滑鼠點按一下，會觸發這個項目的樣式變化。就像下面的動態圖片這樣:

![TodoList樣式元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day19_todolist_style/asset/day19_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day19_todolist_style/)，所有的程式碼也在裡面。

這支程式其實只是改了一下TodoList元件與TodoItem元件而已，因為整個應用程式的功能還很簡單，所以也就不套其它的樣式進來。

先從TodoList元件看，程式碼整體就請直接看程式檔案，這裡只有說明更動的這些地方而已。

一開始，我們在原本state中記錄的items陣列，在之前的程式中每個陣列成員中記錄一個字串值，現在把它擴充到一個物件值，除了`text`屬性對應原本的字串值，再多加了一個`isCompleted`屬性，代表這個項目是不是已經被標記為完成了，所以是個布林值，它的物件結構像下面這樣:

```js
type Item = {
  text: string,
  isCompleted: boolean,
}
```

原先的`handleKeyPress`方法，是在按下文字輸入框的Enter鍵，然後加入新項目的程式碼，也要跟著變動，預設剛加入的待辦事項都是未完成的，也就是`isCompleted: false`，像下面這樣:

```js
const aItem = {text: e.target.value, isCompleted: false }
const newItems = [aItem, ...this.state.items ]
```

原先的`handleRemoveItem`方法，現在要改成另一個方法，也就是當滑鼠點按每個項目時，只會作樣式的變化，並不會把這個項目從陣列中移除，下面這是新的`handleStylingItem`方法程式碼，當然在每個項目要指定的`onItemClick`屬性也要改成它:

```js
//處理樣式變化其中一個陣列中成員的方法
handleStylingItem = (index: number) => {
  //拷貝一個新陣列
  const newItems = [...this.state.items]

  //切換isCompleted的布林值
  newItems[index].isCompleted = !newItems[index].isCompleted

  //整個陣列重新更新
  this.setState({
    items: newItems,
  })
}
```

其實這個方法只是切換在陣列成員中的`isCompleted`屬性，用的是否運算符(!)來切換布林值。這其中依然是用純粹函式的寫法，不會直接變動到原先的陣列值，而是用一個新的陣列來先作拷貝原有的陣列值，然後在這上面更動，之後再指定回去。

在render的部份，你可以看到TodoItem多了一個`style`屬性，這個屬性的指定值，將會由項目物件中的`isCompleted`值決定，`style`屬性將會是個物件值，這裡用的是內嵌樣式的寫法，本章的最後面有一些較為詳盡的說明。另外，`onItemClick`屬性也指定到新的處理方法`handleStylingItem`，程式碼如下:

```js
{
  this.state.items.map((item, index) => {
    return <TodoItem
              key={index}
              style={item.isCompleted? {color: 'red', textDecoration: 'line-through'} : {color: 'green'}}
              text={item.text}
              index={index}
              onItemClick={this.handleStylingItem}
            />
  })
}
```

最後來看TodoItem中的改變，其實就多了一個`style`屬性，所以在Flow標記，以及propTypes都要加上這個屬性的檢查標記。`style`屬性是所有的HTML的DOM元素中都有的一個屬性，JSX最後會把物件值轉變為真實套用的內嵌樣式，下面是TodoItem元件的整個程式碼:

```js
//@flow
import React from 'react'

const TodoItem = (props: {text: string, index: number, style: Object, onItemClick: Function}) => {

  const handleClick = () => {
        //實際上呼叫的是由上層元件從props.onItemClick傳入的方法(上層元件的方法)
        props.onItemClick(props.index)
    }

  return <li onClick={handleClick} style={props.style}>{props.text}</li>
}

//加入props的資料類型驗証
TodoItem.propTypes = {
  text: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
  onItemClick: React.PropTypes.func,
  style: React.PropTypes.object,
}

//匯出TodoItem模組
export default TodoItem
```

---

## 其他的詳細說明

### 內嵌樣式與目前的網頁上的CSS使用方式

內嵌樣式(inline style)是一種很早期的對於DOM元素作樣式定義的撰寫風格，指的就是把CSS樣式的定義，直接插入到元素的`style`屬性中。長得大概會像下面這樣個範例:

```
<div style="width: 800px; margin: 1em auto; font: bold 1em/1.2 Verdana, Arial, Helvetica, sans-serif;">
    <div style="float: left; width: 400px; padding: 1em 2em; font-size: 0.9em;">
        some text...
    </div>
</div>
```

內嵌樣式(inline style)是一個明顯有許多缺點的作法，一看就知道它不容易撰寫也不容易維護。現今對於網頁上DOM元素的CSS樣式定義方式，都是採用分離出CSS定義檔案的作法，獨立出所有的CSS定義，然後對DOM元素使用id或class屬性來指定風格。例如你可以獨立把CSS樣式放在一個獨立的css檔案中:

```
<link rel="stylesheet" href="css/base.css" type="text/css" media="screen">
```

或是在HTML檔案中加入`<style>`標記來定義:

```
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

```
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

### 在JavaScript中的CSS

JavaScript中原本就有完整的定義CSS樣式的許多介面(物件)、屬性與方法，只是之前很少被使用，能看到的有可能只被包在工具函式庫之中。在現在HTML、CSS、JavaScript三者分離，各自撰寫定義檔案，是個簡單而有效率的作法。也因為要分離的很清楚，在JavaScript程式之中很少會直接定義CSS樣式，也就是使用內嵌的樣式。

JavaScript中原本就有一個對應HTML元素實作HTMLElement介面(物件)，裡面就有一個`style`屬性，可以直接定義某個網頁上的元素的樣式，不過它使用了經過調整的[CSS屬性名稱](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)，因為JavaScript把CSS的定義屬性名稱要當作物件的屬性識別名來使用，所以與原本的CSS中的定義名稱有些差異，不過9成以上都是改成小駝峰式的命名法而已，例如原本的`background-image`改為`backgroundImage`這樣，只有少數幾個例外，像`float`需要改為`cssFloat`。

> 註: 在JavaScript中關於CSS與HTML的相關標準，是來自W3C組織所訂定，MDN把它們都歸在Web APIs裡，裡面的內容也非常的很多，有些新的功能是瀏覽器品牌與版本的支援程度都很散亂。

利用這些CSS屬性名稱就可以寫出套用inline style(內嵌樣式)的程式碼，像下面這樣的簡單範例:

```js
function alterStyle(elem) {
  elem.style.background = 'green'
}

function resetStyle(elemId) {
  elem = document.getElementById(elemId)
  elem.style.background = 'white'
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

> 註: 會用`className`作為CSS class(類別)的屬性名稱是因為與原本JS中的關鍵字`class`相衝突。另一個for屬性是用在label標記上的，因為也與JS中的關鍵字衝突，所以要改用[htmlfor](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)。

不過因為`className`屬性的用法過於簡單，它可以指定單一個CSS類別識別名字串，或是以空格分隔的多個CSS類別識別名字串，就這樣而已。後來又有一個新的屬性[classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)，它可以完全取代`className`屬性，除了也可以套用多個CSS類別，裡面提供了下面幾個方法，可以更加彈性的套用、移除、切換CSS類別的使用:

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

`classList`屬性相當的容易使用，唯一的缺點就是IE瀏覽器對它相當不友善，要在 IE10 以上才能使用。

> 註: IE9包含以下版本的解決方案請參考[Code with classList does not work in IE?](http://stackoverflow.com/questions/8098406/code-with-classlist-does-not-work-in-ie)。

> 註: 截止目前為止(2016.12)，React並不支援`classList`屬性，但React中的`className`屬性一樣可以用空格來同時指定多個CSS類別。你可以改用[classnames](https://github.com/JedWatson/classnames)。

### React元件樣式

#### 內嵌樣式(inline style)

React官網建議這對於元件會採用內嵌樣式的作法完全不意外，React元件是一種元件設計的樣式寫法，為了讓每個元件的外觀樣式獨立，自然會採用內嵌樣式的作法。再者，樣式的改變通常與程式的邏輯有關，也就是以元件的狀態或行為對應的樣式。

內嵌樣式(inline style)上面已經有說明過了，有許多初學者會誤以為這是React自創的寫法，但實際上它是JavaScript中原本一種定義CSS樣式的方式。內嵌樣式可以使用程式碼提供動態的資料，用這種方式可以依不同的情況來套用不同的CSS樣式，一個簡單的範例如下:

```js
const divStyle = {
  color: 'white',
  backgroundImage: 'url(' + imgUrl + ')',
  WebkitTransition: 'all', // 這是新的CSS樣式的定義，注意它的開頭是用大寫'W'
  msTransition: 'all' // 'ms'是指提供商的前綴字
}

ReactDOM.render(<div style={divStyle}>Hello World!</div>, mountNode)
```

#### className屬性

React中的`className`屬性可以用空格來同時指定多個CSS類別，你可以用空格來區分多個不同的CSS類別，用一般的字串值或樣版字串都可以，例如下面的程式碼:

```js
const myClassNames = 'class1 class2 class3'
const cssClassNames = `${error} form-control input-lg round-lg`

<li className={myClassNames}>foo</li>
<input cssClassNames={cssClasses} />
```

#### classnames專案

雖然React中提供了HTML元素可使用的`className`屬性，但它就是像上面說的那個來自Element介面的`className`屬性。React中並沒有`classList`這個屬性可用，也沒有裡面的好用方法，為什麼不提供當然是因為這些方法，因為它們都會直接影響到實體DOM元素。在之前React提供了一個cx工具來作類似`classList`中方法的事情，但現在cx已經棄用，要改用[classnames](https://github.com/JedWatson/classnames)專案來作處理，不過說實在一樣是用來組合(join)或組織CSS類別的作法，`classnames`比`classList`中的方法彈性大多了。

#### styled-components專案

JavaScript提供的CSS介面畢竟對前端開發工程師來說，是一個很不習慣的語法，雖然它具有程式語言的一些運算的能力，但在社群間有一些新的專案，致力於開發出可以在React中直接寫CSS語法的一些解決方案。[styled-components](https://github.com/styled-components/styled-components)是一個最近才開始的專案，它可以讓你直接在程式碼裡使用一般的CSS定義方式，它用了一個新的ES6特性，稱為樣版字串或樣版字面文字([Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals))，也可以使用在React Native專案上。

### 最佳實踐

現今CSS中的問題基本上與React關係並不大，React目的自然是把HTML、CSS、JS三者，全部最好都合在React元件中的程式碼裡來撰寫，React官方說明是用內嵌樣式，並不代表開發者就得這樣作，它並不是給了一個最終的答案，而是問了一個好問題，社群上對這個議題提出了許多解決的方案，有人認為React元件用內嵌樣式是絕對合理的，應該就是要這樣作，但也有人認為這個方式是不好的，各種意見都有。

那對你來說，該如何選擇，我先在下面列出幾種CSS樣式在React中的使用選擇:

#### 使用現成的CSS框架

像Bootstrap或Semantic UI這些眾多的現成CSS框架，都可以使用`className`屬性來指定給React中的元件或DOM元素，直接用就可以了，你不需要另外學什麼特別的語法。

不過，像Bootstrap中有很多動態的效果，都是使用jQuery函式庫為基礎來製作的，它在某些情況也會處理網面上的真實DOM元素，這會與React中的虛擬DOM作法相衝突，建議如果要使用的話，不要使用Bootstrap裡面的這些有JavaScript的元件。

大部份知名的CSS框架都已經有對應的專為React開發所調整過的函式庫，以長期的開發考量來說，你應該用這些專為React設計的框架或函式庫，下面有提供一個列表。

#### 直接使用CSS(或像SASS的預處理器)

你可以用自己撰寫CSS或SASS，然後套用到React之中，Webpack可以搭配使用[css-loader](https://github.com/webpack/css-loader)、[style-loader](https://github.com/webpack/style-loader)或是[sass-loader](https://github.com/jtangelder/sass-loader)，讓這些CSS(或SASS)定義檔案，在開發時用import語句匯入到JavaScript程式碼檔案之中使用。

當你在使用create-react-app建立一個新的React專案時，你可能已經發現到裡面預設的範例專案，就有使用這種作法，在其他的樣版文件中都已經幫你作完複雜的設定，所以你也可以照著這樣用。下面是預設的範例的程式碼:

#### 使用為React開發的UI框架

這有很多選擇，現在有很多專案都是在開發專門給React使用的整套UI框架，例如:

- [Material-UI](http://www.material-ui.com/#/)
- [React-Bootstrap](https://github.com/react-bootstrap/react-bootstrap)
- [ant-design](https://github.com/ant-design/ant-design)
- [react-toolbox](https://github.com/react-toolbox/react-toolbox/)
- [mui](https://github.com/muicss/mui)
- [grommet](https://github.com/grommet/grommet)

使用這些UI框架自然有一些好處，應用程式的整體樣式的設計會一致，而且它們多半都已經設計好很多React相關的UI元件，直接使用就可以了。要說缺點的話，大概就是會被框架或函式庫綁住，因為每套框架設計的方式並不相同，如果要用到其它沒提供的元件你要自己想辦法把樣式套上。

#### CSS Modules

[CSS Module](https://github.com/css-modules/css-modules)是一個很常被使用的CSS處理技術概念，它可以藉由很多工具來實現，首先它會把原本的CSS定義轉化為更具彈性與可程式化的[Interoperable CSS](https://github.com/css-modules/icss)(可交互操作的CSS, ICSS)，這是一種基於CSS的超集合，原本的CSS檔案(如果是引用外部檔案的方式)，可以在裡面進行更多的定義，例如定義類別合成、全域或本地的作用域等等，這些檔案也可以進行模組化、以及把類別轉換為JavaScript的變數。

CSS Module使用Webpack加上`css-loader`就可以使用，大部份React的樣版文件，都已經設定與安裝好它。針對React元件還有專門為它打造的[React CSS Modules](https://github.com/gajus/react-css-modules#webpack-css-loader)，如果有需要可以再安裝，提供更多彈性的運用。

不過，CSS Module算是一個為了`CSS in JavaScript`產生問題的解決方案，它可能對初學者來說有點複雜，使用方式還需要再學習。

#### 使用內嵌樣式(inline style)

React社群中已經發展出許多專門使用內嵌樣式的輔助函式庫，例如最有名的是[Radium](https://github.com/FormidableLabs/radium)，它大概已經把內嵌樣式發展到一個極致，是一個完全內嵌樣式的解決方案。

---

> 那麼對你來說是要選擇哪一種？

基本上，上面是以每種解決方案來區分，但並沒有說限定你一定只能用其中一種，你也可以混用不同種的方式。以真實的開發情況來說，我們會把用到CSS或樣式的情況區分為以下三個種情況:

1. 版面(Layout) - 在應用中的每個元件的排版位置，或是RWD(響應式網頁設計)等等。
2. 外觀(Appearance) - 元件或DOM元素看起來的樣子
3. 狀態或行為的變化(state & Behavior) - 元件或DOM元素因使用者操作或狀態改變時，造成的樣式變化。

這裡面最沒有爭議的是第3種，因為它與React元件中的程式碼的邏輯關係很密切，所以一般就直接用在React中的內嵌樣式來解決最直覺。

第1種情況，你可以直接使用現成的許多版面的CSS解決方案，例如Bootstrap或有更簡單的，它們都可以運作得很好，只要你在元件外用個`<div>`框住，而且只用它們排版的部份，大部份都是可以正常運作。當然，如果你希望是使用有一致性的，多樣化的與動態的元件，你可以用以這些框架為基礎，專門為React打造的延伸框架。

第2種情況，這要視你的應用與團隊而決定，因為整個應用程式的元件外觀應該要有一致性，或許專門為它寫一個獨立的CSS是一種方式，或是全部採用內嵌樣式的作法。當然，在不使用現有框架中的特效元件的情況下，只套用外觀樣式的部份，也是可以的。例如Bootstrap就有提供[線上自訂服務](http://getbootstrap.com/customize/)，選擇你只要使用的某些功能。

> 註: 以上的說明參考這篇[stackoverflow問答](http://stackoverflow.com/questions/26882177/react-js-inline-style-best-practices)中的回答。

## 參考資料

- 影片: [Inline Styles are About to Kill CSS](https://www.youtube.com/watch?v=NoaxsCi13yQ)
- 影片: [Inline Styles: themes, media queries, contexts, & when it's best to use CSS](https://www.youtube.com/watch?v=ERB1TJBn32c)
- [State of React and CSS](https://voice.kadira.io/state-of-react-and-css-501d179443d3#.ft7rk2lie)
- [React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js)
