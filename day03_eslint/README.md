# 鐵人賽第 3 天: ESlint

> 就像在這個世界的每個人一樣，不可能是完美的，程式語言也是一樣。

JavaScript語言長期以來有許多為人詬病的許多設計，雖然它一開始的初衷是希望能設計一個簡單易學的程式語言，但是因為自由度高又是動態類型，很多時候不同的語法可以作同樣的事，開發者也經常會出現不經意的錯誤。

在經過20年來的多次標準增修，以及眾多使用者的努力下，目前有了更多的新特性。在不完美的地方，也有很多新的解決方式來輔助開發者，像Lint工具的流行就是其中一個。

Lint工具最早是使用於C語言的程式碼靜態分析工具，用來標記語法結構上有可疑的、濳在的問題語法或指令。

## ESLint

在更早之前有[JSLint](http://jslint.com/)與[JSHint](http://jshint.com/)兩個為JavaScript設計的檢查工具，其中JSLint是由Douglas Crockford大師所創造，在2002年就發佈的一個工具，算得上是很有歷史的工具，不過它十分具有創造者的想法與特色，可以自訂的選項很少。而JSHint是從JSLint分支出來的新專案(2011)，更傾向於由社群主導的專案，具有更多的彈性選項。

[ESLint](http://eslint.org/)是在這個領域的新專案，根據[最近的一份統計](https://ashleynolan.co.uk/blog/frontend-tooling-survey-2016-results#js-linters)也是在JavaScript開發中目前使用最多的語法檢查工具，它在2013年由[Nicholas C. Zakas](https://www.nczonline.net/about/)創造，正如它的名字一樣，它是為ES新標準所設計。

相較於JSLint與JSHint，ESLint雖然也是作為檢查工具，但它有其他的新的特色如下:

- 高度的設定彈性: 有更多規則選項可以依需求或喜好設定
- 具有開發擴充功能: 函式庫或框架的開發者可以依需求再開發擴充
- ES6與JSX支援: 高度支援ES6標準語法，以及React自創的JSX語法
- 警告與錯誤訊息: 更清楚的警告或錯誤訊息

## Airbnb的專案 - JavaScript風格指引

要談到ESLint，就需要進一談到Airbnb這家公司，這是一家專門在網路上提供民宿(或個人)的住所出租的網站服務業者，有可能你有聽過或出國自由行時有去租上面的房間。那麼Airbnb與ESLint有什麼關係？

Airbnb在Github上最有名的專案，就是這個擁有4萬個星的[JavaScript Style Guide (JS風格指引)](https://github.com/airbnb/javascript)，它並不是一個有應用程式碼的應用程式專案，而是以開發社群為導向的方式，制定一份JavaScript應用程式在開發時的撰寫風格指引，這份指引是讓所有的JavaScript的開發者參考，為了讓開發者能寫出更簡潔、更少錯誤的程式碼。目前也有延伸這種指引方式到React、CSS-in-JavaScript、CSS / Sass與Ruby的內容。目前這份的指引是以ES6標準為主。

這份JavaScript指引也有[中文翻譯的版本](https://github.com/jigsawye/javascript)，你也可以參考中文的版本。在你稍微看到過了這份指引後，可以發現每個規則的後面都有一個eslint的對應規則，例如:

> 15.1 請使用 === 和 !== ，別使用 == 及 != 。eslint: eqeqeq

後面的`eslint: eqeqeq`對照的就是在ESLint中的`eqeqeq`這個檢查規則，這個規則是在你如果在程式碼中，用值相等比較符號(==)時，會出現警告訊息，要求你要用嚴格相等比較(===)會比較好。

不過，這麼多的JavaScript風格指引，不太可能開發者有那個美國時間一一記得，所以Airbnb把所有的風格指引，統統寫成一個ESLint中的設定檔案，稱之為[eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base)，如果你的開發環境或工具有使用ESLint，直接裝來套用就行了。所以，在上一章的"樣版文件"中，就有直接使用這個設定檔案。

## 如何使用檢查工具

要使用加上Airbnb風格後的ESLint來檢查程式碼，如果你是第一次使用，包準你只有一個感想 - "有夠麻煩"。

你可以把平常寫的JavaScript的一些程式碼，貼到編輯區域看看，例如下面這個用jQuery程式碼:

```js
$('.btn').click(function() {
  $.ajax({
        url: "check.php",
        data: {
            old_password: $("#old_password").val()
        },
        type: "POST",
        dataType: "json",
        success: function(data,textStatus,jqXHR) {
          console.log("success");
        },
        error: function() {
          console.log("success");
        },
        complete: function() {
          console.log("success");
        }
    });
});
```

經過ESLint檢查後，一共有37個錯誤與7個警告。啥？這不是之前可以用的一個程式碼？因為大部份都是風格部份的錯誤與警告，例如下面這些:

- 語句結尾加了分號(;): 這規則我在`.eslintrc`中另外設定的
- 空格的數量不對: 18.1 將 Tab 設定為兩個空格
- 字串要用單引號(\'\')，不用雙引號(\"\"): 6.1 字串請使用單引號 ''。
- 函式或區塊語句的空格或空行風格: 18.2、18.3、18.4、18.7、18.8、18.9、18.11等等，整個18節內容都有。

上面的程式碼像下面這樣改寫後，剩下4個錯誤3個警告，錯誤是因為我沒有引入jquery模組，警告是因為用了三個`console.log`，這樣應該算幾乎符合風格樣式的檢查:

```js
$('.btn').click(() => {
  $.ajax({
    url: 'check.php',
    data: {
      old_password: $('#old_password').val(),
    },
    type: 'POST',
    dataType: 'json',
    success(data, textStatus, jqXHR) {
      console.log('success')
    },
    error() {
      console.log('success')
    },
    complete() {
      console.log('success')
    },
  })
})
```

所以說這還是需要逐漸地養成習慣的，我建議你開始今天就用吧，用久了自然就會習慣了，事實上大部份的錯誤或警告，只是提醒在撰寫時的一些格式問題。

## 嚴重的錯誤檢查

ESLint的檢查出在程式碼中可能的剖析嚴重的致命錯誤，這些錯誤是一執行就會產生錯誤而停止執行，基本上會出現致命錯誤時，其他的所有檢查訊息都會先不出現，因為這個錯誤如果不修正，會造成整個程式根本不能正常運作，例如:

```js
{ a: 1 }.toString() //message: 'Parsing error: Unexpected token'
```

或是下面這個常見的例子(因為作為跳脫符號後面多了一個空格):

```js
const a = 'This is a \
book'

console.log(a)

// message: 'Parsing error: Unterminated string constant'
```

或是像ES6中新語法的基本使用錯誤，這個錯誤也會造成程式停止執行。它也可以正確的指出:

```js
const a = [1, 2, 3]
a = [] //message: ''a' is constant. (no-const-assign)'
console.log(a)
```

## ESLint的設定檔

我把ESLint的設定方式放在最後一節，是因為它有個大缺點就是很不好設定。如果我沒記錯，它在設定檔的格式部份，不知道已經修過或改過多少次，先不說規則要如何設定，它的設定檔基本上是使用`.eslintrc`這個檔案，按照官方[Configuring ESLint](http://eslint.org/docs/user-guide/configuring)文件的說法，它可以使用JSON或YAML格式，所以你會看到網路上有兩種設定的格式。

我在上一章的樣版文件中附的設定檔案的內容如下，這是JSON格式的:

```js
{
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "rules": {
    "semi": ["error", "never"]
  },
  "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
  }
}
```

大概解說一下這裡面的幾個設定區域:

- parser: 指的是剖析器，如果你有用babel編譯器，就是設定"babel-eslint"
- extends: 這可以指定一些已經設定好的規則設定檔，像我這裡是用"airbnb-base"。不過你的專案裡也要有裝`eslint-config-airbnb-base`套件才能這樣設定。
- rules: 額外的規則，我這裡只有另外定義可以語句結尾不用分號(;)這個規則。
- ecmaFeatures: 這是一些特殊的語法，這兩個都是寫React需要的。

其他常用到的區域如下:

- plugins: 設定外掛。要有安裝才會設定。
- env: 設定是要在browser或node上使用。(實際上可以設定的環境有29種，大部份都是測試環境)

我會建議初學者，先用現成的就好。除了上面的這幾個設定區域外，它的規則有超過一百個以上，而且不一定可設定值都是相同的，如果你要設定規則，不妨先從別人設定好的來修整或覆蓋，像我上面設定rules區域中這樣。
