// @flow
import { SEARCH_ITEMS } from '../constants/actionTypes'

export default function searchedKeyword(state: { keyword: string } = { keyword: '' }, action: Object) {
  switch (action.type) {
    case SEARCH_ITEMS:
      {
        return Object.assign({}, {keyword: action.payload.keyword})
      }

    default:
      return state
  }
}
