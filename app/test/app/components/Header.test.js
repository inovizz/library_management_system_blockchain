import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../../components/Header'
import OwnerDetails from '../../../components/OwnerDetails'

describe('Header', () => {
  let component, props
  beforeEach(() => {
    props = {
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      session: {
        authenticated: false,
        user: ''
      },
      accounts: {},
      logout: jest.fn()
    }
    component = shallow(<Header {...props}/>)
  })
  it('has a navbar brand', () => {
    expect(component.find('.navbar-brand').exists()).toEqual(true)
  })
  it('has a company logo', () => {
    expect(component.find('img').props().src).toEqual('test_file_stub')
  })
  it('has a li',() => {
    expect(component.find('li').length).toEqual(2)
  })
  it('has a login class',() => {
    expect(component.find('.glyphicon-user').exists()).toEqual(true)
  })

  describe('User not authenticated', () => {
    it('should run loginSuccess when login is successfull', () => {
      component.find('.btn').simulate('success')
      expect(props.loginSuccess.mock.calls.length).toBe(1)
    })
    it('should run loginFailure when login fails', () => {
      component.find('.btn').simulate('failure')
      expect(props.loginFailure.mock.calls.length).toBe(1)
    })
  })

  describe('User is authenticated', () => {
    beforeEach(() => {
      props.session.authenticated = true
      component = shallow(<Header {...props} />)
    })
    it('should logout user', () => {
      component.find(OwnerDetails).props().logout()
      expect(props.logout.mock.calls.length).toBe(1)
    })
  })
})
