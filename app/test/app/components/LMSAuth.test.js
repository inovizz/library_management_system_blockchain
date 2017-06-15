import React from 'react'
import { mount } from 'enzyme'
import LMSAuth from '../../../components/LMSAuth'

describe('LMSAuth',() => {
  let component, props, focus, e;
  beforeEach(() => {
    e = { preventDefault: jest.fn() }
    focus = jest.fn()
    props = {
      user: [],
      closeModal: jest.fn(),
      login: jest.fn(),
      createAccount: jest.fn()
    }
    component = mount(<LMSAuth {...props} />)
    component.instance().password = {
      focus,
      value: 'password'
    }
    component.instance().confirmPassword = {
      focus,
      value: 'password'
    }
  })
  it('componentDidMount',() => {
    component.instance().componentDidMount()
    expect(focus.mock.calls.length).toBe(1)
  })
  describe('New User',() => {
    it('Should have title as "Sign Up"',() => {
      expect(component.find('legend').text()).toBe('Sign Up')
    })
    it('Should close modal on click of "X" sign',() => {
      component.find('.close-btn').simulate('click')
      expect(props.closeModal.mock.calls.length).toBe(1)
    })
    it('Should submit form',() => {
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.createAccount.mock.calls.length).toBe(1)
    })
    it('Should not submit form if password and confirm password are different',() => {
      component.instance().confirmPassword = { value: 'confirmPassword' }
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(component.state().error).toBe(true)
      expect(props.createAccount.mock.calls.length).toBe(0)
    })
    it('Should have one input field',() => {
      expect(component.find('input').length).toBe(2)
    })
  })
  describe('Existing User',() => {
    beforeEach(() => {
      props.user = ['User']
      component = mount(<LMSAuth {...props} />)
    })
    it('Should have title as "Sign In"',() => {
      expect(component.find('legend').text()).toBe('Sign In')
    })
    it('Should submit form',() => {
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.login.mock.calls.length).toBe(1)
    })
    it('Should have one input field',() => {
      expect(component.find('input').length).toBe(1)
    })
  })

})
