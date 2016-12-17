# React篇: TodoList程式

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day17_todolist/asset/intro.png)

"本文章附有影片"。這個程式最後的呈現結果，會是在網頁上出現一個文字輸入框，當你輸入文字後按下Enter鍵，就會把文字加到下面的列表中，每個項目用滑鼠點按一下，會觸發這個項目的刪除事件。就像下面的動態圖片這樣:

![TextInput元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day17_todolist/asset/day17_demo.gif)

> 註: 本文章附有影片，影片網址在[Youtube的這個網址](https://youtu.be/PtGcztIDVOE)。本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day17_todolist/)，所有的程式碼也在裡面。

> 註: 這支程式只是很小型的一個TodoList應用，與一些教學或框架中的TodoMVC之類的功能完全不能比，不過我們會慢慢從這個應用中再延伸來學習。

我們在這個範例程式中，要使用四個程式碼檔案，其中二個index.js與App.js與之前的幾乎是一樣的，就不再多說這兩個檔案。

先看TodoItem這個元件，它比上次的TextShow元件多了二個props(屬性)，新增的屬性分別是props.index與props.onItemClick，這兩個的屬性的作用分別是:

- index: 因為列表中的項目是陣列中的資料，這個是代表這個項目的索引值
- onItemClick: 是一個上層父母元件(擁有者元件)中的方法定義，按了它等於呼叫上層元件中的方法

> components/TodoItem.js

```js
//@flow
import React from 'react'

const TodoItem = (props: {text: string, index: number, onItemClick: Function}) => {

  const handleClick = () => {
        //實際上呼叫的是由上層元件從props.onItemClick傳入的方法(上層元件的方法)
        props.onItemClick(props.index)
  }

  return <li onClick={handleClick}>{props.text}</li>
}

//加入props的資料類型驗証
TodoItem.propTypes = {
  text: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
  onItemClick: React.PropTypes.func,
}

//匯出TodoItem模組
export default TodoItem
```

在這個程式中，`onItemClick`是一個關鍵性的角色。之前已經有提過，props的值除了像原始資料類型的數字、字串、布林外，也可以是物件、陣列或函式。`onItemClick`是一個函式類型的值，它是在上層元件(擁有者元件)中設定給它的。在TodoItem中，每個項目在`onClick`事件觸發時，並不是呼叫自己元件中(擁有者元件)的方法，而是去呼叫到上層元件中定義的方法。我們在這個程式中，這個方法就是要從列表中移除掉這個被點按的項目，注意下面這個`handleClick`中的程式碼，第一次看到可能會有點轉不過來:

```js
const handleClick = () => {
      //實際上呼叫的是由上層元件從props.onItemClick傳入的方法(上層元件的方法)
      props.onItemClick(props.index)
}
```

接著是TodoList元件的程式碼，它是包含了所有應用程式中的控制核心。它的基本結構與上一章的TextInput元件很類似，一樣我們分幾個部份來看。

TodoList元件上面的類別的部份，都是固定的寫法，唯一與TextInput元件不同的，是在`state`中的物件資料結構，用了一個items來存放列表中的每筆待辦事項的文字資料，它會是一個字串類型值的陣列，用Flow工具的標記可以很清楚的預先定義出來。陣列資料在多筆資料的情況下很常使用，這也是為何之前會在純粹函式中加入一些陣列處理的純粹函式改寫語法，因為陣列的運算處理很常使用到。

```js
//@flow
import React from 'react'
import TodoItem from './TodoItem'

// 預先定義props的結構
type Props = {
  initText: string,
}

class TodoList extends React.Component {
    // 預先定義state的結構
    state: {
      items: Array<string>,
      inputValue: string,
    }
    //建構式
    constructor(props: Props) {
        //super是呼叫上層父類別的建構式
        super(props)

        //設定初始的狀態。注意！這裡有個反樣式。
        this.state = {
            items: [],
            inputValue:'',
        }
    }

    //還有更多程式碼...
}
```

在對文字輸入框的處理方法，一共會有兩個，以下為程式碼:

```js
//處理的方法，用e.target可以獲取到輸入框的值，用箭頭函式可以綁定`this`
//輸入文字時
handleChange = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    this.setState({
      inputValue: e.target.value,
    })
  }
}

//按下Enter時
handleKeyPress = (e: KeyboardEvent) => {
  if(e.key === 'Enter' && e.target instanceof HTMLInputElement){
      const newItems = [e.target.value, ...this.state.items ]

      //按下enter後，加到列表項目中並清空輸入框
      this.setState({
        items: newItems,
        inputValue: '',
      })
  }
}
```

第一個是`handleChange`是處理輸入框在不斷輸入文字時用的，它與之前的TextInput元件是一樣的語法。

第二個是輸入框被按下Enter鍵時要處理的方法，我們要判斷是按下Enter鍵而不是其它的鍵，可以用獲取到的[KeyboardEvent物件](https://facebook.github.io/react/docs/events.html#keyboard-events)的`key`屬性。然後要作兩個事，第一件事是把新的項目加到陣列中，也就是把新的項目(字串值)，加到陣列中的第一個成員，其它的成員往後排。本來這個是陣列中的[unshift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)方法，但JavaScript陣列中內建的unshift方法是個有副作用的方法，所以要改用純粹函式的寫法，這個語法是很簡單的，原先在state中的陣列先用展開運算符(...)展開，然後與新項目組合為一個新的陣列，像下面這樣:

```js
const newItems = [e.target.value, ...this.state.items ]
```

最後把這個新的陣列`newItems`替換掉原本的state中的items屬性值即可。

```js
this.setState({
  items: newItems,
})
```

因為我們為了方便，在按下Enter鍵時，也要把文字輸入框中的文字清空，所以也要設定state中的inputValue值為空字串，所以用下面的語法:

```js
this.setState({
  inputValue: '',
})
```

上面兩個合併在一起使用，就寫成下面這樣就可以了:

```js
this.setState({
  items: newItems,
  inputValue: '',
})
```

> 註: 你也可以使用KeyboardEvent物件的keyCode屬性，對應Enter鍵是13(數字類型)。雖然[MDN上的文件](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)說它是非標準的屬性。

> 註: 實際上setState這個方法它在執行時進行效率的最佳化，可以合併在一起的語法它會進行合併。這只是它的內部設計部份，稍微說明一下而已。

第三個方法是`handleRemoveItem`，它並不是給這個元件中的DOM元素使用的，而是給包含在其中的子項目元件(TodoItem元件)使用的。這個方法會被當作是props屬性的其中一個，用標記中的`onItemClick`屬性指定給子項目元件(TodoItem元件)。程式碼如下:

```js
//處理移除掉其中一個陣列中成員的方法
handleRemoveItem = (index: number) => {
  const oldItems = this.state.items

  //從陣列中移除一個index的成員的純粹函式
  const newItems = oldItems.slice(0,index).concat(oldItems.slice(index+1))

  //整個陣列重新更新
  this.setState({
    items: newItems,
  })
}
```

因為我們要刪除掉陣列中的其中一個成員，最簡單的方式就是用這個項目目前在陣列中的索引值，所以要寫成一個方法，傳入參數用索引值即可。

這個刪除其中一個成員的純粹函式語法，實際上是使用陣列的[slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)方法，它是用來分割陣列為子陣列用的，語法看起來很簡潔有點一下子難以看懂，這裡稍微說明一下，把原先的陣列`oldItems`，分割為從索引值0開始到這個要刪除的成員的索引值之前，用的是這語句`oldItems.slice(0,index)`。再從這個成員索引值，到陣列最後，分割出另一個子陣列，用的是這語句`oldItems.slice(index+1)`，然後再把這兩個陣列用[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)方法連接起來，成為一個新陣列。

最後，仍然要呼叫`setState`方法，讓整個DOM元素重新渲染更新，用下面的程式碼:

```js
this.setState({
  items: newItems,
})
```

在TodoList元件的最後部份，也就是render方法。相較於之前的TextInput元件，在文字輸入框的地方，多了一個`onKeyPress`的事件，它是用來獲取按下鍵盤的事件用的。而在下面的`<ul>...</ul>`之中，加入了一個使用陣列的map方法，把所有目前的在state中的items項目，整個輸出的運算語句。

```js
//渲染方法，回傳React Element(元素)
render() {
    return (
          <div>
            <input type="text"
              value={this.state.inputValue}
              placeholder={this.props.initText}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleChange}
            />
            <ul>
            {
              this.state.items.map((value, index) => {
                return <TodoItem key={index} text={value} index={index} onItemClick={this.handleRemoveItem}/>
              })
            }
            </ul>
           </div>
    )
}
```

在JSX語法中的花括號({})中，可以加入JavaScript的表達式，或是函式等等。之後會有另一章詳細的來說明JSX中的一些語法。

下面這行語句的運算，是把state中的items陣列，用TodoItem元件的格式來作最後的輸出，這裡有我們需要的index、text、onItemClick三個props(屬性)值。但多了一個key值，key是用於像這種列表項目，或是有多個同樣的元件在React中渲染時使用的，它並不是props的成員，而是讓React用於識別不同的元件(或DOM元素)使用的。React會要求像這種列表項目時，開發者一定要給key值。下面有詳細的說明。

```js
this.state.items.map((value, index) => {
  return <TodoItem key={index} text={value} index={index} onItemClick={this.handleRemoveItem}/>
})
```

整個程式碼的說明大致上就是這樣。這支程式的重點在於，要對子元件作資料上的變動，或是觸發事件後更動它的props(屬性)，仍然需要遵守在React嚴格的強硬規則:

> 元件無法改變自己的props(屬性)，只有它的擁有者物件可以

這支程式實際上就展示在這個規則下，如何使用一種"迂迴"的方式，讓子元件可以進行自己屬性的更動(或自我毀滅)。當在子元件中觸發某個事件時，實際上它只是遞出訊息告訴父母元件說: `嘿，老爸，我想要改變一下我自己的某個屬性`或是`嘿，老板，麻煩你fire我吧！`，然後由上層的擁有者元件中的方法，來作這個子元件的props(屬性)的更動，最後當然一定要有的，就是實體DOM元素的重新渲染。

重新渲染的機制之前有說過了，當你用了React後，不管是現在是要更動1個項目還是100個，如何更動網頁上的真實DOM元素都不關你的事，反正就是叫React去想辦法，它自然會用最有效率的方式來作網頁上的真實DOM元件的重新渲染與呈現。

> 註: 陣列的處理方法，請看之前的"ES6篇: Side Effects(副作用)與Pure Functions(純粹函式)"章節，或是[電子書的陣列](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part3/array.html)這一章。常用的你可以先理解一下，看懂裡面的用法，之後有需要再查對照表就行了，其實就那幾種語法而已，實際上不會很困難。

> 註: 程式碼都是一直不斷改進語法，才會像你現在看到的這樣，哪有可能一寫就寫得這麼好。除非已經是很熟練的工程師，才有辦法一寫就寫出看起來漂亮簡潔又沒bugs的程式碼，對初學者來說，只求一開始先能達到所需的功能，再不斷的改進與調整裡面的語法就好。

---

## 其他的詳細說明

### key屬性

講到子節點，就不得不說明一下`key`這個React Element(元素)中的屬性之一。`key`是一個可選的，具唯一性的識別子，當你的一個元件使用動態來生成具有同樣結構的子元素節點時，不論這些子元素是其他的元件還是HTML中的DOM元素，React都要求你要提供`key`的屬性值，以此來區分不同的子元素，當然每個子元素的`key`值不能相同，也就是說它在元件結構裡是唯一的。

> 特別注意: `key`是個字串類型的值。它並不是`props`其中的一員，你可以參考這裡的[React Element](https://gist.github.com/sebmarkbage/fcb1b6ab493b0c77d589#formal-type-definitions)的結構定義。

```js
const ListItem = (props) => (
    <li>{props.text}</li>
)

const names = ['鮎川天理', '汐宮栞', '中川加儂', '小阪千尋']

//最後用來輸出到實體DOM的方法
ReactDOM.render(
    <ul>
    {
      /* 用map方法回傳陣列 */
      names.map(function (value, index, array) {
        return <ListItem text={value}/>
      })
    }
    </ul>, document.getElementById('root')
  )
```

會出誢以下的警告訊息(註: 只是警告，不會中斷程式):

```
Warning: Each child in an array or iterator should have a unique "key" prop. Check the top-level render call using <ul>. See https://fb.me/react-warning-keys for more information.
```

把key屬性加上，就可以避免這個警告訊息，如果是陣列值的話，使用索引值剛好可以用來當不能重覆的key屬性，改寫過的map方法如下:

```js
{
  names.map(function (value, index, array){
    return <ListItem key={index} text={value}/>
  })
}
```

> 特別注意: `key`值應該是在進行render時直接給定就行了，而不是在定義元件的時候給定，也就是說它是動態定義的。

`key`值對React進行重新渲染非常重要，React會用`key`來決定子元素是同一個還是不同的，所以所有的子元素都一定要有`key`值，即便你只有一個子元素。因此，雖然在我們的這個例子裡，是直接使用陣列的索引值當`key`值，實際上這是一個反樣式(anti-pattern)。在真實的應用中，`key`值最好是使用能產生唯一值的其它方式。最簡單是用一個全域的變數值，來作為`key`值的累加，也會看到用獲取當下時間轉換為微秒值，或是使用像[shortid](https://www.npmjs.com/package/shortid)的函式庫。可以參考官網這篇[Lists and Keys](https://facebook.github.io/react/docs/lists-and-keys.html)文章，與這篇[Index as a key is an anti-pattern](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318#.lly6p2vm9)文章中的說明。

> 特別注意: `key`值使用"陣列索引值"會是個反樣式，你應該採用別的隨機而且唯一值的產生方式。

## 影片

[![Day17](http://img.youtube.com/vi/PtGcztIDVOE/0.jpg)](https://www.youtube.com/watch?v=PtGcztIDVOE)

## 結論

本章展示了一個簡單範例的它是由子元件中觸發事件，來更動子元件自己的props或刪除資料的樣式。可能一開始學習時會有點不太習慣，畢竟這概念很新要適應一下，用久了就大概知道React中能作的模式就是很固定的。

不過，state(狀態)這個設計有一些問題，你可能已經看到了，因為state只能限制在某個元件之中使用，所以我們在一開始學習的簡單範例中，都會交由其中一個在上層的元件來控管整個應用的資料部份。這如果在小型應用中還可以這樣用，如果在有很多元件的應用中，用單一個state來控管所有的資料，會變得難以管理而且複雜。所以像Redux的函式庫，它們就是要來協助管理應用程式領域的資料，不過這是之後的另一篇主題了。
