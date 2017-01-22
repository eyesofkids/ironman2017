# React篇 - TodoApp程式 + Fetch/Ajax 於生命週期方法

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/intro.png)

今天的主題是要加入與伺服器資料互動的功能，一般我們所說的在網頁上的JavaScript應用與伺服器溝通，指的就是使用Ajax技術，傳送資料到伺服器或是與伺服器要資料。我們的範例程式主要會用在一開始載入資料、勾選為已完成的項目時，以及編輯現有的項目時這三個情況。

這個程式最後的呈現結果，就像下面的動態圖片這樣，重點是在於它會傳出與外部伺服器溝通的資料:

![TodoApp元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/day23_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day23_lifecycle/)，所有的程式碼也在裡面。

在解說之前，本篇使用的一些額外的工具與知識，在這篇文章不會再多作說明，這個就你需要進一步學習了，下面有附它們的連結:

- [json-server](https://github.com/typicode/json-server): 這是一個架在Node.js上的用於測試JSON格式資料的伺服器，而且是REST API，裡面用了lowdb，所以其實它是一個具有資料庫寫入、讀取、查詢的功能的伺服器。這個工具在Github上有1萬8千個星，如果你要開發像我們這種JavaScript應用，而且是用json交換資料的應用，學會用這個工具，保証讓你開發的日子輕鬆很多。

- [Postman](https://www.getpostman.com/): 這工具則是一個客戶端程式，也有Chrome的外掛擴充版本，這是用來模擬由客戶端發送各種要求(Request)用的，像POST、GET、PUT...等等。也就是例如在還沒開始寫程式前，先作測試，看你的資料傳到伺服器(json-server)上能不能正確查詢到資料，或是新增資料等等。當然它也有很多其他的功能，不過我只用這部份而已。

- [Fetch API](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/ajax_fetch.html): 這是一個API，是HTML5標準中的新特性，當然它是一個實作在JavaScript的新API，Fetch API是一個完全以為基礎的API，Fetch並不是一個單純的XHR擴充加強版或改進版本，它是一個用不同角度思考的設計，雖然是可以作類似的事情。此外，Fetch還是基於[Promise](https://www.gitbook.com/book/eyesofkids/javascript-start-es6-promise/details)語法結構的，而且它的設計足夠低階，這表示它可以依照實際需求進行更多彈性設定。相對於XHR的功能來說，Fetch已經有足夠的相對功能來取代它，但Fetch並不僅於此，它還提供更多有效率與更多擴充性的作法。

上面都是這個範例程式中有用到的部份，這些內容如果要整個解說完，可能光說這些30天都不夠用，我附的連結中的資料就請再自行學習了。

## 程式碼說明

本次的程式碼只有修改到`App`元件，其他都不變，這也是因為`App`元件裡有所有這個範例應用中所有的狀態，更動狀態的所有方法也在這裡面，所以與伺服器溝通就靠`App`元件就行了。

我們在`App`元件加了一個新方法`handleServerItemsLoad`，它會載入所有記錄在現在伺服器的項目資料。使用的是fetch的Promise語法，最後在正確載到資料時，作`this.setState`，但因為伺服器資料上並沒有`isEditing`，所以會在`setState`前作資料的整理，加上`isEditing`欄位。另外排序用`id`值，實際上`id`值就是我們每個項目加入的時間(微秒值)。程式碼如下:

```js
handleServerItemsLoad = () => {
  fetch('http://localhost:5555/items?_sort=id&_order=DESC', {
    method: 'GET'
    })
    .then((response) => {
      //ok 代表狀態碼在範圍 200-299
      if (!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then((itemList) => {

       //加入{ isEditing: false }屬性
       const items = itemList.map((item) => {
         return Object.assign({}, item, { isEditing: false })
       })

      //載入資料，重新渲染
      this.setState({
        items,
      })
    })
    .catch((error) => {
      //這裡可以顯示一些訊息
      //console.error(error)
    })
}
```

然後在生命週期方法的呼叫這個方法，`componentDidMount`在ES6類別的元件語法中，是內建就有的一個方法，它會在React元件"已經"掛載到真實網頁上執行裡面的程式碼。程式碼如下:

```js
componentDidMount() {
  // 元件"已經"載入，所以可以載入資料進來
  this.handleServerItemsLoad()
}
```

> 註: 無狀態元件，也就是用函式語法寫的元件，是"不能"使用生命週期方法的。

另一個新增的方法稱為`handleServerItemAdd`，它是用於在新增項目用的，REST API用的是`POST`這個method值，因為我們在資料庫裡不需要`isEditing`這個屬性，所以也有先作資料的整理工作。程式碼如下:

```js
handleServerItemAdd = (aItem: Item) => {
  //處理payload，不需要isEditing欄位
  const { id, title, isCompleted } = aItem
  const payload = { id, title, isCompleted }

  //作POST
  fetch('http://localhost:5555/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
   })
    .then((response) => {
      //ok 代表狀態碼在範圍 200-299
      if (!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then((item) => {
      //這裡可以顯示一些訊息，或是結束指示動畫…
      //console.log(item)
    })
    .catch((error) => {
      //這裡可以顯示一些訊息
      //console.error(error)
    })
}
```

在原先的`handleItemAdd`中加上呼叫這個`handleServerItemAdd`方法，讓資料同時也會傳到伺服器上儲存:

```js
//加入新資料到資料庫
this.handleServerItemAdd(aItem)
```

最後是這個`handleServerItemUpdate`，用於資料更新用的，REST API用的是`PUT`這個method值。大致上與上面的`handleServerItemAdd`方法都一樣，差異只是你需要給定要更新哪一筆資料，所以要給`id`值，這裡用了樣版字串的語法，像`http://localhost:5555/items/${id}`這樣的寫法，它也很方便使用，可以組合變數與字串。程式程如下:

```js
handleServerItemUpdate = (aItem: Item) => {
  //處理payload，不需要isEditing欄位
  const { id, title, isCompleted } = aItem
  const payload = { id, title, isCompleted }

  //作POST
  fetch(`http://localhost:5555/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
   })
    .then((response) => {
      //ok 代表狀態碼在範圍 200-299
      if (!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then((item) => {
      //這裡可以顯示一些訊息，或是結束指示動畫…
      //console.log(item)
    })
    .catch((error) => {
      //console.error(error)
    })
}
```

當然，你也要在更新項目狀態用的`handleStylingItem`來呼叫這個方法，讓項目完成狀態改變時，伺服器上的資料也一併會更新:

```js
//更新某一筆資料
this.handleServerItemUpdate(newItems[index])
```

以上就是程式碼的所有更動說明。當然它並會太複雜，有些動態指示的處理，或是錯誤時要如何處理，這留給你可以再去寫了。

---

## 生命週期方法

在React元件的設計中，因為它是個虛擬DOM的概念，所以每個元件實際上都是有生命週期(Lifecycle)的設計，也就是一個元件從一開始掛載(Mounting)到網頁上，然後呈現在網頁上，在網頁上因為事件的觸發進行更新(Updating)或重新渲染(being re-rendered)，最後從網頁上消失，稱為卸載(Unmounting)。

React為這些生命週期的階段，設計了一些方法讓開發者使用，在某個生命週期階段你可以利用這些方法，在裡面執行一些東西，實際上有兩個生命週期方法我們已經看過，也用到了，以下列出這些生命週期方法:

#### 卸載(Unmounting)

- constructor()
- componentWillMount()
- render()
- componentDidMount()

#### 更新(Updating)

- componentWillReceiveProps()
- shouldComponentUpdate()
- componentWillUpdate()
- render()
- componentDidUpdate()

#### 卸載(Unmounting)

- componentWillUnmount()

其他的重要方法還有兩個，分別是`setState()`與`forceUpdate()`。

生命週期方法在要作某些工作時特別重要，例如說一開始載入資料(Fetch/Ajax)或是計時器(Timer)，或是自訂的事件監聽等等。因為你不能在元件還沒呈現在網頁上作這些事，所以只能在`componentDidMount`中這些事情。計時器的clearTimeout或clearInterval，或是自訂事件監聽的取消則是在`componentWillUnmount`方法中作這些事情。

其實這個設計還滿簡單的，我後來有畫幾張圖來解說這些生命週期的階段，因為網路上找到的有些是亂畫或是畫得不清楚，有些是很舊的不太符合較新版本的React。

![mounting](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/mounting.png)

![updating](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/updating.png)

![unmounting](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/unmounting.png)

生命週期方法其實不需要太去記，主要是`componentDidMount`與`componentWillUnmount`這兩個，搭配計時器與一開始載入資料使用，大概一開始學React會容易看到的。當然`componentWillReceiveProps`有可能也會在很多元件交互應用時看到。

---

## json-server

這裡說明一些[json-server](https://github.com/typicode/json-server)的簡單用法。

首先當然是安裝它，直接用在命令列工具(終端機)中用npm工具就可以安裝，裝在全域即可:

```
npm install -g json-server
```

要啟動它也是用命令列工具(終端機)的指令，當然前提是你要先建立一個`db.json`檔案，這個檔案中在我們上面這個範例中有附上:

```
json-server --watch --port 5555 db.json
```

這個指令代表要啟動一個在埠號為5555的json-server伺服器，之後就可以用瀏覽器打開"http://localhost:5555/items"

> 註: 我們開發測試React應用的是3000埠，json-server伺服器是5555埠，相當於在同一個電腦啟動了兩個不同的伺服器。

> 註: 上面的5555是隨便取的埠號，你要用8888或9999也可以，不過埠號有一定的範圍就是。

`db.json`檔案格式就類似像下面這樣，它與JS中的物件格式很像，但它是個純文字檔而已。json-server伺服器的網址後加上items會自動只列出items裡面的json資料，它稱之為Routes(路由):

```
{
  "items": [
    {
      "id": 1482513391121,
      "title": "聽演唱會",
      "isCompleted": true
    }
  ]
}
```

那麼，因為json-server伺服器是個用REST API的伺服器，而且又有小型資料庫，又該如何新增、讀取、更新…裡面的資料？

首先你要先理解[REST](https://zh.wikipedia.org/wiki/REST)是什麼，也就是在傳資料時的method各自分別要作不同的事情之用，例如下面幾個:

- POST = 新增
- GET = 讀取
- PUT = 更新
- DELETE = 刪除
- PATCH = 取代部份資料

下面就幾種常用的要作某些事情的範例:

#### 載入所有資料

載入所有資料，預設是用id由小至大(ASC)排序:

> GET /items

用id排序，由大至小:

> GET /items?_sort=id&_order=DESC

#### 新增一筆資料

> POST /items

資料範例:

```
{
  "id": 4,
  "title": "44444",
  "isCompleted": false
}
```

#### 更新一筆資料

> PUT /items/4

資料範例:

```
{
  "id": 4,
  "title": "4321",
  "isCompleted": false
}
```

#### 刪除一筆資料

> DELETE /items/4

## 結論

本章主要是展示了React元件在與外部伺服器的溝通交互應用時，要如何來寫這些功能。這個範例程式用了新的Fetch API，以及幾個常常用在開發這類JS應用時會用到的工具，或許你可能還不熟悉，但我會建議你可以學習，因為這些新式的API，雖然它們並不是ES6標準的東西，但也是現在很重要的、很常被使用的一些API。

另一個主題當然是React中的生命週期方法，其實這也不是很困難的一個主題，主要要你要知道它是有這設計的，在某些特定的時刻，你非得使用這些生命週期方法來作某些事情。而在範例中的`state`與資料庫的資料是故意設計成不一樣的，因為`state`中的資料有可能不相等於資料庫的資料，這一點你需要很清楚，`state`是應用程式整體的狀態資料，它仍然有暫時存放的特性，在你重新載入網頁時，`state`就回復到最初始的狀態，只有依靠像資料庫的永久儲存性的方式，才能真正保存資料。
