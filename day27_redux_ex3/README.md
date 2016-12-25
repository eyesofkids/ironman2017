# Redux篇 - 再見了！state



## 為何需要react-redux

因為react-redux可以將Redux中的store的，與元件中的state中串連起來，而且最重要的是 - "不需要再用state了"，我們不再需要state這個React中的特性，完全使用Redux中的store來取代它，store內部會與React上層元件的state溝通，在合適的時刻進行重新渲染，我們只要專心把store與Redux處理好就行了。

`state`本身並沒有錯，只是它管不到的事情太多了，`state`與`setState`的設計在之前的章節已經說過了，它有一些特性:

- `state`本身是每個元件內部的私有資料，只能用於儲存單純的資料
- `setState`的執行有延時(delay)的特性，類似於異步，請參考這篇[為何說setState方法是異步的](http://eddychang.me/blog/javascript/98-why-setstate-is-async.html)
- `setState`方法無法完全掌控應用中所有元件的狀態，生命週期方法裡面其實對setState有一些限制，例如`componentWillUpdate`，當然`render`方法裡也不行。
- `setState`方法可能會引發不必要的渲染
- `setState`方法是一個高花費的執行過程，它與應用程式的執行效率有關

再者，我們的應用程式領域的狀態，應該是能夠"穿透"整個React應用，所有在其中的元件都有一個方式可以互相溝通。在簡單的應用中，可以利用之前所介紹過的上層元件與下層元件溝通的方式來作，那複雜的元件呢？如果多達四、五層的元件結構，這種上下層互傳資料的方式顯然不可行，也難以管理。




- https://css-tricks.com/learning-react-redux/
