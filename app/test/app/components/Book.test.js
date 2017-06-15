import React from 'react'
import { shallow } from 'enzyme'
import Modal from 'react-modal'
import Book, { isDisabled, getUserRating } from '../../../components/Book'
import RateBook from '../../../components/RateBook'
import BookAction from '../../../components/BookAction'

describe('Book', () => {
  let component, props;

  beforeEach(() => {
    props = {
      title : 'My Books',
      books : [{
        'id': '1',
        'title': 'Title',
        'author': 'Author',
        'publisher': 'Publisher',
        'owner': '0xba21a9b09d528b2e1726d786a1d1b861032dba87',
        'borrower': '0x0000000000000000000000000000000000000000',
        'state': '1',
        'dateAdded': '1493054441',
        'dateIssued': '0',
        'avgRating': 4,
        'imageUrl': 'https://images-eu.ssl-images-amazon.com/images/I/416Hql52NCL.jpg',
        'description': 'description'
      }],
      members: {
        '0xba21a9b09d528b2e1726d786a1d1b861032dba87': {
          name: 'Owner'
        },
        '0x0000000000000000000000000000000000000000': {
          name: 'Borrower'
        },
        '0x1': {
          name: ''
        }
      },
      ownerDetails: {},
      selectedBook: {},
      btnTitle: 'Borrow',
      isOwner: false,
      btnFunction : jest.fn(),
      loading : {
        borrowBooksLoading: false,
        returnBooksLoading: false
      },
      rateBook : jest.fn(),
      openModal : jest.fn(),
      closeModal : jest.fn(),
      rateModalIsOpen : false,
      bookModalIsOpen: false,
      authenticated : true,
      getMemberDetailsByEmail: jest.fn()
    }
    component = shallow(<Book {...props} />)
  })
  it('should display modal "Title"', () => {
    expect(component.find('.lead').text()).toBe(props.title)
  })
  it('should have 2 Modals',() => {
    expect(component.find(Modal).length).toBe(2)
  })
  describe('RateModal', () => {
    it('should closeModal onRequestClose',() => {
      component.find(Modal).first().props().onRequestClose()
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
    it('should run rateBook',() => {
      component.find(RateBook).props().rateBook()
      expect(props.rateBook.mock.calls.length).toBe(1)
    })
    it('should run closeModal',() => {
      component.find(RateBook).props().closeModal()
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
  })
  describe('BookAction Modal', () => {
    it('should closeModal onRequestClose',() => {
      component.find(Modal).last().props().onRequestClose()
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
    it('should run closeModal',() => {
      component.find(BookAction).props().closeModal()
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
  })
  describe('getUserRating',() => {
    it('No book selected',() => {
      props.selectedBook = undefined
      expect(getUserRating(props.selectedBook, props.ownerDetails)).toBe(0)
    })
    it('No ratings available',() => {
      props.selectedBook.ratings = undefined
      expect(getUserRating(props.selectedBook, props.ownerDetails)).toBe(0)
    })
    it('No reviewers available',() => {
      props.selectedBook.ratings = [0]
      props.selectedBook.reviewers = undefined
      expect(getUserRating(props.selectedBook, props.ownerDetails)).toBe(0)
    })
    it('Should return user ratings',() => {
      props.selectedBook.ratings = [5]
      props.selectedBook.reviewers = ['0x0']
      props.ownerDetails.account = '0x0'
      expect(getUserRating(props.selectedBook, props.ownerDetails)).toBe(5)
    })
  })
})
