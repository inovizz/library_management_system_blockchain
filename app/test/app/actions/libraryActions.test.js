import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../../actions/libraryActions'
import actionType from '../../../actions/actionTypes'
import nock from 'nock'

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

describe('libraryActions', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  // GET_ACCOUNTS_LOADING actions to be invoked when action is invoked
  it('should create action when action function is invoked', () => {
    const expected = {
      type: actionType.GET_ACCOUNTS_LOADING,
      payload: true
    }
    expect(actions.action(actionType.GET_ACCOUNTS_LOADING, true)).toEqual(expected)
  })
  // SEARCH_BOOK actions to be invoked when searchBook is invoked
  it('should create SEARCH_BOOK action when searchBook function is invoked', () => {
    const expected = {
      type: actionType.SEARCH_BOOK,
      payload: []
    }
    expect(actions.action(actionType.SEARCH_BOOK, [])).toEqual(expected)
  })
  //  TODO : Async Actions testing for web3.js
})
