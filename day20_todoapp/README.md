# React篇: TodoList程式改造 => TodoApp

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day20_todoapp/asset/intro.png)

今天是鐵人賽的第20天，漫長的一個月旅程已經走完了3分之2，2017年只剩10多天就要到來。今天的主題是要來改造一下從前面一路學來的TodoList。為了專注於應用的整體改進，主要功能並沒有加入太大的改變，但內部的整個架構都與之前的不太相同。

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day20_todoapp/)，所有的程式碼也在裡面。

為什麼需要改造原本的TodoList應用？

你可以從之前的這個應用中看到一些分離得不好，或是有些語法不清的地方，我舉幾點說明:

- 在TodoList中的state中除了保存目前所有的待辦項目外，還用來作輸入的暫存值使用，感覺這是一物兩用分隔不清
- TodoList以名稱來看，應該是個列表元件，它裡面的文字輸入框的作用，應該是新增待辦項目用的，分出來一個叫作TodoAddForm的元件會比較清楚
- TodoItem目前是用陣列索引值作為key值，上回有說過它是個反樣式，應該用別的具有唯一性的值當key值
- Flow標記可以檢查props(屬性)的類型與結構，而React的PropTypes也作同樣的事

我們之後可能會加入的一些功能如下，要開始預先思考這個應用中應該要怎麼作會比較容易擴充:

- 待辦項目中加入更多屬性: 例如加入重要性、分類、何時開始等等的屬性
- 套用更多的樣式: 所以應該所有的樣式都要集中到一個style.js或App.css之中，這樣會方便管理
- 對所有待辦項目的搜尋或過濾(切換已完成/未完成的項目): 這兩個功能應該也是獨立成元件會方便維護
- 對所有待辦項目的排序: 這會與整個列表的顯示有關
- 對某筆待辦項目的編輯與刪除: 可以再重覆編輯已新增的項目，以及真正從列表中刪除掉
- 動畫特效: 這與樣式也有關
- AJAX/Fetch: 用於與遠端的伺服器互通來儲存資料，所以資料的格式與要何時儲存資料應該要規劃好

從上面的因應未來需求以及目前發現的問題，開始著手來改造，當然，也有再加入一些新的知識，提供改造的方向。以下是我們接著要作的:

1. 分離出一個`TodoAddForm`元件，並且改使用函式型元件的寫法
2. 由第1項，去除掉state中使用於文字輸出入框作暫存資料存放的情況
3. 分離出一個`TodoList`元件，將state(狀態)提升到App.js之中，作為應用程式領域的整個狀態
4. 分離出一個`style.js`，用於儲放所有會用到的內嵌樣式
5. 新增一個`App.css`，用於儲放元件外觀會使用的到整體樣式
6. 新增一個`TodoTypeDefinition.js`，用於集中所有會使用到的props與item的靜態類型(Flow)結構。而且，既然已經有了Flow的靜態類型標記，React的PropTypes檢查就可以不用加了，都是作同樣檢查的事情，Flow的靜態類型檢查比React的PropTypes檢查更深入而且更有效。

我還是要再次的說明，你現在看到的這最後程式碼，並不是"一次到位"的結果，它是經過一段時間中反覆的測試與修修改改。在寫這篇文章之時，程式碼早就已經寫好了，自然有些太細節的部份沒辦法一一說明，而且它不一定是最完美的作法。所以，你應該對你所開發的應用程式，也是要這樣子親自動手下去實作，不斷的反覆修改與測試，不斷的改進裡面的語法或是調整為更好的、更容易擴充與維護的結構。實際動手作遠比用眼睛或用嘴巴學程式來得重要，如果你聽到有人和你說: "React這東西這麼簡單，看一看就會了！"，那麼我可以打包票說這個人一定不會，因為"看一看"絕對是學不會的。

## 程式碼說明

一開始我們先把檔案的結構整理一下，目前在src中只有一個components目錄，現在多了兩個，所以在src中會有三個目錄:

- components: 放所有元件的程式檔案，有`App.js`, `TodoList.js`, `TodoItem.js`, `TodoAddForm.js`
- definitions: 會有一個`TodoTypeDefinition.js`，用於集中所有用到的靜態類型定義
- style: 目前有`styles.js`，集中所有用到的內嵌樣式。另外之後會有一個`App.css`，是在這個應用中所有的元件外觀CSS檔案

再來看獨立出來的`TodoAddForm`元件，它只有一個文字輸入框，我把它改寫為無狀態的元件，也就是用函式語法來寫元件，你可以直接看原始程式碼檔案，以下是分段的解說。

一開始看到的是改用定義檔來作這個元件的props的檢查。這個檔案原先的React中的PropTypes檢查用的宣告就不需要了。像下面這樣:

```js
//匯入Props靜態類型的定義
import type { TodoAddFormProps } from '../definitions/TodoTypeDefinition.js'
```

對應到定義檔`TodoTypeDefinition.js`中的類型，這個`onItemAdd`函式我把它更佳明確的定義出來，是個函式類型，傳入值是個Item類型(定義檔的上面有)，回傳是沒有回傳值，從這裡可以看到這Flow靜態類型可以定義到多細，愈細的預先類型定義，可以在寫程式時更加明確，減少錯誤發生。像下面的類型定義:

```js
export type TodoAddFormProps = {
  placeholderText: string,
  onItemAdd: (x: Item) => void,
}
```

因為用了定義檔中的`TodoAddFormProps`類型，所以在函式中的傳入參數就用這個類型來作預先定義，而且為了方便起見，改用了解構賦值的語法，原先的initText這個名稱語意義清楚，改用placeholderText取代掉。像下面這樣:

```js
const TodoAddForm = ({ placeholderText, onItemAdd }: TodoAddFormProps) => {}
```

在`<input />`標記中的程式碼，是這次改造的重點核心，它的目的是要把原本使用在state中的暫時性資料，改用原本網頁上的DOM處理方式。要作這件事，你需要對refs屬性要有一定的理解，本章的下面有附詳細說明。這裡的程式碼用了refs屬性，它可以獲取到這個input元素，渲染到網頁上的實體，所以可以直接取到實體裡面的value屬性的值，利用這個值來作`onItemAdd`方法，id是一個新的item中的屬性，它是用來指key值用的，另外id值也改用在加入當下得到的時間微秒值，或許有更好的方式但目前就先這樣作吧。下面為程式碼:

```js
<input
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onKeyPress={(e) => {
          if (titleField.value.trim()
              && e.target instanceof HTMLInputElement
              && e.key === 'Enter') {  

            //加入到items陣列中(state)         
            onItemAdd({
              id: +new Date(),
              title: titleField.value,
              isCompleted: false,
            })

            //清空文字輸入框
            titleField.value = ''
          }
        }
      }
      />
```

TodoItem元件沒有什麼太大的變化，它與TodoAddForm的寫法都是類似的，就儘量寫得愈簡單愈好。唯一比較大的不同，是它取消了index這個props(屬性)中的值，因為在它的上層元件指定給它(TodoItem)的props值時，直接使用一個箭頭函式在裡面加上索引值就可以正確定義出要作變化的方法，至於這樣作會不會影響效能，我覺得應該是沒影響，實際上可以這樣作就是。TodoItem元件如下面的程式碼:

```js
const TodoItem = ({ title, style, onItemClick }: TodoItemProps) => (
   <li
      onClick={() => {
        onItemClick()
      }}
      style={style}
      >
      {title}
    </li>
)
```

TodoList元件中的之前的程式碼，都移往`App.js`中，它會變成一個單純的外層式元件，也會是一個無狀態元件，程式碼如下:

```js
const TodoList = ({children}: TodoListProps) => (
   <ul>{children}</ul>
)
```

這邊唯一要注意的是`TodoListProps`的類型定義，定義檔`TodoTypeDefinition.js`中的類型定義如下，這是一個對React元素類型的特別定義語法，children因為也有可能不存在，所以有加問號(?)代表可選的屬性，更多資訊可參考這裡的[討論說明](https://github.com/facebook/flow/issues/1355)。程式碼如下:

```js
export type TodoListProps = {
  children?: React$Element<*>,
}
```

App元件正式成為這個應用的最主要元件，它裡面的`state`是這支應用程式領域的狀態，`state`的結構也變得更為單純，像下面這樣:

```js
state: {
    items: Array<Item>,
  }

//...

this.state = {
    items: [],
  }
```

Item的類型定義一樣在定義檔`TodoTypeDefinition.js`中，它是像下面這樣的物件結構:

```js
export type Item = {
  id: number,
  title: string,
  isCompleted: boolean,
}
```

其他的方法都是複製自之前的`TodoList.js`中，就不再多說。在render中的結構也變得更為清楚。在JSX語法中使用TodoItem元件指定屬性時，key值改為用item物件的id值來指定，style的部份也用獨立的一個styles物件來指定，另外也少了index值，可以在onItemClick指定時，用箭頭函式來定義要刪除掉哪一個索引值即可:

```js
render() {
    return (
      <div>
        <TodoAddForm placeholderText="開始輸入一些文字吧" onItemAdd={this.handleItemAdd} />
        <TodoList>
        {
          this.state.items.map((item, index) => (
              <TodoItem
                key={item.id}
                style={item.isCompleted? styles.itemCompleted: styles.itemNormal}
                title={item.title}
                onItemClick={()=>{ this.handleStylingItem(index) }}
              />
            )
          )
        }
        </TodoList>
      </div>
  )
}
```

所有的程式碼都放在Github中，從之前的TodoList程式到現在的TodoApp，改寫大概花了一個小時，但寫文章卻花了快一天的時間。很多細節與概念都附在下面的說明中，如果有看不懂的地方再發問，或是先看一下下面的說明，再回頭看程式碼也可以。

---

## 其他的詳細說明

### 在JSX中的子元素(Children in JSX)

在本章之前，我們一直沒看到在自己寫的的元件上，使用另一種種類的語法，不過在"JSX語法指引"的文章中，你應該有看到官方文件的另一種分類，稱之為`Children in JSX`，它對應的就是像HTML中DOM元素的像下面這種寫法，也就是用開頭的標記，加上結尾的標記，中間夾著其他元素或字串值:

```
<div>Hello!</div>
<ul>
  <li><a href="http://www.google.com">Google<a></li>
  <li><a href="http://www.facebook.com">Facebook<a></li>
</ul>

```

在React中，它設計了props(屬性)在React Element(元素)中是可以存在有 父母-子女(parent-children) 的關係，這個設計與真實網頁上的DOM元素的樹狀結構類似，所以當父母(parent)節點想要存取它的子女們(children)節點時，React中提供了`this.props.children`屬性可以使用，它是一個內建就有的屬性。

但是，React會認為`this.props.children`屬性是一個含糊不清(opaque)的資料結構，為什麼呢？因為它有可能有幾種回傳情況:

- 子節點不存在，資料為"undefined"：例如`<Component />`或`<Component></Component>`
- 只有單一個子節點，資料為"單一物件/元件"：例如`<Component><span></span></Component>`或`<Component><ChildComponent></ChildComponent><Component>`
- 有多個子節點，資料為"陣列(物件/元件)"：例如`<Component><span></span><ChildComponent></ChildComponent></Component>`
- 資料為"字串"：例如`<Component>我是字串</Component>`

React中在[React.Children](https://facebook.github.io/react/docs/react-api.html#react.children)裡有幾個方法來協助你處理`this.props.children`的資料，其中`map`與`forEach`和陣列的方法有點相像:

- React.Children.map：迭代(iterate)資料並呼叫你提供的回調(回呼)函式，回傳陣列或undefined
- React.Children.forEach：迭代(iterate)資料並呼叫你提供的回調(回呼)函式，和map類似不會回傳陣列
- React.Children.count：回傳>=0的個數
- React.Children.only：回傳一個子元件，只能用於單個子元件的情況
- React.Children.toArray：回傳為陣列型態

一個經常會被使用的樣式是迭代(iterate)所有的子節點，拷貝出新的子節點後加上新的props值:

```js
const newChildren = React.Children.map(this.props.children, function(child) {
  return React.cloneElement(child, { foo: true })
})
```

看到這裡，你可能又會有些疑問，`this.props.children`是用來作什麼的？

基本上，它是一個因為React元件(或元素)產生階層結構後，所設計出來對應真實DOM元素的東西。在這個樹狀階層的結構中，位於上層(外層)的元件它可以對位於下層(內層)的元件，作一些特別的事情，因為在下層(內層)的元件，它實際上算是上層(外層)元件的props(屬性)的其中一個。

舉一個最簡單的例子就像下面這樣:

```js
const Child = (props) => <li>{props.text}</li>
const Parent = (props) => <ul>{props.children}</ul>

ReactDOM.render(
  <Parent>
      <Child text="One" />
      <Child text="Two" />
  </Parent>
  , document.getElementById('root'))
```

當你把Parent元件中的`{props.children}`這個拿掉時，像下面這樣的程式碼，不論Child元件裡面有什麼，都不會顯示出來:

```js
const Parent = (props) => <ul></ul>
```

所以說，在上層(外層)的這種把下層(內層)元件夾在裡面的這種元件，它可以對下層(內層)元件作一些調整與修改，而且它也獲取得到下層(內層)元件中的所有props值，這是一個很特別的設計。下面的程式碼是對下層(內層)元件裡的props值作修改的一個範例:

```js
const Parent = (props) => (
  <ul>
    {
      React.Children.map(props.children, (child) => <li>{child.props.text + ' is Good!'}</li>)
    }
  </ul>
)
```

利用這個`this.props.children`的設計就是目前在社群上，主要用來開發React元件的一種常見作法，尤其是用來"增強"現有元件的那些，例如改變元件的外觀，幫元件自動加上某些功能之類的。上面也說了一個用了`cloneElement`這個方法的樣式，它更可以幫原本的下層(內層)元件附加上額外的props或style值。最新的還有一種稱為"F-as-child"的語法，我在之前的JSX語法指引文章中有提到，它是另一個界於目前灰色地帶的樣式語法(也就是有一些爭議性)，但它給開發者更多的彈性空間，內容會太細節就不再多說，有興趣可看這篇[Function as Child Components](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9#.j7apfv22y)文章。

### refs屬性

> 使用前注意事項: 不論如何，這個refs屬性是一個有爭議的主題。要使用它時，請真心確定你知道正在作什麼，而且不要使用過度。另一個風險是，refs屬性的存取方法已經過多次的修正，而且未來也有可能再被改，官網的[Refs to Components](http://reactjs.cn/react/docs/more-about-refs.html)與[Refs and the DOM](https://facebook.github.io/react/docs/refs-and-the-dom.html)文件可以提供更多資料。

`refs`是一個在元件中非常特別的屬性，`ref`是`references`的簡稱，也就是代表它是一個"參照"，參照到什麼？React元素/元件真正的渲染到真實DOM上面的實體。以[React Element](https://gist.github.com/sebmarkbage/fcb1b6ab493b0c77d589#formal-type-definitions)的結構定義來看，它是一個React元素/元件中的另一個與props、key在同一階層的屬性，並不屬於`props`的一員。

`refs`會被設計出來的目的，主要是讓React元素/元件，在一些仍然非得要存取到真實DOM元素實體的情況下使用，換句話說說，這個設計是一種非必要時候的手段的"緊急逃生出口(escape hatch)"，聰明如你已經想得到到，`refs`實際上與React元件的抽象結構或虛擬DOM的核心設計是相違背的。既然是"緊急逃生出口"的設計，就是只會用到非得不行的情況，大致上來說，會用在兩個情況下:

1. 與現有的程式碼或函式庫的整合: 有些現有的程式碼或函式庫，例如用Google地圖的API要整合來寫應用，在這API裡有非得要存取到DOM元素的場合，當然我這裡指的是放上[Google Maps API
](https://developers.google.com/maps/)上的這個API。

2. 在特定的某些元素上，為了簡化資料流或資料呈現: 在我們本章的最上面用了這個`refs`屬性，目的是為了簡化資料流，這會經常用於與使用者互動的UI表單元素之中，有些資料例如文字輸入、選項勾選，只是一種臨時性的資料，用`refs`屬性的作用是直接從真實DOM元素實體來抓取資料。這麼簡單的事情，透過state與setState的整個設計來作，的確是有點"殺雞用牛刀"的感覺，這些臨時性的資料，與整個應用程式執行期間的資料一起儲放在同一個地方，也是一種很有問題的設計。

但是，網路上一直有反對的聲音，認為這個`refs`屬性並不是所謂的"緊急逃生出口"，而是一個大開方便之門的屬性。主要是因為有些初學者一開始就會在React元件中使用`refs`，造成了一些誤解，以為原來在React中都是這樣作的。實際上React官方在不久前才改版的舊版官網上，一開始的入門教學範例中，就用了這個屬性來存取網頁上的表單元件的輸入值，當然它的目的是要說明這個`refs`屬性可以作為與現有程式的一個暫時性的整合解決方案。當然後來引發了一些批評，現在新版的入門教學中已經不是用這個方式。

當有些人有提出批評的建議，再加上有可能會造成React中與使用`refs`程式碼影響到效能的問題，與`refs`相關的一些方法，在最近幾個版本的React會看到經常被更動，有些在網路上的教學文章，有可能雖然才不到1年前發佈，但實際上裡面用的一些方法都在最近的React版本被棄用或根本就移除了，這是在使用時一定要特別注意的地方。

在元件/元素中的屬性以單數名詞`ref`來指定值，但在取用與處理時是用複數名詞`refs`，這也是個要注意的地方。而且在程式碼撰寫期間並無法確定它會是什麼類型的值，也只能假設它可能會有值，這是個很特別的使用概念。主要是因為整個React應用需要經過`ReactDOM.render()`呼叫在真實的DOM元素渲染後，才會真正出現`refs`的可用值，所以你會看到官方在說明上，說它這是一種元素/元件的"背後支持的實體"(backing instance)。

#### 無狀態(stateless)元件中使用refs屬性

按照之前的官方文件說明，無狀態(stateless)元件(函式語法的元件)的`refs`一律都是`null`，也就是說如果你要使用它，必須是在一個有狀態(state)的元件才能使用。但是，這個規則後來被打破了，要不然你今天也不會看到我們在上面的函式型元件範例裡用了這個`refs`，先講為何無狀態(stateless)元件(函式語法的元件)是無法有`refs`，因為它並沒有生命週期的相關方法可用，由React管控的元件/元素，在渲染到真實DOM元素上的過程，是有生命週期的，從掛載(mount)到呈現，到在應用使用過程中的更新(或重新渲染)，到最後的卸載(unmount)，有整套的生命週期，`refs`是一個需要在元件/元素真的是已經出現在網頁上時，才會有可用值的一個屬性。無狀態(stateless)元件用不了生命週期的相關方法，自然也判斷不出來現在這元件/元素是有沒有真的出現在真實DOM上，也沒辦法在生命週期的相關方法(例如像"目前此元件已經掛載完成"的這種方法)中存取到它。

所以現在無狀態(stateless)元件是怎麼存取得到`refs`？看起來上面說的這設計是很合理，而且現在的無狀態(stateless)元件一樣也是沒這些生命週期的相關方法可用不是嗎？你可能會有這些疑問。

按照現在官網上的[說明](http://reactjs.cn/react/docs/more-about-refs.html#summary)， 以下簡單摘譯最後一段:

> Refs可能沒有依附(attached)到無狀態(stateless)函式上，因為元件沒有背後支持的實體(backing instance)。你可以總是用包裝一個無狀態(stateless)元件在一個標準合成元件上，然後依附一個ref到標準合成元件上。

上面說的的"標準合成元件"，就是在我們程式碼中使用的ES6類別語法撰寫的元件。從這一句簡單的說明中，其實可以發現祕訣就在於`refs`的確在無狀態元件中是沒有的、是抓不到的，但用了它這個無狀態元件的上層元件，如果是個標準的ES6類別元件，它就可以獲取得到這個無狀態元件的`refs`可用值。這句說明用的是"依附(attached)"，而不是直接獲取，也就是說，只要你的無狀態元件，它在React應用中整個元件的階層裡，是作為一個子元件的角色，當在上一層使用它的元件(擁有者元件)，是一個有狀態的ES6類別元件，它就可以用"依附"的方式，間接地得到自己的`refs`可用值。你可能問會說這個值是怎麼"間接地"得到的？其實與之前的上層元件傳遞資料到下層元件一樣的方式，用props傳到這個無狀態元件中。在React的Github中的[這一篇Issue](https://github.com/facebook/react/issues/4936)，裡面有些程式碼與範例是在討論這個議題。以目前的React v15版本來說，這個依附的`refs`值，它會自動傳遞到作為子元件的無狀態元件之中，所以它並不是由這個無狀態元件直接得來的，這樣作仍然沒有破壞到無狀態元件的純粹性。

> 註: 在無狀態元件中使用refs屬性並沒有破壞它的純粹性，仍然是個純粹函式。

`refs`這個屬性有時候會被用在一些動畫特效的函式庫之中，尤其用來整合現成的函式庫的那些。不過這種作法並不是個好方式，只是利用`refs`開了直接存取真實DOM元素的大門，如果要這樣作，那說實在直接用jQuery會比較理想，因為這也不是按照React元件設計的方式。很糟糕的另一件事，這些函式庫表面上雖然看起來，並沒有要求你在自己的元件裡指定`ref`值，但實際上它在函式庫裡會用複製元素的`React.cloneElement`方法來幫你的元件產生`ref`指定值(而且通常是用`key`值作為`ref`指定值)。

總結來說，`refs`是一個在非不得已使用的屬性，因為它直接存取到網頁上的真實DOM元素，超出React應用所能掌控的範圍。你當然還是有使用它的權利，不過的確需要在使用它之前，至少理解它是什麼與能作什麼，還有就是如何正確地使用它。建議你只使用`refs`作為獲取某些值的時候使用就好，而且不要在`refs`得到的實體上呼叫任何的方法，不然有可能會造成程式效能或其他濳在問題。

#### refs屬性如何使用

在目前的v15版本的文件中有說明"不建議"以字串值作為元件`ref`的指定值的方式，而是要改用callbacks(回調、回呼)指定值的方式，現在ESLint的eslint-plugin-react外掛已經有這個檢查規則，下面的程式碼範例是來自[no-string-refs](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md)規則，這規則是建議你不要用字串值指定給`ref`。雖然現在還有很多的程式碼範例，都使用這種字串指定值的方式，基本上的用法就是在render方法中的元素指定`ref`值，然後用`this.refs`來取用它。

如果你指定的是`ref="myRefString"`，取用時建議使用`this.refs['myRefString']`。獲取到`ref`的值後，會指定到另一個this中的屬性，通常是是在`componentDidMount`方法中可以使用獲取的`refs`值。以下為範例:

```js
var Hello = React.createClass({
  componentDidMount: function() {
    var component = this.refs["hello"]
    // ...do something with component
  },
  render: function() {
    return <div ref="hello">Hello, world.</div>
  }
})
```

使用字串值作為ref指定值的語法，在未來有可能被棄用，現在的作法都是要更改為回調函式。建議的方式如下:

```js
var Hello = React.createClass({
  componentDidMount: function() {
    var component = this.hello
    // ...do something with component
  },
  render() {
    return <div ref={(ref) => { this.hello = ref }}>Hello, world.</div>
  }
})
```

如果指定為字串值的方式被棄用後，代表之後再也不能用像`this.refs[xxx]`這種使用的方式。

#### ReactDOM.findDOMNode方法

在最近的版本中，`getDOMNode`方法已經棄用，v15版本中是完全不能使用`getDOMNode`方法。`findDOMNode`是`getDOMNode`的取代方法，它的用途是傳入一個元件值，尋找真實的DOM元素節點。在v0.14版本時，`ref`已經可以直接存取到它的參照值，所以也根本用不著這個方法，官方的文件也有說明要避免使用這個`findDOMNode`方法。

在ESLint的eslint-plugin-react也有規則[no-find-dom-node](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md)，為何要加上這個規則有一些[額外的資訊](https://github.com/yannickcr/eslint-plugin-react/issues/678#issue-165177220)可以參考。下面範例來自規則中的說明，下面是會出現警告的程式碼:

```js
class MyComponent extends Component {
  componentDidMount() {
    findDOMNode(this).scrollIntoView();
  }
  render() {
    return <div />
  }
}
```

要改為下面的程式碼:

```js
class MyComponent extends Component {
  componentDidMount() {
    this.node.scrollIntoView();
  }
  render() {
    return <div ref={node => this.node = node} />
  }
}
```

總之這個`findDOMNode`方法目前雖然可以用，但感覺上就是大概是準備棄用或改掉的氣氛，現在是因為還有很多的範例有使用到它所以保留而已。

---

## 結論

在本章中，我曾說過應用程式領域的狀態，它是一個重要的議題。每支應用程式都應該有一個獨立於所的元件的狀態或是儲存資料的地方，以及集中所有更動這個資料的地方，這在常見的MVC設計模式中，是屬於Model(模型)的部份。但不論是MVC或其他的設計模式，其目的都是為了要清楚分離應用中的每個組成分子的獨立功能，讓程式碼或元件都可以重覆利用、容易擴充，另一方面是能妥善組織與管理整體的資料流、交互作用等等關係。在較完善的架構之下，應用程式才有辦法規模化，對未來的應用的維護或最佳化，也會更佳容易。當然，這說的都是大型的應用程式所應該具備的條件，對於小型的應用，或是簡單的範例應用，實際上根本不需要也不應該這樣作，花了時間架構出來但實際上用不著。

問題是，你如何學習React中較為完善的應用架構？

這是一個雞生蛋蛋生雞的問題，沒深入學過React的各種特性，實際寫過真正的應用，你又怎麼比較得出來這個架構是比較好的，那個是比較差的？在本章的例子是一個很小型的應用，或許用不著這麼講究。React是個用來開發網站上的應用的新想法，這些教學的主要目的是要讓你重新思考一些事情，一些你可能從來在JavaScript開發應用時的事情。舉個例子來說，你應該開始思考把整個應用程式的功能與操作介面元件化，讓它們獨立出一個個的功能元件，或是把整個應用的狀態集中到一個狀態中來管理，多多寫出純粹函式，而對有副作用的程式加以管控。

架構一個完善的應用程式結構，是一門學問。而且它需要進一步對你的應用程式更加理解與思考，像是未來要如何擴充功能，哪些地方目前並沒作作得太好之類的。這是一個需要不斷改善、學習與調整的工作。這個的例子中能作的改造部份很有限，也不一定是完全的作法，但這大概是現在我所能作的改造成果。或許，你可以有更多好的想法，找出更好的架構方式也說不定。
