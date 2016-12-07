## ES6篇 - Class(類別)

本章的目標是提供ES6中的Class(類別)一些廣泛的討論與使用建議。Class(類別)是一個全新的語法，但它的目前整體的內容，還不如像其他以類別為基礎的程式語言，如Java、C++來得完整，還非常的初期與簡單。

在ES6中的Class(類別)語法，並不是真的是以類別為基礎(class-based)的，這是骨子裡還是以原型為基礎(prototype-based)的物件導向特性語法糖。加入Class(類別)語法的目的不是要建立另一套物件導向的繼承模型，而是為了提供更簡潔的語法來作物件建立與繼承，當然，一部份的原因是為了吸引已經具有以類別為基礎的物件導向語言的基礎的開發者，提供另一種在物件導向語法上的選擇性。

類別(Class)是先裡面定義好物件的整體結構藍圖(blue print)，然後再用這個類別定義，以此來產生相同結構的多個的物件實例，類別在定義時並不會直接產生出物件，要經過實體化的過程(`new`運算符)，才會產生真正的物件實體。另外，目前因為類別定義方式還是個很新的語法，在實作時除了比較新的函式庫或框架，才會開始用它來撰寫。以下的為一個簡單範例:

```js
class Player {
    constructor(fullName, age, gender, hairColor) {
        this.fullName = fullName
        this.age = age
        this.gender = gender
        this.hairColor = hairColor
    }

    toString() {
        return 'Name: '+this.fullName+', Age:'+this.age
    }
}

const inori = new Player('Inori', 16, 'girl', 'pink')
console.log(inori.toString())
console.log(inori.fullName)

const tsugumi = new Player('Tsugumi', 14, 'girl', 'purple')
console.log(tsugumi.toString())
```

> 註: 注意類別名稱命名時要使用大駝峰(ClassName)的寫法

下面分別說明一些這個例子中用到的語法與關鍵字的重要概念，以及類別延伸的一些語法。

#### this

在這個物件的類別定義中，我們第一次真正見到`this`關鍵字的用法，`this`簡單的說來，是物件實體專屬的指向變數，`this`指向的就是"這個物件實體"，以上面的例子來說，也就是當物件真正實體化時，`this`變數會指向這個物件實體。`this`是怎麼知道要指到哪一個物件實體？是因為`new`運算符造成的結果。

`this`變數是JavaScript的一個特性，它是隱藏的內部變數之一，當函式呼叫或物件實體化時，都會以這個`this`變數的指向對象，作為執行期間的依據。

還記得我們在函式的章節中，使用作用範圍(Scope)來說明以函式為基礎的檢視角度，在函式區塊中可見的變數與函式的領域的概念。而JavaScript中，另外也有一種上下文環境(Context)的概念，就是對於`this`的在執行期間所依據的影響，即是以物件為基礎的的檢視角度。

`this`也就是執行上下文可以簡單用三個情況來區分:

1. 函式呼叫: 在一般情況下的函式呼叫，`this`通常都指向global物件。這也是預設情況。
2. 建構式(constructor)呼叫: 透過`new`運算符建立物件實體，等於呼叫類型的建構式，`this`會指向新建立的物件實例
3. 物件中的方法呼叫: `this`指向呼叫這個方法的物件實體

所以當建構式呼叫時，也就是使用`new`運算符建立物件時，`this`會指向新建立的物件，也就是下面這段程式碼:

```js
const inori = new Player('Inori', 16, 'girl', 'pink')
```

因此在建構式中的指定值的語句，裡面的`this`值就會指向是這個新建立的物件，也就是`inori`:

```js
constructor(fullName, age, gender, hairColor) {
        this.fullName = fullName
        this.age = age
        this.gender = gender
        this.hairColor = hairColor
    }
```

也就是說在建立物件後，經建構式的執行語句，這個`inori`物件中的屬性值就會被指定完成，所以可以用像下面的語法來存取屬性:

```js
inori.fullName
inori.age
inori.gender
inori.hairColor
```

第3種情況是呼叫物件中的方法，也就是像下面的程式碼中，`this`會指向這個呼叫toString方法的物件，也就是`inori`:

```
inori.toString()
```

對於`this`的說明大致上就是這樣而已，這裡都是很直覺的說明。`this`還有一部份的細節與應用情況，在特性篇中有獨立的一個章節來說明`this`的一些特性與應用情況，`this`的概念在JavaScript中十分重要，初學者真的需要多花點時間才能真正搞懂。

#### 建構式(constructor)

建構式是特別的物件方法，它必會在物件建立時被呼叫一次，通常用於建構新物件中的屬性，以及呼叫上層父母類別(如果有繼承的話)之用。用類別(class)的定義時，物件的屬性都只能在建構式中定義，這與用物件字面的定義方式不同，這一點是要特別注意的。如果物件在初始化時不需要任何語句，那麼就不要寫出這個建構式，實際上類別有預設的建構式，它會自動作建構的工作。

關於建構式或物件方法的多形(polymorphism)或覆蓋(Overriding)，在JavaScript中**沒有**這種特性。建構式是會被限制只能有一個，而在物件中的方法(函式)也沒這個特性，定義同名稱的方法(函式)只會有一個定義被使用。所以如果你需要定義不同的建構式在物件中，因應不同的物件實體的情況，只能用函式的不定傳入參數方式，或是加上傳入參數的預設值來想辦法改寫，請參考函式內容中的說明。以下為一個範例:

```js
class Option {
    constructor(key, value, autoLoad = false) {
        if (typeof key != 'undefined') {
            this[key] = value
        }
        this.autoLoad = autoLoad
    }
}

const op1 = new Option('color', 'red')
const op2 = new Option('color', 'blue', true)
```

#### 私有成員

JavaScript截至ES6標準為止，在類別中並沒有像其他程式語言中的私有的(private)、保護的(protected)、公開的(public)這種成員存取控制的修飾關鍵字詞，基本上所有的類別中的成員都是公開的。雖然也有其他"模擬"出私有成員的方式，不過它們都是複雜的語法，這裡就不說明了。

目前比較簡單常見的區分方式，就是在私有成員(或方法)的名稱前面，加上下底線符號(\_)前綴字，用於區分這是私有的(private)成員，這只是由程式開發者撰寫上的區分差別，與語言本身特性無關，對JavaScript語言來說，成員名稱前有沒有有下底線符號(\_)的，都是視為一樣的變數。以下為簡單範例:

```js
class Student {
    constructor(id, firstName, lastName) {
        this._id = id
        this._firstName = firstName
        this._lastName = lastName
    }

    toString() {
        return 'id is '+this._id+' his/her name is '+this.firstName+' '+this.lastName
    }
}
```

> 註: 如果是私有成員，就不能直接在外部存取，要用getter與setter來實作取得與修改值的方法。私有方法也不能在外部呼叫，只能在類別內部使用。

#### getter與setter

在類別定義中可以使用`get`與`set`關鍵字，作為類別方法的修飾字，可以代表getter(取得方法)與setter(設定方法)。一般的公開的原始資料類型的屬性值(字串、數字等等)，不需要這兩種方法，原本就可以直接取得或設定。只有私有屬性或特殊值，才需要用這兩種方法來作取得或設定。getter(取得方法)與setter(設定方法)的呼叫語法，長得像一般的存取物件成員的語法，都是用句號(.)呼叫，而且setter(設定方法)是用指定值的語法，不是傳入參數的那種語法。以下為範例:

```js
class Option {
    constructor(key, value, autoLoad = false) {
        if (typeof key != 'undefined') {
            this['_' + key] = value;
        }
        this.autoLoad = autoLoad;
    }

    get color() {
      if (this._color !== undefined) {
        return this._color
      } else {
        return 'no color prop'
      }
    }

    set color(value) {
      this._color = value
    }
}

const op1 = new Option('color', 'red')
op1.color = 'yellow'

const op2 = new Option('action', 'run')
op2.color = 'yellow'
```

> 註: 所以getter不會有傳入參數，setter只會有一個傳入參數。

#### 靜態成員

靜態(Static)成員指的是屬於類別的屬性或方法，也就是不論是哪一個被實體化的物件，都共享這個方法或屬性。而且，實際上靜態(Static)成員根本不需要實體化的物件來呼叫或存取，直接用類別就可以呼叫或存取。JavaScript中只有靜態方法，沒有靜態屬性，使用的是`static`作為方法的修飾字詞。以下為一個範例:

```js
class Student {
    constructor(id, firstName, lastName) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName

        //這裡呼叫靜態方法，每次建構出一個學生實體就執行一次
        Student._countStudent()
    }

    //靜態方法的定義
    static _countStudent(){
      if(this._numOfStudents === undefined) {
          this._numOfStudents = 1
      } else {
          this._numOfStudents++
      }
    }

    //用getter與靜態方法取出目前的學生數量
    static get numOfStudents(){
      return this._numOfStudents
    }

}

const aStudent = new Student(11, 'Eddy', 'Chang')
console.log(Student.numOfStudents)

const bStudent = new Student(22, 'Ed', 'Lu')
console.log(Student.numOfStudents)

const cStudent = new Student(33, 'Horward', 'Liu')
console.log(Student.numOfStudents)
```

靜態屬性目前來說有兩種解決方案，一種是使用ES7的Class Properties標準，可以使用`static`關鍵字來定義靜態屬性，另一種是定義到類別原本的定義外面:

```js
// ES7語法方式
class Video extends React.Component {
  static defaultProps = {
    autoPlay: false,
    maxLoops: 10,
  }
  render() { ... }
}
```

```js
// ES6語法方式
class Video extends React.Component {
  constructor(props) { ... }
  render() { ... }
}

Video.defaultProps = { ... }
```

> 註: ES7的靜態(或類別)屬性的轉換，要使用bebal的stage-0 perset。

#### 繼承

用extends關鍵字可以作類別的繼承，而在建構式中會多呼叫一個`super()`方法，用於執行上層父母類別的建構式之用。`super`也可以用於指向上層父母類別，呼叫其中的方法或存取屬性。

繼承時還有有幾個注意的事項:

- 繼承的子類別中的建構式，`super()`需要放在第一行，這是標準的呼叫方式。
- 繼承的子類別中的屬性與方法，都會覆蓋掉原有的在父母類別中的同名稱屬性或方法，要區為不同的屬性或方法要用`super`關鍵字來存取父母類別中的屬性或方法

```js
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.color = color
    }
    toString() {
        return super.toString() + ' in ' + this.color
    }
}
```

## 風格指引

- (Airbnb 22.3) 在命名類別或建構式時，使用大駝峰(PascalCase)命名方式。
- (Airbnb 9.4) 撰寫自訂的toString()方法是很好的，但要確定它是可以運作，而且不會有副作用的。
- (Airbnb 23.3) 如果 屬性/方法 是布林值，使用像isVal()或hasVal()的命名。


http://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/
https://appendto.com/2016/06/why-do-es6-classes-exist-and-why-now/
https://www.sitepoint.com/object-oriented-javascript-deep-dive-es6-classes/
