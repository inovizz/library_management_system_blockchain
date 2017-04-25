import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../../actions/libraryActions'
import nock from 'nock'

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

describe('libraryActions', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  // GET_ACCOUNTS_LOADING actions to be invoked when getAccounts starts loading
  it('should create GET_ACCOUNTS_LOADING when getAccounts actions in invoked', () => {
    const expected = {
      type: 'GET_ACCOUNTS_LOADING',
      payload: true
    }
    expect(actions.getAccountsLoading(true)).toEqual(expected)
  })
  // GET_ACCOUNTS_ERROR actions to be invoked when getAccounts finish loading amd throws error
  it('should create GET_ACCOUNTS_ERROR when getAccounts actions in invoked', () => {
    const expected = {
      type: 'GET_ACCOUNTS_ERROR',
      payload: 'error'
    }
    expect(actions.getAccountsError('error')).toEqual(expected)
  })
  // GET_ACCOUNTS_SUCCESS actions to be invoked when getAccounts finish loading
  it('should create GET_ACCOUNTS_SUCCESS when getAccounts actions in invoked', () => {
    const expected = {
      type: 'GET_ACCOUNTS_SUCCESS',
      payload: ['0xb']
    }
    expect(actions.getAccountsSuccess(['0xb'])).toEqual(expected)
  })
  // GET_ALL_BOOKS_LOADING actions to be invoked when getAllBooks starts loading
  it('should create GET_ALL_BOOKS_LOADING when getAllBooks actions in invoked', () => {
    const expected = {
      type: 'GET_ALL_BOOKS_LOADING',
      payload: true
    }
    expect(actions.getAllBooksLoading(true)).toEqual(expected)
  })
  // GET_ACCOUNTS_ERROR actions to be invoked when getAllBooks finish loading amd throws error
  it('should create GET_ALL_BOOKS_ERROR when getAllBooks actions in invoked', () => {
    const expected = {
      type: 'GET_ALL_BOOKS_ERROR',
      payload: 'error'
    }
    expect(actions.getAllBooksError('error')).toEqual(expected)
  })
  // GET_ALL_BOOKS_SUCCESS actions to be invoked when getAllBooks finish loading
  it('should create GET_ALL_BOOKS_SUCCESS when getAllBooks actions in invoked', () => {
    const expected = {
      type: 'GET_ALL_BOOKS_SUCCESS',
      payload: ['0xb']
    }
    expect(actions.getAllBooksSuccess(['0xb'])).toEqual(expected)
  })
  // GET_MY_BOOKS_LOADING actions to be invoked when getMyBooks starts loading
  it('should create GET_MY_BOOKS_LOADING when getMyBooks actions in invoked', () => {
    const expected = {
      type: 'GET_MY_BOOKS_LOADING',
      payload: true
    }
    expect(actions.getMyBooksLoading(true)).toEqual(expected)
  })
  // GET_ACCOUNTS_ERROR actions to be invoked when getMyBooks finish loading amd throws error
  it('should create GET_MY_BOOKS_ERROR when getMyBooks actions in invoked', () => {
    const expected = {
      type: 'GET_MY_BOOKS_ERROR',
      payload: 'error'
    }
    expect(actions.getMyBooksError('error')).toEqual(expected)
  })
  // GET_MY_BOOKS_SUCCESS actions to be invoked when getMyBooks finish loading
  it('should create GET_MY_BOOKS_SUCCESS when getMyBooks actions in invoked', () => {
    const expected = {
      type: 'GET_MY_BOOKS_SUCCESS',
      payload: ['0xb']
    }
    expect(actions.getMyBooksSuccess(['0xb'])).toEqual(expected)
  })
  //  TODO : Async Actions testing for web3.js
})
