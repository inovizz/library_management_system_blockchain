import React from 'react'
import { shallow } from 'enzyme'
import { Dashboard, mapStateToProps } from '../../../components/Dashboard'
import Book from '../../../components/Book'
import Loader from '../../../components/Loader'
import BooksForm from '../../../components/BooksForm'
import Modal from 'react-modal'

describe('Dashboard', () => {
  let component, props
  beforeEach(() => {
    props = {
      allBooks: [],
      ownerDetails: { account: '0x1' },
      loading: {
        allbooksloading: true,
        addBooksLoading: false,
        returnBooksLoading: false,
        rateBookLoading: false
      },
      session: {
        user: { account: '0x1' }
      },
      error: {},
      accounts: null,
      rateBook: jest.fn(),
      getAllBooks: jest.fn(),
      getAllMembers: jest.fn()
    }
    component = shallow(<Dashboard {...props} />)
  })

  it('mapStateToProps',() => {
    const state = {
      books : {
        allBooks: props.allBooks
      },
      session: {
        user: props.ownerDetails
      },
      loading: props.loading,
      error: {},
      accounts: null
    }
    const expected = mapStateToProps(state)
    expect(expected).toEqual({
      allBooks: props.allBooks,
      ownerDetails: props.ownerDetails,
      loading: props.loading,
      session: props.session,
      error: {},
      accounts: null
    })
  })

  describe('componentDidMount',() => {
    describe('Books and Members empty',() => {
      beforeEach(() => {
        component.instance().componentDidMount();
      })
      it('should run getAllBooks', () => {
        expect(props.getAllBooks.mock.calls.length).toBe(1)
      })
      it('should run getAllMembers', () => {
        expect(props.getAllMembers.mock.calls.length).toBe(1)
      })
    })
    describe('Books and Members present',() => {
      beforeEach(() => {
        props.allBooks.push({title:'Book'})
        props.accounts = {}
        component = shallow(<Dashboard {...props} />)
        component.instance().componentDidMount();
      })
      it('should not run getAllBooks', () => {
        expect(props.getAllBooks.mock.calls.length).toBe(0)
      })
      it('should not run getAllMembers', () => {
        expect(props.getAllMembers.mock.calls.length).toBe(0)
      })
    })
  })

  describe('renderLoading', () => {
    it('should show loaded with text "Loading Books"',() => {
      expect(component.find(Loader).props().text).toBe('Loading Books')
    })
    it('should show loaded with text "Adding book..."',() => {
      props.loading.allbooksloading = false
      props.loading.addBooksLoading = true
      component = shallow(<Dashboard {...props} />)
      expect(component.find(Loader).props().text).toBe('Adding book...')
    })
    it('should show loaded with text "Returning Book"',() => {
      props.loading.allbooksloading = false
      props.loading.returnBooksLoading = true
      component = shallow(<Dashboard {...props} />)
      expect(component.find(Loader).props().text).toBe('Returning Book')
    })
    it('should show loaded with text "Submitting Rating"',() => {
      props.loading.allbooksloading = false
      props.loading.rateBookLoading = true
      component = shallow(<Dashboard {...props} />)
      expect(component.find(Loader).props().text).toBe('Submitting Rating')
    })
    it('should show loaded with text "Fetching details from library"',() => {
      props.loading.allbooksloading = false
      component = shallow(<Dashboard {...props} />)
      expect(component.find(Loader).exists()).toEqual(false)
    })
  })

  describe('Add Book', () => {
    beforeEach(() => {
      component.find('.add-btn button').simulate('click')
    })
    it('should open addBook modal', () => {
      expect(component.state().modalIsOpen).toBe(true)
    })
    it('should close addBook modal', () => {
      component.find(BooksForm).props().closeModal()
      expect(component.state().modalIsOpen).toBe(false)
    })
    it('should close addBook modal', () => {
      component.find(Modal).first().props().onRequestClose()
      expect(component.state().modalIsOpen).toBe(false)
    })
  })

  describe('My Books',() => {
    beforeEach(() => {
      props.allBooks = [{ owner: '0x1' }]
      component = shallow(<Dashboard {...props} />)
    })
    it('should rateBook',() => {
      component.find(Book).first().props().rateBook()
      expect(props.rateBook.mock.calls.length).toBe(1)
    })

    describe('rateModal', () => {
      beforeEach(() => {
        component.find(Book).first().props().openModal('rateBook',{})
      })
      it('should open rateModal',() => {
        expect(component.state().rateModalIsOpen).toBe(true)
      })
      it('should close rateModal',() => {
        component.find(Book).first().props().closeModal('rateBook')
        expect(component.state().rateModalIsOpen).toBe(false)
      })
      it('should have no members',() => {
        expect(component.find(Book).first().props().members).toBe('')
      })
      it('should have members',() => {
        props.accounts = { members: {} }
        component = shallow(<Dashboard {...props} />)
        expect(component.find(Book).first().props().members).toEqual({})
      })
    })

    describe('bookModal', () => {
      beforeEach(() => {
        component.find(Book).first().props().openModal('bookModal',{})
      })
      it('should open bookModal',() => {
        expect(component.state().bookModalIsOpen).toBe(true)
      })
      it('should close bookModal',() => {
        component.find(Book).first().props().closeModal('bookModal')
        expect(component.state().bookModalIsOpen).toBe(false)
      })
    })

  })

  describe('Borowed Books',() => {
    beforeEach(() => {
      props.allBooks = [{ borrower: '0x1' }]
      component = shallow(<Dashboard {...props} />)
    })
    it('should rateBook',() => {
      component.find(Book).last().props().rateBook()
      expect(props.rateBook.mock.calls.length).toBe(1)
    })

    describe('rateModal', () => {
      beforeEach(() => {
        component.find(Book).last().props().openModal('rateBook',{})
      })
      it('should open rateModal',() => {
        expect(component.state().rateModalIsOpen).toBe(true)
      })
      it('should close rateModal',() => {
        component.find(Book).last().props().closeModal('rateBook')
        expect(component.state().rateModalIsOpen).toBe(false)
      })
    })

    describe('bookModal', () => {
      beforeEach(() => {
        component.find(Book).last().props().openModal('bookModal',{})
      })
      it('should open bookModal',() => {
        expect(component.state().bookModalIsOpen).toBe(true)
      })
      it('should close bookModal',() => {
        component.find(Book).last().props().closeModal('bookModal')
        expect(component.state().bookModalIsOpen).toBe(false)
      })
    })

  })
})
