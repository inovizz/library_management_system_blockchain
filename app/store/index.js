import { createStore, compose, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'

const defaultState = {
  accounts: [],
  ownerDetails : {},
  error: null,
  loading: true,
  books: [],
  myBooks : []
}

const store = createStore(rootReducer, defaultState, applyMiddleware(thunk))

export default store
