import React from 'react'
import { shallow } from 'enzyme'
import Banner from '../../../components/Banner'

describe('Banner', () => {
  let component
  beforeEach(() => {
    component = shallow(<Banner />)
  })
  it('has a yogalogo class', () => {
    expect(component.find('.yogalogo').exists()).toEqual(true)
  })
  it('has a company logo', () => {
    expect(component.find('img').props().src).toEqual('test_file_stub')
  })
  it('has a header',() => {
    expect(component.find('h1').text()).toEqual('Yoga for the mind')
  })
  it('has a sub header',() => {
    expect(component.find('h4').text()).toEqual('Get Rewarded for Reading')
  })
})
