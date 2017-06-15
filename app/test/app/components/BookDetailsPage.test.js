import React from 'react'
import { shallow } from 'enzyme'
import Modal from 'react-modal'
import { BookDetailsPage, mapStateToProps } from '../../../components/BookDetailsPage'
import BookInfo from '../../../components/utils/BookInfo'
import CommentList from '../../../components/utils/CommentList'
import RateBook from '../../../components/RateBook'
import BooksForm from '../../../components/BooksForm'
import BookAction from '../../../components/BookAction'

describe('BookDetailsPage',() => {
  let component, props;
  beforeEach(() => {
    props = {
      accounts: { members: { '0x0': { name: 'User' } } },
      books: { allBooks: [{ title: 'Book', id: '1', comments:['c'] }] },
      match: { params: { id: '1' } },
      loading: { rateBookLoading: false },
      session: { authenticated: true,
        user: {
          account: '0x0'
        }
      },
      isExistingMember: {
        callbackFn: jest.fn()
      },
      rateBook: jest.fn(),
      getMemberDetailsByEmail: jest.fn()
    }
    component = shallow(<BookDetailsPage {...props} />)
  })
  it('mapStateToProps',() => {
    const state = { accounts: props.accounts, books: props.books }
    expect(mapStateToProps(state)).toEqual({ accounts: props.accounts, books: props.books })
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
  describe('RateModal', () => {
    beforeEach(() => {
      component.instance().toggleModal('rateBook', {})
    })
    it('should closeModal onRequestClose',() => {
      component.find(Modal).first().props().onRequestClose()
      expect(component.state().rateModalIsOpen).toBe(false)
    })
    it('should run rateBook',() => {
      component.find(RateBook).props().rateBook()
      expect(props.rateBook.mock.calls.length).toBe(1)
    })
    it('should run closeModal',() => {
      component.find(RateBook).props().closeModal()
      expect(component.state().rateModalIsOpen).toBe(false)
    })
  })
  describe('BookAction Modal', () => {
    beforeEach(() => {
      component.instance().toggleModal('bookModal', {})
    })
    it('should closeModal onRequestClose',() => {
      component.find(Modal).nodes[1].props.onRequestClose()
      expect(component.state().bookModalIsOpen).toBe(false)
    })
    it('should run closeModal',() => {
      component.find(BookAction).props().closeModal()
      expect(component.state().bookModalIsOpen).toBe(false)
    })
  })
  describe('Edit Book Modal', () => {
    beforeEach(() => {
      component.instance().toggleModal('editBook', {})
    })
    it('should closeModal onRequestClose',() => {
      component.find(Modal).last().props().onRequestClose()
      expect(component.state().editBookModalIsOpen).toBe(false)
    })
    it('should run closeModal',() => {
      component.find(BooksForm).props().closeModal()
      expect(component.state().editBookModalIsOpen).toBe(false)
    })
  })
  describe('BookInfo', () => {
    it('should have a BookInfo Component', () => {
      expect(component.find(BookInfo).exists()).toBe(true)
    })
    it('should execute getMemberDetailsByEmail', () => {
      component.find(BookInfo).props().getMemberDetailsByEmail()
      expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(1)
    })
    it('should set bookModalIsOpen to true', () => {
      component.find(BookInfo).props().openModal('bookModal')
      expect(component.state().bookModalIsOpen).toBe(true)
    })
  })
  it('should have a CommentList Component', () => {
    expect(component.find(CommentList).exists()).toBe(true)
  })
  it('No Books matching id',() => {
    props.match.params.id = '2'
    component = shallow(<BookDetailsPage {...props} />)
    expect(component.find(BookInfo).exists()).toBe(false)
    expect(component.find(CommentList).exists()).toBe(false)
  })
  it('comments undefined',() => {
    props.books.allBooks[0].comments = undefined
    component = shallow(<BookDetailsPage {...props} />)
    expect(component.find(BookInfo).exists()).toBe(true)
    expect(component.find(CommentList).exists()).toBe(false)
  })
  it('No Comments',() => {
    props.books.allBooks[0].comments = []
    component = shallow(<BookDetailsPage {...props} />)
    expect(component.find(BookInfo).exists()).toBe(true)
    expect(component.find(CommentList).exists()).toBe(false)
  })
  it('No Account',() => {
    props.accounts = undefined
    component = shallow(<BookDetailsPage {...props} />)
    expect(component.find(CommentList).props().members).toBe('')
  })
  describe('getUserRating',() => {
    let selectedBook, ownerDetails;
    beforeEach(() => {
      selectedBook = {}
      ownerDetails = {}
    })
    it('No book selected',() => {
      selectedBook = undefined
      expect(component.instance().getUserRating(selectedBook, ownerDetails)).toBe(0)
    })
    it('No ratings available',() => {
      selectedBook.ratings = undefined
      expect(component.instance().getUserRating(selectedBook, ownerDetails)).toBe(0)
    })
    it('No reviewers available',() => {
      selectedBook.ratings = [0]
      selectedBook.reviewers = undefined
      expect(component.instance().getUserRating(selectedBook, ownerDetails)).toBe(0)
    })
    it('Should return user ratings',() => {
      selectedBook.ratings = [5]
      selectedBook.reviewers = ['0x0']
      ownerDetails.account = '0x0'
      expect(component.instance().getUserRating(selectedBook, ownerDetails)).toBe(5)
    })
  })
})
