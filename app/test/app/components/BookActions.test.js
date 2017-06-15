import React from 'react'
import { shallow } from 'enzyme'
import { BookAction } from '../../../components/BookAction'

describe('BookAction', () => {
  let component, props;
  beforeEach(() => {
    props = {
      btnTitle: 'Borrow',
      isOwner: false,
      members: {
        '0x1': {
          name: 'Owner',
          email: 'owner@example.com'
        },
        '0x2': {
          name: 'User',
          email: 'borrower@example.com'
        }
      },
      book: {
        title: 'BookTitle',
        author: 'BookAuthor',
        publisher: 'BookPublisher',
        state: '0',
        owner: '0x1',
        dateIssued: '0',
        borrower: '0x2'
      },
      ownerDetails: {
        name: 'User',
        account: '0x2'
      },
      closeModal: jest.fn(),
      borrowBook: jest.fn(),
      returnBook: jest.fn()
    }
    Date.now = jest.fn(() => 1496041895220)
    component = shallow(<BookAction {...props} />)
  })

  it('should have a close icon',() => {
    expect(component.find('.close-btn').exists()).toEqual(true)
  })

  it('should close modal on click of close-btn',() => {
    component.find('.close-btn').simulate('click')
    expect(props.closeModal.mock.calls.length).toBe(1)
  })

  describe('User clicks on Borrow button', () => {
    beforeEach(() => {
      component = shallow(<BookAction {...props} />)
    })
    it('should have "Borrow Book" title', () => {
      expect(component.find('legend').text()).toEqual('Borrow Book - BookTitle')
    })
    it('should have correct information for borrower', () => {
      expect(component.find('p.lead').text()).toEqual('Please contact the book owner for pick up.')
    })
    it('should have correct book details', () => {
      const expected = (
        <tbody>
          <tr>
            <td>Name</td>
            <td>Owner</td>
          </tr>
          <tr>
            <td>Email</td>
            <td><a href='mailto:owner@example.com'>owner@example.com</a></td>
          </tr>
          <tr>
            <td>Due Date</td>
            <td>Thu Jun 08 2017</td>
          </tr>
        </tbody>
      )
      expect(component.contains(expected)).toEqual(true)
    })
    it('should display "Borrow" text in button', () => {
      expect(component.find('button').nodes[0].props.children).toEqual('Borrow')
    })
    it('should display "Close" text in button', () => {
      expect(component.find('button').nodes[1].props.children).toEqual('Close')
    })
    it('should submit the form',() => {
      const e = { preventDefault: jest.fn() }
      component.find('form').simulate('submit', e)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.borrowBook.mock.calls.length).toBe(1)
      expect(e.preventDefault.mock.calls.length).toBe(1)
    })
    it('should close modal on click of Close button',() => {
      component.find('.closeBtn').simulate('click')
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
  })

  describe('Borrower clicks on Return button', () => {
    beforeEach(() => {
      props.book.state = '1'
      props.book.dateIssued = '1496041895'
      component = shallow(<BookAction {...props} />)
    })
    it('should have "Return Book" title', () => {
      expect(component.find('legend').text()).toEqual('Return Book - BookTitle')
    })
    it('should have correct information for borrower', () => {
      expect(component.find('p.lead').text()).toEqual('Please return book to the owner.')
    })
    it('should have correct book details', () => {
      const expected = (
        <tbody>
          <tr>
            <td>Name</td>
            <td>Owner</td>
          </tr>
          <tr>
            <td>Email</td>
            <td><a href='mailto:owner@example.com'>owner@example.com</a></td>
          </tr>
          <tr>
            <td>Due Date</td>
            <td>Thu Jun 08 2017</td>
          </tr>
        </tbody>
      )
      expect(component.contains(expected)).toEqual(true)
    })
    it('should display "Close" text in button', () => {
      expect(component.find('button').nodes[0].props.children).toEqual('Close')
    })
    it('should submit the form',() => {
      const e = { preventDefault: jest.fn() }
      component.find('form').simulate('submit', e)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(e.preventDefault.mock.calls.length).toBe(1)
    })
  })

  describe('Owner clicks on Return button', () => {
    beforeEach(() => {
      props.book.state = '1'
      props.ownerDetails = { name: 'Owner', account: '0x1' }
      props.book.dateIssued = '1496041895'
      component = shallow(<BookAction {...props} />)
    })
    it('should have "Return Book" title', () => {
      expect(component.find('legend').text()).toEqual('Return Book - BookTitle')
    })
    it('should have correct information for borrower', () => {
      expect(component.find('p.lead').text()).toEqual('Click "Return" to confirm that the book has been returned to you.')
    })
    it('should have correct book details', () => {
      const expected = (
        <tbody>
            <tr>
              <td>Book Title</td>
              <td>BookTitle</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>BookAuthor</td>
            </tr>
            <tr>
              <td>Publisher</td>
              <td>BookPublisher</td>
            </tr>
              <tr>
                <td>Borrowed By</td>
                <td>{props.members[props.book.borrower].name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td><a href={'mailto:'+props.members[props.book.borrower].email}>{props.members[props.book.borrower].email}</a></td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>Thu Jun 08 2017</td>
              </tr>
            </tbody>
      )
      expect(component.contains(expected)).toEqual(true)
    })
    it('should display "Return" text in button', () => {
      expect(component.find('button').nodes[0].props.children).toEqual('Return')
    })
    it('should display "Close" text in button', () => {
      expect(component.find('button').nodes[1].props.children).toEqual('Close')
    })
    it('should submit the form',() => {
      const e = { preventDefault: jest.fn() }
      component.find('form').simulate('submit', e)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.returnBook.mock.calls.length).toBe(1)
      expect(e.preventDefault.mock.calls.length).toBe(1)
    })
    it('should close modal on click of Close button',() => {
      component.find('.closeBtn').simulate('click')
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
  })

})
