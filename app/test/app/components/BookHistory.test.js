import React from 'react'
import { shallow } from 'enzyme'
import { BookHistory, mapStateToProps } from '../../../components/BookHistory'
import BookRecord from '../../../components/utils/BookRecord'

describe('BookHistory', () => {
  let component, props;

  beforeEach(() => {
    props = {
      book_history: {
        borrow_history: {
          0: {
            timestamp: '1496041895',
            borrower: '0x0'
          }
        },
        return_history: {
          0: {
            timestamp: '1496041895',
            borrower: '0x0'
          }
        }
      },
      members: {
        '0x0': {
          name: 'User'
        }
      },
      book: {
        id: '0'
      },
      borrowEvent: jest.fn(),
      returnEvent: jest.fn()
    }
    component = shallow(<BookHistory {...props} />)
  })
  it('mapStateToProps', () => {
    const state = {
      book_history: props.book_history
    }
    expect(mapStateToProps(state)).toEqual({ book_history: props.book_history })
  })
  describe('componentDidMount',() => {
    it('history is present',() => {
      component.instance().componentDidMount()
      expect(props.borrowEvent.mock.calls.length).toBe(0)
      expect(props.returnEvent.mock.calls.length).toBe(0)
    })
    it('book history is not present',() => {
      props.book_history = undefined
      component = shallow(<BookHistory {...props} />)
      component.instance().componentDidMount()
      expect(props.borrowEvent.mock.calls.length).toBe(1)
      expect(props.returnEvent.mock.calls.length).toBe(1)
    })
    it('book history is present, but borrow_history/return_history is not',() => {
      props.book.id = '1'
      component = shallow(<BookHistory {...props} />)
      component.instance().componentDidMount()
      expect(props.borrowEvent.mock.calls.length).toBe(1)
      expect(props.returnEvent.mock.calls.length).toBe(1)
    })
  })
})
