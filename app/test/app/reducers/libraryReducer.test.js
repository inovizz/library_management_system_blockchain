import { libraryReducer, loadingReducer, errorReducer, ownerDetailsReducer, allBooksReducers, myBooksReducers } from '../../../reducers/libraryReducer'

describe('Reducers', () => {
  describe('libraryReducer', () => {
    it('should return initial state', () => {
      expect(libraryReducer(undefined, {})).toEqual([])
    })
    it('should handle GET_ACCOUNTS_SUCCESS', () => {
      expect(
        libraryReducer(undefined, {
          type: 'GET_ACCOUNTS_SUCCESS',
          payload: [
            '0xb'
          ]
        })).toEqual(['0xb'])
    })
  })
  describe('loadingReducer', () => {
    it('should return initial state', () => {
      expect(loadingReducer(undefined, {})).toEqual([])
    })
    it('should handle GET_ACCOUNTS_LOADING', () => {
      expect(
        loadingReducer(undefined, {
          type: 'GET_ACCOUNTS_LOADING',
          payload: true
        })).toEqual(true)
    })
    it('should handle GET_OWNERDETAILS_LOADING', () => {
      expect(
        loadingReducer(undefined, {
          type: 'GET_OWNERDETAILS_LOADING',
          payload: true
        })).toEqual(true)
    })
    it('should handle GET_ALL_BOOKS_LOADING', () => {
      expect(
        loadingReducer(undefined, {
          type: 'GET_ALL_BOOKS_LOADING',
          payload: true
        })).toEqual(true)
    })
    it('should handle GET_MY_BOOKS_LOADING', () => {
      expect(
        loadingReducer(undefined, {
          type: 'GET_MY_BOOKS_LOADING',
          payload: true
        })).toEqual(true)
    })
  })
  describe('errorReducer', () => {
    it('should return initial state', () => {
      expect(errorReducer(undefined, {})).toEqual([])
    })
    it('should handle GET_ACCOUNTS_ERROR', () => {
      expect(
        errorReducer(undefined, {
          type: 'GET_ACCOUNTS_ERROR',
          payload: 'ERROR'
        })).toEqual('ERROR')
    })
    it('should handle GET_OWNERDETAILS_ERROR', () => {
      expect(
        errorReducer(undefined, {
          type: 'GET_OWNERDETAILS_ERROR',
          payload: 'ERROR'
        })).toEqual('ERROR')
    })
    it('should handle GET_ALL_BOOKS_ERROR', () => {
      expect(
        errorReducer(undefined, {
          type: 'GET_ALL_BOOKS_ERROR',
          payload: 'ERROR'
        })).toEqual('ERROR')
    })
    it('should handle GET_MY_BOOKS_ERROR', () => {
      expect(
        errorReducer(undefined, {
          type: 'GET_MY_BOOKS_ERROR',
          payload: 'ERROR'
        })).toEqual('ERROR')
    })
  })
  describe('ownerDetailsReducer', () => {
    it('should return initial state', () => {
      expect(ownerDetailsReducer(undefined, {})).toEqual({})
    })
    it('should handle GET_OWNERDETAILS_SUCCESS', () => {
      expect(
        ownerDetailsReducer(undefined, {
          type: 'GET_OWNERDETAILS_SUCCESS',
          payload: [
            'Owner',
            'account',
            'status',
            'dateAdded'
          ]
        })).toEqual({
          'name' : 'Owner',
          'account' : 'account',
          'status' : 'status',
          'dateAdded' : 'dateAdded'
        })
    })
  })
  describe('allBooksReducers', () => {
    it('should return initial state', () => {
      expect(allBooksReducers(undefined, {})).toEqual([])
    })
    it('should handle GET_ALL_BOOKS_SUCCESS', () => {
      expect(
        allBooksReducers(undefined, {
          type: 'GET_ALL_BOOKS_SUCCESS',
          payload: [
            '0xb'
          ]
        })).toEqual(['0xb'])
    })
  })
  describe('myBooksReducers', () => {
    it('should return initial state', () => {
      expect(myBooksReducers(undefined, {})).toEqual([])
    })
    it('should handle GET_MY_BOOKS_SUCCESS', () => {
      expect(
        myBooksReducers(undefined, {
          type: 'GET_MY_BOOKS_SUCCESS',
          payload: [
            '1;Title;Author;Publisher;ba21a9b09d528b2e1726d786a1d1b861032dba87;0000000000000000000000000000000000000000;0;1493054441;0'
          ]
        })).toEqual([{
          'id': '1',
          'title': 'Title',
          'author': 'Author',
          'publisher': 'Publisher',
          'owner': '0xba21a9b09d528b2e1726d786a1d1b861032dba87',
          'borrower': '0x0000000000000000000000000000000000000000',
          'state': '0',
          'dateAdded': '1493054441',
          'dateIssued': '0'
        }])
    })
  })
})
