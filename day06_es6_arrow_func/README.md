## ES6篇 - 箭頭函式


## 箭頭函式為什麼可以綁定this

- 傳統函式: this值是動態的，由呼叫這個函式的擁有者物件(Owner)決定
- 箭頭函式: this是lexical(詞法的)作用域決定，也就是由週邊的作用域所決定

箭頭函式與傳統函式的不同之處:

- 下面這些都是沒有定義本地綁定(local bindings)的變量，也就是說是lexical(詞法的)，由週邊的作用域所決定: arguments, super, this, new.target
- 不能作為建構函式(constructor)使用，不使用new

> 詞法的作用域(LexicallyScopedDeclarations)簡單的來說就是區塊(block)定義中的作用域

http://exploringjs.com/es6/ch_arrow-functions.html

http://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions-runtime-semantics-evaluation

https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch2.md#lexical-this

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

Immediately Invoked Arrow Function (IIAF):

```js
(() => {
    return 123
})();
```

IIFE有兩種寫法，但IIAF只能寫成上面那樣:

```js
(function () { // open IIFE
    // inside IIFE
}()); // close IIFE

(function () { // open IIFE
    // inside IIFE
})(); // close IIFE
```

http://stackoverflow.com/questions/33308121/can-you-bind-arrow-functions

https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions
