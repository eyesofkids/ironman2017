### props中的父母-子女關係

props(屬性)的概念上一堂有談過了，它是React Element(元素)中的屬性值，要思考props(屬性)絕對不能以單一個元件的角度來看，元件是具有層級性的東西。雖然這個例子還沒用到`props.children`的屬性，不過大概說明一下。

props(屬性)在React Element(元素)中是可以存在有 父母-子女(parent-children) 的關係，這個設計與真實網頁上的DOM元素的樹狀結構類似，所以當父母(parent)節點想要存取它的子女們(children)節點時，React中提供了`this.props.children`屬性可以使用。不過，React會認為`this.props.children`屬性是一個含糊不清(opaque)的資料結構，為什麼呢？因為它有可能有幾種回傳情況:

- 子節點不存在，資料為"undefined"：例如`<Component />`或`<Component></Component>`
- 只有單一個子節點，資料為"單一物件/元件"：例如`<Component><span></span></Component>`或`<Component><ChildComponent></ChildComponent><Component>`
- 有多個子節點，資料為"陣列(物件/元件)"：例如`<Component><span></span><ChildComponent></ChildComponent></Component>`
- 資料為"字串"：例如`<Component>我是字串</Component>`

React中在`React.Children`裡有幾個方法來協助你處理`this.props.children`的資料，其中`map`與`forEach`和陣列的方法有點相像:

- React.Children.map：迭代(iterate)資料並呼叫你提供的回調函式，回傳陣列或undefined
- React.Children.forEach：迭代(iterate)資料並呼叫你提供的回調函式，和map類似，但不會回傳陣列
- React.Children.count：回傳>=0的個數
- React.Children.only：回傳一個子元件，只能用於單個子元件的情況
- React.Children.toArray：回傳為陣列型態

一個經常會被使用的樣式是迭代(iterate)所有的子節點，複制新的子節點後加上新的props值，這個樣式在一些專門開發元件的函式庫中很常見到:

```js
var newChildren = React.Children.map(this.props.children, function(child) {
  return React.cloneElement(child, { foo: true })
});
```
