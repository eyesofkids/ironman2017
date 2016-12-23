# React篇: Day 23: React篇 - TodoApp程式 + Fetch/Ajax 於生命週期方法

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/intro.png)

今天的主題是要加入與伺服器資料互動的功能，一般我們所說的在網頁上的JavaScript應用與伺服器溝通，指的就是使用Ajax技術，傳送資料到伺服器或是與伺服器要資料。我們的範例程式主要會用在一開始載入資料、勾選為已完成的項目時，以及編輯現有的項目時這三個情況。

這個程式最後的呈現結果，就像下面的動態圖片這樣:

![TodoApp元件展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day23_lifecycle/asset/day22_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day23_lifecycle/)，所有的程式碼也在裡面。

AJAX這個技術名詞的出現是在十年前(2005)，其中內容包含XML、JavaScript中的XMLHttpRequest物件、HTML與CSS等等技術的整合應用方式，這個名詞並非專指某項特定技術或是軟體。所謂的AJAX技術在JavaScript中，即是以XMLHttpRequest物件(簡稱為XHR)為主要核心的實作。正如它的名稱，它是用於客戶端對伺服器端送出httpRequest(要求)的物件，使用的資料格式是XML格式，現在可能JSON格式才是最為流行的資料格式。

在解說之前，本篇使用的一些額外的工具與知識，在這篇文章不會再多作說明，這個就你需要進一步學習了，下面有附它們的連結:

- [json-server](https://github.com/typicode/json-server): 這是一個架在Node.js上的用於測試JSON格式資料的伺服器，而且是REST API，裡面用了lowdb，所以其實它是一個具有資料庫寫入、讀取、查詢的功能的伺服器。這個工具在Github上有1萬8千個星，如果你要開發像我們這種JavaScript應用，而且是用json交換資料的應用，學會用這個工具，保証讓你開發的日子輕鬆很多。

- [Postman](https://www.getpostman.com/): 這工具則是一個客戶端程式，也有Chrome的外掛擴充版本，這是用來模擬由客戶端發送各種要求(Request)用的，像POST、GET、PUT...等等。也就是例如在還沒開始寫程式前，先作測試，看你的資料傳到伺服器(json-server)上能不能正確查詢到資料，或是新增資料等等。當然它也有很多其他的功能，不過我只用這部份而已。

- [Fetch API](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/ajax_fetch.html): 這是一個API，是HTML5標準中的新特性，當然它是一個實作在JavaScript的新API，Fetch API是一個完全以為基礎的API，Fetch並不是一個單純的XHR擴充加強版或改進版本，它是一個用不同角度思考的設計，雖然是可以作類似的事情。此外，Fetch還是基於[Promise](https://www.gitbook.com/book/eyesofkids/javascript-start-es6-promise/details)語法結構的，而且它的設計足夠低階，這表示它可以依照實際需求進行更多彈性設定。相對於XHR的功能來說，Fetch已經有足夠的相對功能來取代它，但Fetch並不僅於此，它還提供更多有效率與更多擴充性的作法。

上面都是這個範例程式中有用到的部份，因為這些內容如果要解說完，可能光說這些30天都不夠用，就請再自行學習了。

## 程式碼說明

本次的程式碼只有修改到`App`元件，其他都不變，這也是因為`App`元件裡有所有這個範例應用中所有的狀態，更動狀態的所有方法也在這裡面，所以與伺服器溝通就靠`App`元件就行了。

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

生命週期方法其實不需要太去記，主要是`componentDidMount`與`componentWillUnmount`這兩個，搭配計時器與一開始載入資料使用，大概一開始學React會容易看到的。當然`componentWillReceiveProps`有可能也會在很多元件交互應用時看到。

其實這個設計還滿簡單的，我後來有畫幾張圖來解說這些生命週期的階段，因為網路上找到的有些是亂畫或是畫得不清楚，有些是很舊的不太符合較新版本的React。




---

## json-server

```
json-server --watch --port 5555 db.json
```

POST = 新增
GET = 讀取
PUT = 更新
DELETE = 刪除
PATCH = 取代部份資料

載入所有資料

GET
localhost:5555/items

新增一筆資料

POST
localhost:5555/items

```
{
  "id": 4,
  "title": "44444",
  "isCompleted": false
}
```

更新一筆資料
PUT
localhost:5555/items/4

```
{
  "id": 4,
  "title": "4321",
  "isCompleted": false
}
```

更新部份資料
PATCH
localhost:5555/items/4
```
{
  "title": "40004"
}
```

刪除一筆資料
DELETE
localhost:5555/items/4
