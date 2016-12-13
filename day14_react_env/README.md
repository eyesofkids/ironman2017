# HelloWorld

## 學習目標

1. 安裝React編譯&執行環境
2. 安裝React Developer Tools(瀏覽器擴充功能)
3. 安裝與設定React開發工具
4. 撰寫第一支React程式 - HelloWorld元件

## 下載&安裝軟體

### 必裝

- Visual Studio Code: 程式碼編輯軟體，需要額外安裝擴充與設定。
- Node: JS伺服器環境+npm(JS函式庫相依管理工具)
- Chrome瀏覽器 + React Dev Tools套件: 瀏覽執行網頁與除錯用

## 安裝React編譯&執行環境

### Node.js與npm

Node.js是一套JavaScript語言的執行環境，不過它是執行在網站伺服器端的。我們在開發時，使用的測試執行環境會使用Node.js作為網站伺服器平台，有許多在開發上很方便的機制，例如熱載入(hot loader)，在程式碼如果有更動時會自動重新編譯打包，以及自動更新瀏覽器。

Node.js可以直接到[Node.js官方網站](https://nodejs.org/en/)下載安裝程式包，目前分LTS(長期支援)與目前最新的兩種版本，要學習與開發Node.js的話，選擇最新版本，如果只是要執行而已的話，這兩種版本選擇其中一種即可。官網有提供Windows、Mac OS X與Linux作業系統平台的版本，下載後按一般的軟體安裝即可。

Node.js安裝程式中會附帶npm程式，這是一個專門用來管理JavaScript套件相依性的程式工具，我們等會要使用它來安裝開發時需要的相依套件。

> 註: 因為Node.js發佈與升級相當快速，而且目前又有兩種發佈版本，如果你是使用Mac OSX或Linux作業系統的話，可以使用[nvm](https://github.com/creationix/nvm)(Node Version Manager)管理工具來安裝，之後可以在電腦中裝各種不同的版本與管理切換。

### Yarn

Yarn是Facebook最近推出的新專案，目的是提供更快速的套件安裝，Yarn工具目前在新版本的React與React Native中都有支援。

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

### 建立React應用(Create React App)

2016年7月時Facebook發佈了一個可以簡單建立開發的React樣版文件(boilerplate)的工具 - [Create React App](https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html)。可以用它很快的建立一個開發React用的樣版文件。

一開始先在命令列程式中輸入以下的指令，安裝這個工具程式，這會裝到全域之中，代表在任何目錄中都可以使用這個工具程式:

> 註: 命令列工具，在Windows作業系統下建議使用[Windows PowerShell](https://msdn.microsoft.com/zh-tw/powershell/scripting/setup/installing-windows-powershell)。

```
npm install -g create-react-app
```

> 註: 如果`npm install`有權限的問題，請在前面加上`sudo`，即輸入`sudo npm install`

然後先切換到要用來開發的目錄中，再來輸入以下的指令，這樣子建立一個應用程式所存放的資料夾，例如`my-app`資料夾:

```
create-react-app my-app
```

> 註: 目錄的路徑中最好不要有中文。

在建立過程中，它會安裝所需的各種套件，經過一段時間的安裝後，輸入以下的指令切換到`my-app`資料夾中，然後啟動網站伺服器:

```bash
cd my-app
npm start
```

此時用應該會自動打開預設瀏覽器，網址是`http://localhost:3000`，應該會看到有出現範例程式`Welcome to React`的畫面，代表你已正確安裝好React的測試用執行環境了。

> 註: 你也可以使用其他的樣版文件專案，例如[react-static-boilerplate](https://github.com/koistya/react-static-boilerplate)或[react-boilerplate](https://github.com/mxstbr/react-boilerplate)都還有在更新維護中。使用方式與上面說的類似。

## 加入Flow工具支援

切換到該目錄，在命令列視窗(終端機)，輸入以下的指令

```
npm install --save-dev babel-plugin-transform-flow-strip-types
```

開啟`/node_modules/react-scripts/.babelrc`，加入剛安裝的套件在設定檔中，改為以下的內容:

```
{
  "presets": ["react-app"],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

在根目錄新增一個`.flowconfig`檔案，然後在裡面加入以下的內容:

```
[ignore]
<PROJECT_ROOT>/node_modules/fbjs/.*
```

最後測試看看Flow工具有沒有正常在編輯工具中會檢查然後出現警告。

## 安裝React Developer Tools(瀏覽器擴充功能)

React Developer Tools主要是用來除錯用的，而且可以觀察React應用程式在網頁上執行的一些資訊。它是一個Google Chrome瀏覽器的擴充功能，用瀏覽器連線到[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)，然後進行安裝(按右上角的"加到CHROME")，最後在瀏覽器中確定有啟用它。

## 安裝與設定React開發工具

這裡使用的開發工具是Visual Studio Code，這是一套免費開放原始碼的編輯工具，你可以連到[Visual Studio Code網站](https://code.visualstudio.com/)下載適合你的電腦作業系統的版本，然後安裝它。

Visual Studio Code編輯程式並不是那種一安裝好就有完整功能的工具，它需要要安裝額外不少的套件才能用來開發React。

> 註: 你也可以使用Sublime Text3、Atom或是WebStorm來開發，或是其他你熟悉的JavaScript程式語言開發工具。Facebook有另一套[Nuclide](https://nuclide.io/)開發工具，不過裡面的部份功能在Windows上還不支援。

## 撰寫第一支React程式

打開Atom編輯程式，把React樣版文件的解壓縮目錄加到目前工作的視窗，加入專案的目錄中。

點開樹狀目錄中的src資料夾，裡面有兩個程式碼檔案，一個是index.js，另一個是App.js。index.js是我們React應用程式的根執行檔案。用滑鼠左鍵雙點擊把它打開來。裡面的程式碼很簡單，只有以下幾行:

> index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
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

開啟命令列視窗，切換到my-app目錄後，輸入`npm start`(或`yarn start`)啟動伺服器，然後用瀏覽器開啟`http://localhost:3000`，看能不能看到結果。

試著改變"今天就開始學React!"這行字，看網頁上的結果會不會也跟著改變。

如果你都能正確看到結果，那麼恭喜你進入React開發的大門！
