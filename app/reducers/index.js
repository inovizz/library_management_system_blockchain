import { combineReducers } from 'redux'
import {
  libraryReducer,
  loadingReducer,
  errorReducer,
  allBooksReducers,
  ownerDetailsReducer,
  myBooksReducers
} from './libraryReducer'

const rootReducer = combineReducers({
  accounts: libraryReducer,
  ownerDetails : ownerDetailsReducer,
  loading: loadingReducer,
  error: errorReducer,
  books: allBooksReducers,
  myBooks : myBooksReducers
})

export default rootReducer
