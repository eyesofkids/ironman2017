// @flow
import { SORT_ITEMS } from '../constants/actionTypes'

export default function sortType(state: { direction: string } = { direction: 'no' }, action: Object) {
  switch (action.type) {
    case SORT_ITEMS:
      {
        return Object.assign({}, {direction: action.payload.direction})
      }

    default:
      return state
  }
}
