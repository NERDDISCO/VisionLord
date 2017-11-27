import { createStore, combineReducers } from '/libs/redux/index.js'
import * as reducers from './reducers/index.js'

export const store = createStore(
  combineReducers({
    ...reducers
  })
)

// @see https://github.com/tur-nr/polymer-redux#polymerredux
const reduxMixin = PolymerRedux(store)

// ReduxMixin
// @see https://github.com/tur-nr/polymer-redux#redux-mixin
export default reduxMixin