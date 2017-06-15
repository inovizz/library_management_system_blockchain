import React from 'react'
import { shallow } from 'enzyme'
import LoginButton from '../../../../components/utils/LoginButton'

describe('LoginButton', () => {
  let component, props;
  beforeEach(() => {
    props = {
      authenticated: true,
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      success: jest.fn(),
      className: 'btn',
      disabled: false,
      buttonText: 'Login',
      logo: 'glyphicon'
    }
    component = shallow(<LoginButton {...props} />)
  })

  describe('User is authenticated',() => {
    it('Should have a button',() => {
      expect(component.find('button').exists()).toEqual(true)
    })
    it('Should have a "btn" class',() => {
      expect(component.find('.btn').exists()).toEqual(true)
    })
    it('Should have a "Login" text',() => {
      expect(component.find('.btn').text()).toEqual('Login')
    })
    it('Should not be disabled',() => {
      expect(component.find('.btn').props().disabled).toEqual(false)
    })
    it('Should execute success() on click',() => {
      component.find('.btn').simulate('click')
      expect(props.success.mock.calls.length).toBe(1)
    })
  })
  describe('User is not authenticated',() => {
    beforeEach(() => {
      props.authenticated = false
      component = shallow(<LoginButton {...props} />)
    })
    it('Should have a "btn" class',() => {
      expect(component.find('.btn').exists()).toEqual(true)
    })
    it('Should have a "Login" text',() => {
      expect(component.find('strong').text()).toEqual('Login')
    })
    it('Should not be disabled',() => {
      expect(component.find('.btn').props().disabled).toEqual(false)
    })
    it('Should trigger "loginSuccess" on success',() => {
      component.find('.btn').simulate('success')
      expect(props.loginSuccess.mock.calls.length).toBe(1)
    })
    it('Should trigger "loginFailure" on failure',() => {
      component.find('.btn').simulate('failure')
      expect(props.loginFailure.mock.calls.length).toBe(1)
    })
  })


})
