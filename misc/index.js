for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i); // 輸出 0, 1, 2, 3, 4
  }, 100);
}

for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i); // 輸出 5次的5
  }, 100);
}
