# React篇: 建置React開發環境

![intro](https://raw.githubusercontent.com/eyesofkids/ironman2017/master/day14_react_env/asset/intro.png)

"本文章附有影片"。在之前的"開發環境&開發工具"，我們已經介紹過整個的環境的建置，從這裡開始，我們需要為因應React的開發而建立的另一個開發環境。但只有少部份的不同設定之處，其實整體來說步驟都是一樣的。

> 註: 本文章附有影片，影片網址在[Youtube的這個網址](https://youtu.be/jGciQPb2NZo)。本文章同步放置於[Github庫的這裡](https://github.com/eyesofkids/ironman2017/tree/master/day14_react_env)。

## 學習目標

1. 安裝React編譯&執行環境
2. 安裝React Developer Tools(瀏覽器擴充功能)
3. 安裝與設定React開發工具
4. 撰寫第一支React程式 - HelloWorld元件

## 下載&安裝軟體

- Visual Studio Code: 程式碼編輯軟體，需要額外安裝擴充與設定。
- Node: JS伺服器環境+npm(JS函式庫相依管理工具)
- Chrome瀏覽器 + React Dev Tools套件: 瀏覽執行網頁與除錯用

## 安裝React編譯&執行環境

大部份之前都已經安裝過了，這裡的說明就會比較簡略。

### Node.js與npm

Node.js是一套JavaScript語言的執行環境，不過它是執行在網站伺服器端的。我們在開發時，使用的測試執行環境會使用Node.js作為網站伺服器平台，有許多在開發上很方便的機制，例如熱載入(hot loader)，在程式碼如果有更動時會自動重新編譯打包，以及自動更新瀏覽器。

Node.js可以直接到[Node.js官方網站](https://nodejs.org/en/)下載安裝程式包，目前分LTS(長期支援)與目前最新的兩種版本，要學習與開發Node.js的話，選擇最新版本，如果只是要執行而已的話，選擇LTS版本即可。官網有提供Windows、Mac OS X與Linux作業系統平台的版本，下載後按一般的軟體安裝即可。

Node.js安裝程式中會附帶npm程式，這是一個專門用來管理JavaScript套件相依性的程式工具，我們等會要使用它來安裝開發時需要的相依套件。

> 註: 因為Node.js發佈與升級相當快速，而且目前又有兩種發佈版本，如果你是使用Mac OSX或Linux作業系統的話，可以使用[nvm](https://github.com/creationix/nvm)(Node Version Manager)管理工具來安裝，之後可以在電腦中裝各種不同的版本與管理切換。

### Yarn

[Yarn](https://yarnpkg.com/)是Facebook最近推出的新專案，目的是提供更快速的套件安裝，Yarn工具目前在最新版本的React與React Native中都有支援。

Windows平台可以直接下載[安裝程式](https://yarnpkg.com/en/docs/install#windows-tab)進行安裝。

> 註: Windows平台要先安裝Node.js

macOS需要先安裝[Homebrew](http://brew.sh/)，然後用下面的指令安裝。

```
brew update
brew install yarn
```

> 註: macOS的安裝過程，會同時檢查電腦上是不是有安裝Node，如果沒有裝會再加裝Node.js。

你需要另外把yarn指令加到命令列中的PATH環境變數中，先開啟命令列視窗(終端機)使用以下的指令開啟設定檔(需要輸入目前的使用者密碼):

```
sudo nano .bash_profile
```

最後加入以下這行:

```
export PATH="$PATH:`yarn global bin`"
```

按"Ctrl+X"然後按Y儲存，關閉後再重啟命令列視窗(終端機)，輸入以下的指令來檢測是不是已經安裝好了:

```
yarn --version
```

> 註: yarn的指令很少，目前並不能完全取代npm，而且指令與npm是有點不同的，例如安裝某幾個套件(模組)時是使用`yarn add`。指令可以參考[這裡的文件](https://yarnpkg.com/en/docs/usage)。

### 建立React應用(Create React App)

2016年7月時Facebook發佈了一個可以簡單建立開發的React樣版文件(boilerplate)的工具 - [Create React App](https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html)。可以用它很快的建立一個開發React用的專案樣版文件。

一開始先在命令列程式中輸入以下的指令，安裝這個工具程式，這會裝到全域之中，代表在任何目錄中都可以使用這個工具程式:

```
npm install -g create-react-app
```

> 註: 如果`npm install`有權限的問題，請在前面加上`sudo`，即輸入`sudo npm install`

然後先切換到要用來開發的目錄中，再來輸入以下的指令，這樣子建立一個應用程式所存放的資料夾，例如`my-app`資料夾:

```
create-react-app my-app
```

> 註: 目錄的路徑中最好不要有中文。
> 註: 如果你的電腦已經有安裝好yarn，上面的指令輸入後會使用yarn來進行安裝，會比用npm來得快。

在建立過程中，它會安裝所需的各種套件，經過一段時間的安裝後，輸入以下的指令切換到`my-app`資料夾中，然後啟動網站伺服器:

```bash
cd my-app
npm start
```

> 註: 如果你的電腦已經有安裝好yarn，也可以使用`yarn start`。

此時用應該會自動打開預設瀏覽器，網址是`http://localhost:3000`，應該會看到有出現範例程式`Welcome to React`的畫面，代表你已正確安裝好React的測試用執行環境了。

> 註: 你也可以使用其他的樣版文件專案，例如[react-static-boilerplate](https://github.com/koistya/react-static-boilerplate)或[react-boilerplate](https://github.com/mxstbr/react-boilerplate)都還有在更新維護中。使用方式與上面說的類似，不過它們內附的套件內容應該是更多。

## 加入ESLint工具支援

開啟`package.json`，加入額外的`eslintConfig`區域，例如下面這樣:

```
"eslintConfig": {
    "extends": "react-app"
  }
```

官方建議要把eslint所需的套件整個安裝到全域之中，以免發生有套件找不到的情況:

```
npm install -g eslint-config-react-app@0.3.0 eslint@3.8.1 babel-eslint@7.0.0 eslint-plugin-react@6.4.1 eslint-plugin-import@2.0.1 eslint-plugin-jsx-a11y@2.2.3 eslint-plugin-flowtype@2.21.0
```

最後測試看看ESLint工具有沒有正常在編輯工具中會檢查然後出現警告。

> 註: 如果你是使用`Atom`編輯器的話，除了上面的步驟外，在`linter-eslint`外掛中還需要勾選(開啟)`Use global ESLint installation`這個選項。請參考[這裡的說明](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#displaying-lint-output-in-the-editor)。

## 加入Flow工具支援

請先確定你的電腦已經有安裝過flow-bin套件了，而且你的開發工具VSC已經有裝好對應的外掛，如果像之前我們最前面的章節你已經安裝過，就不需要再安裝。安裝的指令如下:

```
npm install -g flow-bin
```

在根目錄新增一個`.flowconfig`檔案，然後在裡面加入以下的內容:

```
[ignore]
<PROJECT_ROOT>/node_modules/fbjs/.*

[libs]
./node_modules/fbjs/flow/lib

[options]
esproposal.class_static_fields=enable
esproposal.class_instance_fields=enable

module.name_mapper='^\(.*\)\.css$' -> 'react-scripts/config/jest/CSSStub'
module.name_mapper='^\(.*\)\.\(jpg\|png\|gif\|eot\|svg\|ttf\|woff\|woff2\|mp4\|webm\)$' -> 'react-scripts/config/jest/FileStub'

suppress_type=$FlowIssue
suppress_type=$FlowFixMe
```

最後測試看看Flow工具有沒有正常在編輯工具中會檢查然後出現警告。如果等很久都沒反應，請在命令列工具(終端機)中輸入以下的指令:

```
flow check
```

> 註: 在Windows下測試時，flow檢查有可能需要一點時間才會開始正常運作。請輸入上面的指令後看會不會出現檢查的結果。

create-react-app其中也有包含flow的設定檔，官網的文件是說明，可以在packages.json中的scripts區域加入下面這一行:

```
"flow": "flow"
```

然後用命令列工具執行flow檢查的指令:

```
npm run flow
```

如果你的編輯器的Flow工具一直檢查不出來，或是一直有問題，可以試試官網提供的輸入檢查的設定方式與指令。

## eject專案(選項)

> 注意: 這是個一次性的指令，之後不能再復原回原先的專案結構。使用前請先看下面的說明。

create-react-app這個樣版文件，把所有的設定文件都藏在node_modules/react-scripts之中，有時候要作某些設定，或是加某個新的套件時，會非常的不方便。

當然因為create-react-app是設計給初學者使用的，如果你才剛開始學習，不需要花太多時間去設定這些套件，也不需要用什麼額外的套件，那直接使用就好了。畢竟對初學者來說，專心學習一開始的基礎語法是比較重要的，學這些webpack、eslint、babel的設定，實際上有些複雜也要花時間學，不要模糊了焦點。

create-react-app提供了eject(彈出)的指令，可以把所有的設定值移出到根目錄之中，但是這是一個一次性的指令，如果你用了這個指令後，整個專案就回不去原先的專案的結構，之後的裡面的套件有新的版本要升級時，就只能靠你手動來升級每個裡面的套件。聽起來會滿嚴重的？其實並不會，這個環境只是一個編譯&開發測試React應用的環境，與我們最早之前建置的那個樣版文件的環境並沒有差太遠，只是它是由React官方團隊所作的工具，有些地方會調整的比較好，所以才會使用它，要不然你如果有時間，也可以建一個自己專用的專案樣版文件。

要eject(彈出)用create-react-app建置的專案，可以用下面的指令:

```
npm run eject
```

> 註: 以create-react-app工具所建立的專案，官方有提供升級裡面套件的版本的方式，請參考[這一篇文章](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases)的說明。

## 安裝React Developer Tools(瀏覽器擴充功能)

React Developer Tools主要是用來除錯用的，而且可以觀察React應用程式在網頁上執行的一些資訊。它是一個Google Chrome瀏覽器的擴充功能，用瀏覽器連線到[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)，然後進行安裝(按右上角的"加到CHROME")，最後在瀏覽器中確定有啟用它。

## 安裝與設定React開發工具

這裡使用的開發工具是Visual Studio Code，這是一套免費開放原始碼的編輯工具，你可以連到[Visual Studio Code網站](https://code.visualstudio.com/)下載適合你的電腦作業系統的版本，然後安裝它。

Visual Studio Code編輯程式並不是那種一安裝好就有完整功能的工具，它需要要安裝額外不少的套件才能用來開發React。

> 註: 你也可以使用Sublime Text3、Atom或是WebStorm來開發，或是其他你熟悉的JavaScript程式語言開發工具。Facebook有另一套[Nuclide](https://nuclide.io/)開發工具，不過裡面的部份功能在Windows上還不支援。

## 撰寫第一支React程式

打開Atom編輯程式，把React樣版文件的解壓縮目錄加到目前工作的視窗，加入專案的目錄中。

點開樹狀目錄中的src資料夾，裡面有兩個程式碼檔案，一個是index.js，另一個是App.js。

index.js是我們React應用程式的根執行檔案。用滑鼠左鍵雙點擊把它打開來。裡面的程式碼很簡單，只有以下幾行:

> index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

把App.js這個檔案的內容清空，改輸入以下的程式碼:

> App.js

```js
import React, { Component } from 'react'
import HelloWorld from './HelloWorld'

class App extends Component {
  render() {
    return (
      <HelloWorld text="今天就開始學React!" />
    );
  }
}

export default App
```

然後新增一個HelloWorld.js檔案，裡面的內容如下:

> HelloWorld.js

```js
import React, { Component } from 'react'

class HelloWorld extends Component {
    render() {
        return <h1>{this.props.text}</h1>
    }
}

export default HelloWorld
```

開啟命令列視窗，切換到my-app目錄後，輸入`npm start`(或`yarn start`)啟動伺服器，然後用瀏覽器開啟`http://localhost:3000`(實際上會自動幫你開啟瀏覽器)，看能不能看到結果。

試著改變"今天就開始學React!"這行字，看網頁上的結果會不會也跟著改變。

如果你都能正確看到結果，那麼恭喜你進入React開發的大門！

## 影片

[![Day14](http://img.youtube.com/vi/jGciQPb2NZo/0.jpg)](https://www.youtube.com/watch?v=jGciQPb2NZo)

## 結論

本文很快地介紹建置React使用的開發環境，對比之前的用於ES6學習的開發環境與工具，其實都是大同小異的設定方式，唯一的差異是多Facebook最近所發佈的yarn與create-react-app工具。這兩個工具因為最近才推出，所以有些功能還是很新，可能裡面的設定還會再變動，濳在的問題也滿多的。初學者在使用時，記得還是不要花太時間在作設定的部份，有時候你可能會遇上還沒解決的問題。

下一章開始，我們要來介紹React的各種語法，以及重要的特性，這才是我們需要學的重點。工具的本身只是輔助，掌握重要的開發知識才是最重要的。
