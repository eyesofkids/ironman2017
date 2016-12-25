# Redux篇 - 第一次使用於React元件


##

一樣是使用ES6的樣版文件，額外再安裝react與react-dom套件。

```
npm i --save react react-dom
```

```
npm i babel-preset-react --save-dev
```

```
{
  "presets": [
    "latest",
    "stage-0",
    "react"
  ],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

```
[1, 2, 3, 4]reduce(( max, cur ) => Math.max( max, cur ))
```
