# Redux篇: 使用react-thunk處理副作用


http://jaysoo.ca/2016/02/28/organizing-redux-application/


Uncaught Error: Actions must be plain objects. Use custom middleware for async actions.

## Redux中的副作用處理議題

長期以來在程式語言中，就以兩大分類來區分程式開發的風格，它們分別是以下這兩種:

- imperative programming(命令的): "HOW"，你要如何完成工作
- declarative programming(聲明的、宣告的): "WHAT"，你要作哪些工作

舉一個最簡單的例子來說，例如當你接到一個宅急便要送快遞給你的電話: "我是宅急便，我要如何送貨給你？"

如果是以imperative(命令的)的方式來回答，就會下面這樣:

"如果從你們的送貨處騎車的話，麻煩先從新生南路往南騎車先到羅斯福路右轉，再到第三個紅綠燈後的巷子左轉，進到巷子後第三棟大樓的門口，然後按10樓電鈴"

如果是以declarative(聲明式的、宣告的)的方式來回答，就會下面這樣:

"麻煩送到下面的住址，羅斯福路3段105巷10樓"

以程式語言來說，大致上的分類是這樣的，大部份的程式語言都是imperative(命令的)的:

- imperative(命令的): C, C++, Java
- declarative(聲明的、宣告的): SQL, HTML
- Mixed(可以是上面兩種): JavaScript, C#, Python

以簡單的SQL作範例，像下面這段的程式碼:

```
SELECT * FROM Users WHERE City='Mexico';
```

你應該可以直接從程式碼中就能看出它的作用，具有非常高的可閱讀性，這也是現今declarative(聲明的、宣告的)程式開發會逐漸受到很大的重視的原因之一。我們在談論React時，也可以用一個對比來說:

- 框架/函式庫: jQuery - imperative(命令的) vs React - declarative(聲明的、宣告的)



對程式開發來說，還有幾個重要的關鍵原因:

- 高閱讀性
- 容易除錯，也容易測試

http://stackoverflow.com/questions/36635670/can-i-send-an-ajax-call-in-react-and-redux-without-action-creators-and-reducers
http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559
https://github.com/reactjs/redux/issues/533
http://michalzalecki.com/reduce-side-effects-in-react-redux/

https://medium.com/javascript-and-opinions/redux-side-effects-and-you-66f2e0842fc3#.gpz881byj
http://redux.js.org/docs/advanced/AsyncActions.html
https://github.com/reactjs/redux/issues/1528
https://github.com/salsita/redux-side-effects
http://stackoverflow.com/questions/34930735/pros-cons-of-using-redux-saga-with-es6-generators-vs-redux-thunk-with-es7-async/34933395
http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34623840#34623840


imperative(命令的)與declarative(聲明式的、宣告的)只是代表不同的程式開發方式，這無關於好與壞，但這會與開發者的喜好有差異。


或許你有聽過Functional Programming(函數式開發)，它是屬性declarative programming(聲明式的、宣告的)的範圍。
