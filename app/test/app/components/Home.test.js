import React from 'react'
import { shallow } from 'enzyme'
import { Home, mapStateToProps } from '../../../components/Home'
import Banner from '../../../components/Banner'
import SearchBook from '../../../components/SearchBook'
import Book from '../../../components/Book'

describe('Home',() => {
  let component, props;
  beforeEach(() => {
    props = {
      books: {
        allBooks : [{ title: 'MyBook' }],
        filteredBooks: [],
        value: false
      },
      ownerDetails: {},
      filteredBooks: [],
      loading: {},
      session: {
        authenticated: true,
        user: {
          account : '0x0'
        }
      },
      isExistingMember: {
        callbackFn: jest.fn(),
        argsArr: []
      },
      accounts: {},
      searchBook: jest.fn(),
      rateBook: jest.fn(),
      openModal: jest.fn(),
      closeModal: jest.fn(),
      getMemberDetailsByEmail: jest.fn()
    }
    component = shallow(<Home {...props} />)
  })
  it('mapStateToProps',() => {
    const state = {
      books: {},
      session: {
        user : {}
      },
      filteredBooks: {},
      loading: {},
      isExistingMember: {},
      accounts: {}
    }
    expect(mapStateToProps(state)).toEqual({
      books: {},
      session: {
        user : {}
      },
      ownerDetails: {},
      filteredBooks: {},
      loading: {},
      isExistingMember: {},
      accounts: {}
    })
  })
  describe('componentWillReceiveProps',() => {
    it('should execute callbackFn',() => {
      component.instance().componentWillReceiveProps(props)
      expect(props.isExistingMember.callbackFn.mock.calls.length).toBe(1)
    })
    it('should not execute callbackFn, when user is not authenticated',() => {
      props.session.authenticated = false
      component.instance().componentWillReceiveProps(props)
      expect(props.isExistingMember.callbackFn.mock.calls.length).toBe(0)
    })
    it('should not execute callbackFn, when user\'s account is not fetched',() => {
      props.session.user.account = undefined
      component.instance().componentWillReceiveProps(props)
      expect(props.isExistingMember.callbackFn.mock.calls.length).toBe(0)
    })
  })
  it('SearchBook',() => {
    component.find(SearchBook).props().searchBook()
    expect(props.searchBook.mock.calls.length).toBe(1)
  })
  it('Book',() => {
    expect(component.find(Book).exists()).toBe(true)
  })
  describe('Book',() => {
    let BookInstance;
    beforeEach(() => {
      BookInstance = component.find(Book).props()
    })
    it('No Book if books not present',() => {
      props.books.allBooks = []
      component = shallow(<Home {...props} />)
      expect(component.find(Book).exists()).toBe(false)
    })
    it('No Book if value is true, filteredBooks is not present',() => {
      props.books.value = true
      props.books.filteredBooks = []
      component = shallow(<Home {...props} />)
      expect(component.find(Book).props().books).toEqual([])
    })
    it('Book if value is true, filteredBooks is present',() => {
      props.books.value = true
      props.books.filteredBooks = [{ title: 'mybook' }]
      component = shallow(<Home {...props} />)
      expect(component.find(Book).exists()).toBe(true)
    })
    it('should call rateBook',() => {
      BookInstance.rateBook()
      expect(props.rateBook.mock.calls.length).toBe(1)
    })
    it('should call getMemberDetailsByEmail',() => {
      BookInstance.getMemberDetailsByEmail()
      expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(1)
    })
    describe('rateModalIsOpen',() => {
      beforeEach(() => {
        BookInstance.openModal('rateBook')
      })
      it('should set rateModalIsOpen to true',() => {
        expect(component.state().rateModalIsOpen).toBe(true)
      })
      it('should set rateModalIsOpen to false',() => {
        BookInstance.closeModal('rateBook')
        expect(component.state().rateModalIsOpen).toBe(false)
      })
    })
    describe('bookModalIsOpen',() => {
      beforeEach(() => {
        BookInstance.openModal('bookModal')
      })
      it('should set bookModalIsOpen to true',() => {
        expect(component.state().bookModalIsOpen).toBe(true)
      })
      it('should set bookModalIsOpen to false',() => {
        BookInstance.closeModal('bookModal')
        expect(component.state().bookModalIsOpen).toBe(false)
      })
    })
  })
  it('Book is loading',() => {
    props.books.allBooks = []
    props.loading.allbooksloading = true
    component = shallow(<Home {...props} />)
    expect(component.find(Book).exists()).toBe(false)
  })
  it('No books',() => {
    props.books.allBooks = []
    props.loading.allbooksloading = false
    component = shallow(<Home {...props} />)
    expect(component.contains(<div className='col-md-12'>No Books Added</div>)).toBe(true)
  })
  describe('Members',() => {
    it('No accounts',() => {
      props.accounts = undefined
      component = shallow(<Home {...props} />)
      expect(component.find(Book).props().members).toEqual('')
    })
    it('No Members',() => {
      props.accounts = { members: undefined }
      component = shallow(<Home {...props} />)
      expect(component.find(Book).props().members).toEqual('')
    })
    it('No Members',() => {
      props.accounts = { members: { '0x0': { name: 'User' } } }
      component = shallow(<Home {...props} />)
      expect(component.find(Book).props().members).toEqual(props.accounts.members)
    })
  })
})
