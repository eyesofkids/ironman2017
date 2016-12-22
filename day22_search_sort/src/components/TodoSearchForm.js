//@flow
import React from 'react'

//匯入Props靜態類型的定義
import type { TodoSearchFormProps } from '../definitions/TodoTypeDefinition.js'

const TodoSearchForm = ({ placeholderText, onItemSearch }: TodoSearchFormProps) => {

  //給Flow檢查用的，這個參照值一開始都是null，渲染前是不確定值，所以用any
  let titleField: any = null

  //一個用於記錄composition狀態用的
  let isOnComposition: boolean = false
  
  //檢查是否為chrome瀏覽器
  //http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  const isChrome = !!window.chrome && !!window.chrome.webstore
  
  const handleComposition  = (e: KeyboardEvent) => {
   if(e.type === 'compositionend'){
      
      //composition結束，代表中文輸入完成
      isOnComposition = false

      //修正Chrome v53之後的事件觸發順序問題
      //https://chromium.googlesource.com/chromium/src/+/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/
      if (e.target instanceof HTMLInputElement && !isOnComposition && isChrome) {  
         //進行搜尋         
         onItemSearch(titleField.value)
      } 

    } else {
      //composition進行中，代表正在輸入中文
      isOnComposition = true
    }

  }

  return (
    <div>
      <input 
        className="form-control"
        type="text"
        ref={el => { titleField = el }}
        placeholder={placeholderText}
        onCompositionStart={handleComposition} 
        onCompositionUpdate={handleComposition} 
        onCompositionEnd={handleComposition} 
        onChange={(e: KeyboardEvent) => {
            //只有onComposition===false，才作onChange
            if (e.target instanceof HTMLInputElement && !isOnComposition) {  
               //進行搜尋            
              onItemSearch(titleField.value)
            } 
        }
       }
      />
    </div>
  )
}

//匯出TodoSearchForm模組
export default TodoSearchForm
