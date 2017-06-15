import React from 'react'
import { shallow } from 'enzyme'
import BookInfo, { getStatus, getTime } from '../../../../components/utils/BookInfo'
import Image from '../../../../components/utils/Image'
import LoginButton from '../../../../components/utils/LoginButton'
import Ratings from '../../../../components/utils/Ratings'

describe('BookInfo', () => {
  let component, props;

  beforeEach(() => {
    props = {
      type: 'info',
      book: {
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
        'description': 'description',
        'reviewersCount': 1
      },
      members: {
        '0xba21a9b09d528b2e1726d786a1d1b861032dba87': {
          name: 'Owner'
        },
        '0x0000000000000000000000000000000000000000': {
          name: 'Borrower'
        },
        '0x1': {
          name: '0xba21a9b09d528b2e1726d786a1d1b861032dba87'
        }
      },
      openModal : jest.fn(),
      authenticated : true,
      getMemberDetailsByEmail: jest.fn(),
      ownerDetails: { account: '0x1' }
    }
    component = shallow(<BookInfo {...props} />)
  })
  it('getStatus',() => {
    expect(getStatus('0')).toBe('Available')
    expect(getStatus('1')).toBe('Borrowed')
    expect(getStatus('2')).toBe('Overdue')
    expect(getStatus('3')).toBe('Lost')
    expect(getStatus('4')).toBe('Removed')
    expect(getStatus('5')).toBe('Not Available')
  })
  it('getTime',() => {
    expect(getTime('1496041895')).toBe('Thu Jun 08 2017')
  })
  it('should display book image', () => {
    expect(component.find(Image).props().src).toEqual(props.book.imageUrl)
  })
  it('should display book title', () => {
    expect(component.find('.media-heading').text()).toEqual(props.book.title)
  })
  it('should display book author', () => {
    expect(component.find('.author').text()).toEqual('by '+props.book.author)
  })
  it('should display book description', () => {
    expect(component.find('.bookDescription').text()).toEqual(props.book.description)
  })
  it('should have Ratings Component', () => {
    expect(component.find(Ratings).exists()).toBe(true)
  })
  describe('Voters Count',() => {
    it('should show singular vote',() => {
      expect(component.find('.ratingContainer span').text().trim()).toEqual('1 vote')
    })
    it('should show votes',() => {
      props.book.reviewersCount = 2
      component = shallow(<BookInfo {...props} />)
      expect(component.find('.ratingContainer span').text().trim()).toEqual('2 votes')
    })
  })
  it('should have 2 LoginButton',() => {
    expect(component.find(LoginButton).length).toBe(2)
  })
  describe('Owner Name',() => {
    let expected
    beforeEach(() => {
      expected = <strong>Owner</strong>
    })
    it('should display Owner name', () => {
      expect(component.contains(expected)).toBe(true)
    })
    it('should not display Owner name if not a member', () => {
      props.book.owner = '0x2'
      component = shallow(<BookInfo {...props}/>)
      expect(component.contains(expected)).toBe(false)
    })
    it('should not display Owner name if member but name is empty', () => {
      props.book.owner = '0x1'
      component = shallow(<BookInfo {...props}/>)
      expect(component.contains(expected)).toBe(false)
    })
  })
  describe('Borrower Name',() => {
    let expected
    beforeEach(() => {
      expected = <strong>Borrower</strong>
    })
    it('should display Owner name', () => {
      expect(component.contains(expected)).toBe(true)
    })
    it('should not display Borrower name if not a member', () => {
      props.book.borrower = '0x2'
      component = shallow(<BookInfo {...props}/>)
      expect(component.contains(expected)).toBe(false)
    })
    it('should not display Borrower name if member but name is empty', () => {
      props.book.borrower = '0x1'
      component = shallow(<BookInfo {...props}/>)
      expect(component.contains(expected)).toBe(false)
    })
  })
  describe('LoginButton (Borrow/Return)', () => {
    it('should run getMemberDetailsByEmail on loginSuccess',() => {
      component.find(LoginButton).first().props().loginSuccess()
      expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(1)
    })
    it('should open bookModal',() => {
      component.find(LoginButton).first().props().success()
      expect(props.openModal.mock.calls.length).toBe(1)
    })
    it('should show error when loginFailure',() => {
      component.find(LoginButton).first().props().loginFailure()
      expect(props.openModal.mock.calls.length).toBe(0)
    })
    it('should be disabled, when user is not book owner/borrower',() => {
      expect(component.find(LoginButton).first().props().disabled).toBe(true)
    })
    it('should not be disabled, if book is available',() => {
      props.book.state = '0'
      component = shallow(<BookInfo {...props} />)
      expect(component.find(LoginButton).first().props().disabled).toBe(false)
    })
    it('should not be disabled, if book is borrowed & user is book owner',() => {
      props.book.owner = props.ownerDetails.account
      props.book.state = '1'
      component = shallow(<BookInfo {...props} />)
      expect(component.find(LoginButton).first().props().disabled).toBe(false)
    })
    it('should not be disabled, if book is borrowed & user is book borrower',() => {
      props.book.borrower = props.ownerDetails.account
      component = shallow(<BookInfo {...props} />)
      expect(component.find(LoginButton).first().props().disabled).toBe(false)
    })
    it('should have buttonText "Return"',() => {
      expect(component.find(LoginButton).first().props().buttonText).toBe('Return')
    })
    it('should have buttonText "Return"',() => {
      props.authenticated = false;
      component = shallow(<BookInfo {...props} />)
      expect(component.find(LoginButton).first().props().buttonText).toBe('Return')
    })
    it('should have buttonText "Borrow"',() => {
      props.book.state = 0;
      component = shallow(<BookInfo {...props} />)
      expect(component.find(LoginButton).first().props().buttonText).toBe('Borrow')
    })
  })
  describe('LoginButton (Rate)', () => {
    it('should run getMemberDetailsByEmail on loginSuccess',() => {
      component.find(LoginButton).last().props().loginSuccess()
      expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(1)
    })
    it('should open bookModal',() => {
      component.find(LoginButton).last().props().success()
      expect(props.openModal.mock.calls.length).toBe(1)
    })
    it('should open bookModal',() => {
      component.find(LoginButton).last().props().success()
      expect(props.openModal.mock.calls.length).toBe(1)
    })
    it('should show error when loginFailure',() => {
      component.find(LoginButton).last().props().loginFailure()
      expect(props.openModal.mock.calls.length).toBe(0)
    })
    it('should not be disabled',() => {
      expect(component.find(LoginButton).last().props().disabled).toBe(false)
    })
  })
  describe('Details',() => {
    beforeEach(() => {
      props.type = 'details'
      component = shallow(<BookInfo {...props} />)
    })
    it('Should have details table',() => {
      expect(component.find('table').exists()).toBe(true)
    })
  })
})
