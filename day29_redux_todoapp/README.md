# Redux篇: TodoApp + 路由器

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day29_redux_router/asset/intro.png)

今天的主題是在Redux中的最後一篇，我們將把之前React篇最後完成的TodoApp，改用Redux來管理應用程式領域的狀態，也加上了路由器的功能。

這個程式最後的呈現結果，就像下面的動態圖片這樣:

![Redux範例一展示](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day29_redux_router/day29_demo.gif)

> 註: 本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day29_redux_router/)，所有的程式碼也在裡面。

## 程式碼說明

我們要使用的是原本在React篇中的create-react-app工具建立的專案，所以要額外安裝Redux, react-redux, react-router與react-router-redux這4個套件。命令列如下:

```
npm i --save redux react-redux react-router react-router-redux
```
