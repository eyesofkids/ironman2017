// @flow

import {
  TOGGLE_FILTER
} from '../constants/actionTypes'

export default function filterOut(state: {isFilteringOut: boolean} = {isFilteringOut: false}, action: Object) {
  switch (action.type) {
    case TOGGLE_FILTER:
      {
        return { isFilteringOut: !state.isFilteringOut }
      }

    default:
      return state
  }
}
