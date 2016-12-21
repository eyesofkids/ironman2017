# React篇 - TodoApp程式 + 編輯項目

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day21_todoapp_edit/asset/intro.png)

今天的主題是要加入項目的編輯功能，以及更多的CSS樣式。至於重點部份有兩個，第一個是CSS樣式的加入，第二個是如何切換項目的編輯。

這個程式最後的呈現結果，會是在網頁上出現一個文字輸入框，當你輸入文字後按下Enter鍵，就會把文字加到下面的列表中，在項目中改用勾選盒來更改狀態，用滑鼠左鍵雙點按(DoubleClick)可以進行項目的再編輯。就像下面的動態圖片這樣:

![TodoApp樣式元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day21_todoapp_edit/asset/day21_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day21_todoapp_edit/)，所有的程式碼也在裡面。

當程式愈來愈複雜的時候，實作經驗會愈來愈重要，學到了很多基礎知識雖然重要，但更重要的是實作經驗，以及解決問題的能力。有時候，一個小問題就有可能困住很久才能解決，這個範例程式愈來愈複雜，代表它裡面用到的功能愈來愈多，你可能要仔細地看，因為很多部份都是彼此關聯的，牽一髮而動全身。

## 編輯項目功能程式碼說明

首先，因為我們要能讓TodoItem可以在被新增後，還能進行重新的編輯，而且位置就在那個TodoItem上，這種功能要怎麼作？

過去使用jQuery或直接用JavaScript來寫，就是查詢到要編輯的那個DOM元素實體，然後在該節點替換成可輸入的文字輸入框，很直覺地作法，但現在這支程式並不是這樣作的，雖然也有替換的過程，但它有幾個關鍵步驟，建議你看過之後思考一下。

現在用在React上也是類似的，不過因為使用的是元件的概念，所以你需要用下面的步驟來思考:

1. 使用者觸發要重新編輯某個事件 - 看是要用按鈕點按還是其它的事件，這個範例中是用滑鼠左鍵雙點按(DoubleClick)
2. 觸發重新渲染(re-render) - React裡面只有`state`(狀態)改變，用了`setState`方法才會觸發重新渲染，所以上面觸發的事件一定是要改變到state值
3. 編輯後儲存再重新渲染 - 觸發儲存新的輸入值，再觸發重新渲染，回復原先的項目狀態

整個流程就是這樣。直接看程式碼會比較快。

首先我們新增了一個叫`TodoEditForm`的新元件，它就是在雙點按(DoubleClick)某個項目時，要用來編輯這個項目上的標題文字用的。它有點像是`TodoItem`與`TodoAddForm`元件的組合。這也是個無狀態的元件，也就是用函式的語法來寫的元件。

函式的傳入參數類型如下，我們只需要要進行編輯的標題值，以及一個用於更新最後新的值的函式即可，這個`onItemUpdate`函式，依然是來自上層元件(App)的指定值:

```js
export type TodoEditFormProps = {
  title: string,
  onItemUpdate: (x: string) => void,
}
```

在`TodoEditForm`元件中的回傳值部份，對文字輸入框用了兩個事件，一個是`onBlur`，另一個是`onKeyPress`，而且一開始就有一個`autoFocus`的屬性，之前已經有說過了JSX在指定props屬性時，不指定任何值時相當於預設值true，下面是這個文字輸入框的程式碼:

```js
<input
  type="text"
  defaultValue={title}
  ref={el => { titleField = el }}
  autoFocus
  onBlur={(e) => {
    if (titleField.value.trim()
        && e.target instanceof HTMLInputElement) {  

      //更新某個索引值的標題    
      onItemUpdate(titleField.value)
    }
    }
  }
  onKeyPress={(e) => {
    if (titleField.value.trim()
        && e.target instanceof HTMLInputElement
        && e.key === 'Enter') {  

      //更新某個索引值的標題    
      onItemUpdate(titleField.value)
    }
    }
  }
/>
```

這裡面還有一個要注意的地方，就是`defaultValue`這個屬性，這屬性是React中人造的這種HTML的DOM元素才有的，它是用來指定給像這種文字輸入框值用的，等會還會看到另一個類似的屬性。你不能直接使用`value`這個屬性，除非你有提供`onChange`方法在這個元素上，不然React會把這個表單輸入元件當作是只能讀不能寫的，這是使用表單元素在這種無狀態函式中的一個要特別注意的地方。

你如果把這個`defaultValue`改為`value`，會出現下面的警告:

```
warning.js:36 Warning: Failed form propType: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`. Check the render method of `TodoEditForm`.
```

你可能會好奇，為何在更新某一筆項目資料時，不需要知道這筆資料的索引值？`onItemUpdate`只有一個傳入參數，就是被改過的新字串而已。

因為就像之前在點按某個項目，然後改變這個項目的樣式的作法一樣，它在上層元件指定這個函式值的時候，就已經把索引值固定住了。下面是在`App`元件中的`TodoEditForm`元件的使用程式碼，有看到`handleEditItemUpdate`其實需要兩個傳入參數，只是其中一個先給它了，後面那個`title`再由`TodoEditForm`中觸發事件時再給:

```js
<TodoEditForm
  key={item.id}
  title={item.title}
  onItemUpdate={(title) => { this.handleEditItemUpdate(index, title) }}
/>
```

好的，接著來看`App`元件的程式碼變化，當然最主要的是像之前項目中的`isCompleted`屬性，這次也新增了一個`isEditing`，用於分辦哪一個項目正在進行編輯中，也是個布林值。所以新的Item類型的定義會像下面這樣:

```js
export type Item = {
  id: number,
  title: string,
  isCompleted: boolean,
  isEditing: boolean,
}
```

雖然`isEditing`有點像是個臨時才會用到的值，但這是因為整個運作流程，一定需要改變到`state`值(用`setState`方法)，才能觸發重新渲染，這個機制你一定要記住，如果功能得要觸發重渲染，也就是畫面上要更動到DOM元素，只有這條路可走。

`App`元件新增了兩個新的方法，一個是`handleEditItem`，這是讓目前的`TodoItem`被雙點按後，將被點按的那個項目的`isEditing`屬性，從`false`變為`true`的一個方法。這個方法幾乎與之前的`handleStylingItem`一樣，程式碼如下:

```js
//處理其中一個陣列中成員變為編輯中的方法
handleEditItem = (index: number) => {
  //拷貝一個新陣列
  const newItems = [...this.state.items]

  //切換isEditing的布林值
  newItems[index].isEditing = !newItems[index].isEditing

  //整個陣列重新更新
  this.setState({
    items: newItems,
  })
}
```

另一個方法是要給`TodoEditForm`編輯完成後儲存變動後的標題文字值用的，叫作`handleEditItemUpdate`，它需要兩個傳入參數，一個是要變動的項目的索引值，另一個是要變成哪一個文字值，程式碼如下:

```js
//處理其中一個陣列中成員編輯完後更新的方法
handleEditItemUpdate = (index: number, title: string) => {
  //拷貝一個新陣列
  const newItems = [...this.state.items]

  //切換isEditing的布林值
  newItems[index].title = title

  //切換isEditing的布林值
  newItems[index].isEditing = !newItems[index].isEditing

  //整個陣列重新更新
  this.setState({
    items: newItems,
  })
}
```

這兩個方法的程式碼都很簡單，沒什麼特別要說的，儲存完記得把`isEditing`改回`false`值就行了。

再來是因為Item的物件結構變了，所以原先的TodoAddForm也要變動一下，其一是在新增項目時，要多一個`isEditing`值。其二是需要加上一個雙點按的事件。但還有一個最好要改的，因為原來我們是利用點按一下項目來變動項目的樣式，現在又有一個雙點按的事件，這兩個會影響到，所以把原先的點按事件，改用在一個勾選盒(checkbox)上。程式碼如下:

```js
const TodoItem = ({ title, isCompleted, onItemClick, onItemDoubleClick }: TodoItemProps) => (
   <li
    onDoubleClick={onItemDoubleClick}
      className={isCompleted
        ? 'list-group-item list-group-item-danger animated fadeIn'
        : 'list-group-item list-group-item-success animated bounce'
      }
      >
      <input
        type="checkbox"
        defaultChecked={isCompleted}
        onClick={onItemClick}
        />
        {' '}
        {title}
    </li>
)
```

這裡的`defaultChecked`情況與上面說的`defaultValue`類似，這也是React中的人造元素才有的屬性，相當於DOM元素上的`checked`，但這裡沒用到`onChange`事件，所以要改為`defaultChecked`。

> 註: 程式碼中的className是套用了css樣式檔，等會再說明。

最後的關鍵在於`App`的`render`方法中的回傳值部份，在`TodoList`標記之間的JSX表達式中，這裡本來是輸出`TodoItem`元件的地方，但在這裡需要更動程式碼，如果項目中的`isEditing`是`true`值時，就改為使用`TodoEditForm`元件，如果是`false`才會用`TodoItem`元件。為了更簡化語法，用了三元運算符(?:)來取代`if...else`，程式碼如下:

```js
<TodoList>
{
  this.state.items.map((item, index) => (
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
  )
}
</TodoList>
```

這邊的在props(屬性)指定值的三個方法，全部都先給定index值(項目在陣列中的索引值)，寫法會有些特別要注意一下。

以上是有關於加入編輯項目文字框的說明。

## 樣式化程式碼說明

你應該有看到，我加入了一些樣式在程式碼之中，目的讓原本看起來醜醜的`TodoApp`美觀些。

這都是只使用CSS定義的部份而已，主要是用了[Bootstrap](http://getbootstrap.com/)與[Animate.css](https://daneden.github.io/animate.css/)。也有一些動畫的特效，不過都是純粹的CSS動畫而已。

Bootstrap的檔案是另外到它提供的[線上自訂服務](http://getbootstrap.com/customize/)，去除掉與JavaScript有關的元件與Glyphicons。

要套用現成的CSS在React應用中，之前有說過如果Webpack有設定好，直接匯入到程式碼中就可以使用，你可以看到App.js的最上面有這幾句:

```js
//匯入css檔
import '../style/bootstrap.css'
import '../style/animate.css'
```

這是在create-react-app所建立的專案中已經幫你都設定好了，而且只要最上層的App.js有匯入，裡面有用到的元件檔案就不需要再作匯入的動作，這一點我已經有試過，最後打包會自動幫你把所有的CSS檔合併壓縮，而且會產生Source Map(原始碼地圖)，實在有夠方便。

這些樣式都是使用CSS類別名稱來指定就可以了，例如TodoList元件中的`ul`標記，你可以看到像這樣套上CSS類別的樣式:

```
<ul className="list-group">{children}</ul>
```

所有的標記與元件我都加上了CSS的類別定義，在TodoItem元件中額外用了Animate的特效，它這裡面的特效是純粹的CSS特效，所以可以使用，不過檔案有點大，如果確定好要用什麼特效，應該只需要用到的部份就行了，Animate.css也有[自訂編譯](https://github.com/daneden/animate.css#custom-builds)的方式。

所以你在網路上看到什麼好看的CSS樣式範例，直接拿來套用就行了，主要記得要把原來範例中的`<div class="xxxx">`改為React中的`<div className="xxxx">`。如果有JavaScript相關的特效記得不能用要先拿掉。

## 結論

本章的目的是提供不同的思考方式，如果你已經是熟悉JavaScript或jQuery的開發者，這個功能絕對是難不倒你的。但換到React上來思考，就不是那樣的直覺式的查詢DOM，替換DOM元素節點的作法，你如果親自動手作看看，應該能體會其中的差異。這一個思考方向的不同，我認為在寫React應用時是很重要。

另一個重點是在於展示如何使用CSS樣式於React應用中，以單純的CSS類別套用來說，並沒有什麼不同，CSS特效同樣也可以套用。之前有說過React官方的文件是用內嵌樣式的語法，同樣你也可以直接用現成的CSS樣式。至於它們各自有什麼樣的一些細節，之前的章節內容中有稍微分析過了，你可以再仔細看看然後再決定你想要的作法，這個範例只是其中一種解決方案，不一定要這樣作。

最後因為文章篇幅的關係，可能無法介紹到React中的動畫要怎麼作，這其實也是另一個大議題，目前來說除了官方的內建附加套件外，[文件說明](https://facebook.github.io/react/docs/animation.html)在這裡，也有幾種解決的方式，有興趣的話你可以再研究看看。
