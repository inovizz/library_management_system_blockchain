import React from 'react'
import { shallow } from 'enzyme'
import OwnerDetails from '../../../components/OwnerDetails'

describe('OwnerDetails', () => {
  let component, props;
  beforeEach(() => {
    props = {
      data: {
        name: 'User',
        email: 'email'
      },
      logout: jest.fn(),
      accounts: {
        balance: '0'
      }
    }
    component = shallow(<OwnerDetails {...props} />)
  })
  it('should display the user name', () => {
    expect(component.find('button').text().trim()).toBe('User')
  })
  it('should display the user email', () => {
    expect(component.find('strong').nodes[1].props.children).toBe('email')
  })
  it('should display the user accounts balance', () => {
    expect(component.find('strong').nodes[2].props.children).toEqual(['0',' Eth'])
  })
  it('should display the user accounts balance', () => {
    component.find('li').last().simulate('click')
    expect(props.logout.mock.calls.length).toBe(1)
  })
})
