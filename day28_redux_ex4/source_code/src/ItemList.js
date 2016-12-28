// @flow

import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './action'

const ItemList = (props: any) => {
  // 解構賦值，提取props中的items項目值，
  // 以及onItemDel方法
  const { items, onItemDel } = props

  return (
      <p>
        {
          items.map(item => (
            <li key={item.id}>
              <input
                type="checkbox"
                id={item.id}
                onClick={ () => onItemDel(item.id) }
              />
              {item.text}
            </li>
          ))
        }
      </p>
  )
}

// 準備綁定用的mapStateToProps方法，
// 將store中的items屬性綁到這個元件的props.items屬性上
const mapStateToProps = store => ({ items: store.items })

// 連接Redux store
export default connect(mapStateToProps, actionCreators)(ItemList)
