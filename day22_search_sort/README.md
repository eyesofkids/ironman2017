# React篇 - TodoApp程式 + 搜尋/過濾 + 排序

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day22_search_sort/asset/intro.png)

今天的主題是要加入搜尋、過濾與排序功能。這三個功能各有其重點，整個一起加進來會讓程式變得開始複雜，下面的解說就要仔細看了。

這個程式最後的呈現結果，就像下面的動態圖片這樣:

![TodoApp樣式元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day22_search_sort/asset/day22_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day22_search_sort/)，所有的程式碼也在裡面。

在解說之前，我要先聲明，目前這個範例中使用的寫法，可能不一定是最好的，也有可能有些功能沒考慮得太細，它還只是個範例而已。以我個人的想法，因為總是想要儘量保持state結構的單純，只有在真的非得把狀態放在state中，才能得到正常渲染結果的情況下，才會把某個狀態值放在裡面。但這個想法或許這不一定是最好的作法，它有可能不夠直覺，用state來控制所有應用程式的狀態，是理所當然的方式，但state的控制是有較為花費資源的，而且一定要注意setState方法，它在執行時的特性是異步的，詳細的說明請看我之前寫的一篇部落格: [為何說setState方法是異步的](http://eddychang.me/blog/javascript/98-why-setstate-is-async.html)。總而言之，你要用state絕對是很自然直覺的，但它不一定總是如你所願，所以你需要更理解它。

## 過濾功能程式碼說明

過濾功能是本次增加的功能中最簡單的一個，我們要加的過濾功能是切換是否要顯示已經勾選為已完成的項目。

過濾功能的勾選盒(checkbox)是加在`TodoList`元件之中，然後執行時一樣呼叫的是`App`裡的方法，這方式從很早的章節就說明過了，如果你有仔細看過應該覺得很容易。下面是TodoList中新增的這個勾選盒:

```js
<label>
   <input
         type="checkbox"
         defaultChecked
         onClick={onItemFilter}
   />
   包含已完成的項目
</label>
```

這邊的程式寫到一個簡單到不行，預設是勾選的，也就是顯示全部包含已完成的項目。點按時(onClock)去觸發對應的在App元件中的方法，名稱是`handleItemFilter`，程式碼如下:

```js
//處理切換過濾是否要顯示已完成項目
handleItemFilter = () => {

   //isFilteringOut是在這個模組的作用域變數
   isFilteringOut = !isFilteringOut

   const newItems = [...this.state.items]

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
}
```

你可能對`isFilteringOut`這個變數感到有疑問，它並不是放在`state`中的其中一個屬性，它是寫在模組作用域裡的一個變數，是個布林值，預設為`false`，用來切換。這個`handleItemFilter`完全只作兩件事，一個是把`isFilteringOut`的布林值切換，另一個是作重新渲染。

問題來了，這個`newItems`不是完全從原來的`this.state.items`拷貝得來的一個陣列，這邊作重新渲染，不就一模一樣等於不會渲染是吧？所以關鍵還在下面這個地方，也就是在`App`元件的`render`方法裡，在`TodoItem`要出現的那段程式碼，改成像下面這樣:

```js
{
  this.state.items.map((item, index) => {
      if(isFilteringOut && item.isCompleted){
        return null
      }
      return  (
        (item.isEditing)
        ? <TodoEditForm
            key={item.id}
            title={item.title}
            onItemUpdate={(title) => { this.handleEditItemUpdate(index, title) }}
          />
        : <TodoItem
            key={item.id}
            isCompleted={item.isCompleted}
            title={item.title}
            onItemDoubleClick={() => { this.handleEditItem(index) }}
            onItemClick={() => { this.handleStylingItem(index) }}
          />
      )
    }
  )
}
```

這段程式碼與上一章的差異在於TodoItem要被使用的前面先擋了一個語句，像下面這樣:

```js
if(isFilteringOut && item.isCompleted){
  return null
}
```

這句就是當如果目前全域的`isFilteringOut`是`true`時，而且`item.isCompleted`也是`true`時，就會不回傳任何物件。

你可以想像本來在列表上有幾個項目被你勾選成"已完成"狀態，這些項目的`isCompleted`會被指定成`true`滿足了這個if語句中的後面那個條件，當這個過濾用的勾選盒被勾選時，前面的那個條件也滿足了，所以假設你能觸發重新渲染，這個render方法將會重新被呼叫一次，就進行過濾的工作，原理就是這麼簡單。

這個用法並沒有去更動到state的結構，只是讓一個能觸發事件的DOM元件，進行一次重新渲染。React的確足夠聰明，知道這個情況時，如果有其他的作用域變化會造成子層(內層)元件不同時，就會作真實DOM的改變。

以上是過濾的部份，它也是最簡單的一個新增功能。

---

## 搜尋功能程式碼說明

搜尋功能對於這次的範例來說，是比較複雜的一個，它是一個文字輸入框，不斷輸入字詞後，然後在列表中只呈現有包含搜尋字詞的項目而已，我們新增了一個`TodoSearchForm`元件來作這件事。

在陣列中搜尋某個包含目前輸入字串的整個函式並不困難，現在ES6中的許多好用的陣列方法，直接一句程式碼就解決了，像下面這樣:

```js
const newItems  = oldItems.filter((item) => (
    item.title.includes(searchword)
))
```

這裡用的是`filter`這個陣列方法，回傳的新陣列中`newItems`，只會包含其中標題(item.title)有搜尋關鍵字(searchword)的成員。這語句實在夠簡單了，沒什麼好再說明的。

來看難的部份有二個部份，都很重要的一些概念，第一個是`state`(狀態)的改變，我們對`state`進行搜尋，然後呼叫`setState`方法指定新的陣列值給它，它再改變目前網頁上的真實元素，這個方式依然是沒變的。

那問題來了，如果現在假設搜尋字詞是`買`找到了10個項目，繼續搜尋字詞你如果刪除掉後面兩個字詞，變成`買東西`，可能只剩3個項目，但你應該再刪除搜尋字詞成為`買`時，還是要變回找到10個項目，這很合理吧？但單靠state是作不到的。

`state`只會記住目前的狀態，然後與即將要改變的新狀態作比較，看什麼地方需要更動，作最合理的更動方式。

所以你一旦給`state`新的狀態值，之前的與之前之前的，都會直接不見，React中並沒有一個機制，可以讓你對`state`作所謂的"時光旅行"，還可以找回最初的那個一開始搜尋的`state`。

所以要怎麼作？最簡單的方式就是用這個模組作用域中的一個變數值，在一開始搜尋時，就先把當下的`state`中的項目值(items)先記起來，我把它命名為`keepSearchedItems`，而且我還加了另一個作用域中的變數，名稱為`isSearching`，是個布林值預設值為`false`，這個變數是代表目前是不是正在搜尋中。

有了這個概念就可以作搜尋，只是有一些情況你要注意，例如何時要把指定`keepSearchedItems`等等，大致上有幾個要注意的地方:

- 一開始`isSearching`為`false`時，代表剛觸發進來這個方法中準備要搜尋，指定`this.state.items`指定給`keepSearchedItems`
- 在搜尋期間(`isSearching`為`true`時)，搜尋都在`keepSearchedItems`裡搜尋，重新渲染還是用`setState`方法
- 當還在搜尋期間(`isSearching`為`true`時)，發現搜尋字詞是空字串時，代表要結束搜尋，用`setState`方法把`state`中的`items`用`keepSearchedItems`回復

大致上就這樣，不過有可能我沒考慮清楚的地方，你可以再提供給我意見，或是再自己試試。程式碼可能沒寫得很簡潔，但應該還算容易看得懂，程式碼如下:

```js
//處理搜尋所有項目的方法
handleItemSearch = (searchword: string) => {

  // 一開始先拷貝目前在state中的items到陣列中，保存所有的items
  // 並設定isSearching為true，表示正準備搜尋
  if(!isSearching) {
    isSearching = true
    keepSearchedItems = [...this.state.items]    
  }

  // 當還在搜尋(isSearching為true)時，如果searchword是空字串，代表使用者已經把文字框清空了
  // 準備回復原先的列表資料情況，並設定(isSearching為false)
  if(isSearching && searchword === '') {
    isSearching = false

    this.setState({
      items: keepSearchedItems,
    })

  } else {
    //過濾(搜尋)一律從原本的items資料中搜尋，也就是keepSearchedItems中的值
    const newItems  = keepSearchedItems.filter((item) => (
        item.title.includes(searchword)
    ))

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }
}
```

第二個困難的地方，也是我覺得這次增加功能中最不容易理解的部份，就是關於"中文字詞"的搜尋。我想這個問題並不是只有在React中會這樣，有可能在其他的函式庫會遇到。

在之前的範例中，應該是TextInput這個一開始的範例裡，你如果有用了Chrome瀏覽器中的React Developer Tools工具，來觀察其中的值的變化。因為我們在文字輸入框中用了`onChange`事件，你可能會發現一件事，就是在作中文輸入時，`onChange`事件會非常的"敏感"，例如你用注音輸入法輸入"我"這個字，在鍵盤上輸入的實際上是"ji3"還有"Enter"這幾鍵，`onChange`事件會補捉到所有的鍵盤輸入，但最後輸入完成時是"我"這個字詞沒錯，但可以看到那個輸入的過程。

這與我們的搜尋功能會有關係，假設你現在項目中有"學java"、"買iphone"、"叫媽媽帶我去選水果"這三個，如果在`onChange`如此敏感的情況下，當你用注音輸入法輸入"我"的時候，前面兩個項目會在輸入過程中就開始被搜尋(過濾)出來，要等輸入完成後才會變為最後一個項目呈現。這樣你應該理解這是什麼狀況了，這絕對是個不太正確的功能。

在React中要使用`onChange`方法，而且需要輸入中文(當然日文、韓文大概也是吧)的情況，不管你是要用注音、無蝦米、大易…輸入法，都是同樣的情況，唯一的解決方案是要用`onComposition`的三個事件來輔助，什麼是`onComposition`？白話文就是你正在輸入中文，這個事件會在你正在輸入中文字詞被觸發，這三個事件分別為`onCompositionStart`、`onCompositionUpdate`與`onCompositionEnd`，看後面尾端的名稱，大概就知道它們會在何時被觸發，在剛開始時就第一個`Start`、還在輸入的期間如果有打鍵盤就是`Update`，最後輸出結束，把中文字打到像文字框上面，就是`End`。

那要怎麼用這三個事件輔助onChanges？就是當開始作中文輸入時，一觸發`onCompositionStart`後，就把`onChange`的的執行先擋住，一直等到出現`onCompositionEnd`後，再把`onChange`的執行打開，`onChange`你不用擔心它，它只有輸入什麼一定必觸發，差異只是要執行什麼。基本的原理就是這樣。

方式就像下面這樣的範例，用一個`isOnComposition`的布林值，來作`onChange`裡是不是該執行其中的搜尋的開關，只有當`e.type === 'compositionend'`出現時，這個開關才會打開，讓`onChange`裡的搜尋功能起作用:

```js
const TodoSearchForm = ({ placeholderText, onItemSearch }: TodoSearchFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  //一個用於記錄composition狀態用的
  let isOnComposition: boolean = false

  const handleComposition  = (e: KeyboardEvent) => {   
   if(e.type === 'compositionend'){

      //composition結束，代表中文輸入完成
      isOnComposition = false

    } else {
      //composition進行中，代表正在輸入中文
      isOnComposition = true
    }

  }

  return (
    <div>
      <input
        className="form-control"
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        onChange={(e: KeyboardEvent) => {
            //只有onComposition===false，才作onChange
            if (e.target instanceof HTMLInputElement && !isOnComposition) {  
               //進行搜尋            
              onItemSearch(titleField.value)
            }
        }
       }
      />
    </div>
  )
}
```

這方法看起來很不錯，應該可以解決中文輸入的問題，但實情是它最近因為Chrome瀏覽器的改版(v53)後，又變得不能用，而且妙得是只有在Chrome瀏覽器上不能用。

原因是因為Chrome v53中的把compositionend與change事件的觸發順序作了一些調整，不過這可能並不能說對或不對，是長期以來的方式，現在可能他們認為是個bug而修正。對比其他的瀏覽器，目前只有Chrome v53與之後的版本是這樣，例如用注音輸入"我"這個字，下面是Chrome與Firefox的事件觸發順序:

```
Chrome v55

onComposition:  compositionstart
onComposition:  compositionupdate
onChange: change
onComposition:  compositionupdate
onChange: change
onComposition:  compositionupdate
onChange: change
onComposition:  compositionupdate
onChange: change
onComposition:  compositionend


Firefox v50

onComposition:  compositionstart  
onComposition:  compositionupdate  
onChange: change  
onComposition:  compositionupdate  
onChange: change  
onComposition:  compositionupdate  
onChange: change  
onComposition:  compositionend  
onChange: change
```

你可以看到Chrome的最後是用`compositionend`，而像Firefox、Safari的最後是觸發`change`，在目前能夠作的修改，讓這功能正常運作，就是在`compositionend`觸發時作你要的(搜尋)，但`compositionend`只會在"中文輸入"這種情況下觸發，也就是說單用鍵盤輸入數字或英文，是不會觸發`compositionend`的，所以`change`還是有其存有的必要性。

所以上面的程式碼我又作了一些修改，加上偵測是不是Chrome瀏覽器的語法，如果是Chrome的話，就在觸發`compositionend`時，執行一次你要的工作(搜尋)。

```js
const TodoSearchForm = ({ placeholderText, onItemSearch }: TodoSearchFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  //一個用於記錄composition狀態用的
  let isOnComposition: boolean = false

  //檢查是否為chrome瀏覽器
  //http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  const isChrome = !!window.chrome && !!window.chrome.webstore

  const handleComposition  = (e: KeyboardEvent) => {
   if(e.type === 'compositionend'){

      //composition結束，代表中文輸入完成
      isOnComposition = false

      //修正Chrome v53之後的事件觸發順序問題
      //
      if (e.target instanceof HTMLInputElement && !isOnComposition && isChrome) {  
         //進行搜尋         
         onItemSearch(titleField.value)
      }

    } else {
      //composition進行中，代表正在輸入中文
      isOnComposition = true
    }

  }

  return (
    <div>
      <input
        className="form-control"
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        onChange={(e: KeyboardEvent) => {
            //只有onComposition===false，才作onChange
            if (e.target instanceof HTMLInputElement && !isOnComposition) {  
               //進行搜尋            
              onItemSearch(titleField.value)
            }
        }
       }
      />
    </div>
  )
}
```

> 註: 偵測瀏覽器的方式來自stackoverflow的[這裡](http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser)。實際上有很多不同的方式，這個是比較簡單的，但有可能之後新版的瀏覽器不一定100%偵測的出來。

> 註: Google Chrome v53的這個修改部份，可以參考[這裡的內容](https://chromium.googlesource.com/chromium/src/+/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/)。

> 註: React的Github庫上很早就有人[發這個議題](https://github.com/facebook/react/issues/3926)，上面的解決方案目前是…就像我(eyesofkids)回答的這樣，如果你有其他的問題或意見，可以在這個議題上面討論。

其他的有關於搜尋的部份就沒什麼太多需要說明的，主要是這上面兩個部份比較困難。

---

## 排序功能程式碼說明

排序是一個沒辦法用像過濾一樣用模組作用域的一個變數處理的功能。有幾個原因，因為它有三個狀態，一個是一開始的狀態，是一個"無排序"的狀態，因為還沒有輸入項目，所以也無從排序起，當然你也可以一開始就用筆劃從少到多排，或從多到少排，可是這樣你在加入新項目時，就不會像之前的加入項目的功能一樣，加到項目列表的最上面一個。

經過我測試過，除了上面的設計需求外，另外發覺排序算是一個會更動到整個列表與排序按鈕兩個元件的地方，而且在某些其他的事件觸發時，排序必需要回復原先的"無排序"狀態，例如搜尋、增加新的項目時，這當然會使得排序功能會變得在整合時複雜些。目前的設計是這樣，所以造成目前排序的控制值只能在state中來控管，或許你可以想想有沒有更好的方式。

你可以看到我在`state`中新增了一個`sortType`屬性，作為排序之用，這裡用了Flow工具的列舉類型，它是三種字串值的其中一個，初始值是空子串，也就是"無排序"。程式碼如下:

```js
state: {
  items: Array<Item>,
  sortType: '' | 'asc' | 'desc'
}

//建構式
constructor() {
  super()

  this.state = {
    items: [],
    sortType: ''
  }
}
```

排序的方法是在`App`元件中的`handleItemSort`，給定排序的方式(三種字串值其一)，對應'asc'或'desc'的都是用陣列的sort方法來排序，如果是空字串，就不會排序，最後進行重新渲染。程式碼如下:

```js
//處理排序所有項目的方法
  handleItemSort = (sortType: string) => {

      let oldItems = [...this.state.items]

      if(sortType === 'asc') {
        //按筆劃從少到多排序
        newItems = newItems.sort((a, b) => (    
            a.title.localeCompare(b.title, 'zh-Hans-TW-u-co-stroke')
          )
        )
      }

      if(sortType === 'desc') {
        //按筆劃從多到少排序
        newItems = newItems.sort((a, b) => (
            b.title.localeCompare(a.title, 'zh-Hans-TW-u-co-stroke')
          )
        )
      }

      this.setState({
            items: newItems,
            sortType
        })
  }
```

`state`中的`items`值實際上會因為排序產生變化，例如說你先輸入了10個項目，然後排序，再輸入其他的5個項目，再排序…這之後其實再也回不到你最早之前的狀態值。我也沒用其它的模組作用域的變數來記住，也就是沒用像上面的搜尋的作法一樣。在經過多次的排序、新增項目、排序的反覆操作後，`state`再也不是一開始的那個`state`，原本就會如此。

問題是，你覺得經過多次排序過後，那個最先一開始的"無排序"的`state`中的`items`應該是按什麼排序的？

正確的解答是 - "項目加入的時間" 對吧，最晚加入的排在最上面？其實我在這裡老早留了一手，你如果有從前幾章的改造範例裡，我把項目的`id`值是用什麼改造的？加入的時間的微秒值，雖然當時我只是把它作為`key`值使用，但其實它就是可以作為按照"項目加入時間"然後用來排序的值，這樣就可以真正回復一開始無排序的狀態，對吧？

不過，按項目加入時間排序可能目前在這個範例中排序後，再加入多個項目後又排序，其實沒太大意思，因為我們這個範例只有用到標題來排序，要不要按標題的筆劃來排序這樣而已。除非你再加新的功能裡來，可以依照加入時間來排序，這個id值自然就可以用，不過它可能要考慮多個值不同排序的情況。多欄位的排序，或許使用表格(Table)元素來呈現列表資料會更適合，這會複雜些，就留給你自己實作了。

剩下的程式碼部份，就是在TodoList元件裡面的那個按鈕，這個按鈕會因為傳入的`sortType`是空字串時，而改變其中的文字。而且這個按鈕會在沒有任何項目時用`React.Children.count(children) === 0`就相當於沒有任何子項目，這個時候會變成不能點按的，也就是`disabled=true`，這個設計很合理吧，沒有項目是要排什麼序。程式碼如下:

```js
const TodoList = ({children, onItemFilter, onItemSort, sortType}: TodoListProps) => {

  //找出索引值，共有三種值，要對應顯示字串用的
  let sortTypeIndex: number = ['', 'asc', 'desc'].findIndex((value) => value === sortType )

  return (
    <div>
      <button
        className={(sortTypeIndex === 0)? 'btn btn-default': 'btn btn-success'}
        onClick={() => { onItemSort((sortType === 'asc')? 'desc': 'asc') }}
        disabled={(React.Children.count(children))? false: true}
      >
        按筆劃排序: {['沒有','少 -> 多','多 -> 少'][sortTypeIndex]}
      </button>
    <ul className="list-group">{children}</ul>
    </div>
    )
}
```

最後一部份就是在搜尋或加入新項目時，先觸發無排序的情況:

```js
//觸發排序回復不排序
this.handleItemSort('')
```

以上就是有關於排序的程式碼部份。

---

## 結論

這個應用程式一次加入了三個新功能，分別是過濾、搜尋與排序。對於我們的範例程式來說，新增項目或許比較重要，但有些應用程式實際上在搜尋與排序反而是重點，例如網路上的一些資料庫類型的網站服務，像是遊戲攻略的資料庫、角色卡片的資料庫、客戶資料的資料庫等等。新增資料可能只由管理者新增，或是直接匯入用現有的資料而已。所以這些功能相信是在很多應用上都可以用到的，這個應用程式一次加入這些功能，相信都是很基本的功能，但這也讓你可以學習到這些功能的寫法。

另一個可以學習到的，是有關於`state`的真正設計與使用的情況。`state`在我們的應用中，它是一個應用程式領域的狀態，除了存放目前應用程式的資料外，也需要存放一些整體應用程式的設定值或控制值，但它是一個高花費的而且有特殊使用情況的值，在某些情況下，我們可以直接用模組作用域中的變數來取代它，但在某些情況下，你非得使用`state`值，或是用`state`值會比較容易完成功能。該如何取捨其實是看你自己，我是建議你可以先用`state`值先完成功能後，再重新檢視是不是能不要用它。

`state`值與最後的資料儲存，我指的是像這裡的待辦事項的資料，如果存在資料庫裡的話，是怎麼樣的一個樣子，有很大的關係，但這兩者並不一定會是完全一樣。`state`與其週邊的方法，會比較像是一個與資料庫之間的介面，用於在這個應用中處理這些資料，並考慮要如何呈現出來，資料庫則是最後儲放資料的場所。下一章，我們將會講到元件的生命週期，以及它如何與網站伺服器溝通。
