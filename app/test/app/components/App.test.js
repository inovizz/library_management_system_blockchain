import React from 'react'
import { shallow } from 'enzyme'
import { App, mapStateToProps } from '../../../components/App'
import Header from '../../../components/Header'
import Dashboard from '../../../components/Dashboard'

describe('App', () => {
  let component, props;
  beforeEach(() => {
    props = {
      session: {
        authenticated: true,
        user: {
          account: '0x1'
        }
      },
      accounts: null,
      getMemberDetailsByEmail: jest.fn(),
      logout: jest.fn(),
      getBalance: jest.fn()
    }
    component = shallow(<App {...props} />)
  })
  it('should have a Header component', () => {
    expect(component.find(Header).exists()).toBe(true)
  })
  it('should run getMemberDetailsByEmail on successfull login', () => {
    component.find(Header).props().loginSuccess()
    expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(1)
  })
  it('should not run getMemberDetailsByEmail if login fails', () => {
    component.find(Header).props().loginFailure()
    expect(props.getMemberDetailsByEmail.mock.calls.length).toBe(0)
  })
  it('should logout user', () => {
    component.find(Header).props().logout()
    expect(props.logout.mock.calls.length).toBe(1)
  })
  describe('Balance',() => {
    it('should retreive balance if user is authenticated and has no balance',() => {
      component.instance().componentWillReceiveProps(props)
      expect(props.getBalance.mock.calls.length).toBe(1)
    })
    it('should not retreive balance if user is not authenticated',() => {
      props.session.authenticated = false
      component = shallow(<App {...props} />)
      component.instance().componentWillReceiveProps(props)
      expect(props.getBalance.mock.calls.length).toBe(0)
    })
    it('should not retreive balance if user already has balance',() => {
      props.accounts = { balance: '0' }
      component = shallow(<App {...props} />)
      component.instance().componentWillReceiveProps(props)
      expect(props.getBalance.mock.calls.length).toBe(0)
    })
  })
  it('should hide loader on componentDidMount',() => {
    document.body.innerHTML = '<div id="loader"></div>'
    const loader = document.getElementById('loader')
    component.instance().componentDidMount()
    expect(loader.style.display).toBe('none')
  })
  it('should hide loader on componentDidMount',() => {
    document.body.innerHTML = '<div id="no-loader"></div>'
    const loader = document.getElementById('loader')
    component.instance().componentDidMount()
    expect(loader).toBe(null)
  })
  describe('User is authenticated',() => {
    it('should have a Dashboard component', () => {
      expect(component.find(Dashboard).exists()).toBe(true)
    })
  })
  describe('User is not authenticated',() => {
    it('should show text "Logged out"', () => {
      props.session.authenticated = false
      component = shallow(<App {...props} />)
      const expected = <div>Logged out</div>
      expect(component.contains(expected)).toBe(true)
    })
  })

  describe('mapStateToProps',() => {
    it('should map state to props', () => {
      const state = {
        session: props.session,
        accounts: props.accounts
      }
      const expected = mapStateToProps(state)
      expect(expected).toEqual(state)
    })
  })

})
