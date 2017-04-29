import React from 'react'
import { Provider } from 'react-redux'
import { mount, shallow } from 'enzyme'
import { App } from '../../../components/App'

describe('App', () => {
  describe('render', () => {
    //  Test : Component gets rendered individually
    it('should render the App', () => {
      const actual = shallow(<App getOwnerDetails={() => { }} getAllBooks={() => { }} ownerDetails={[]}/>)
      const expected = (
        <a className='navbar-brand' href='#'>LMS</a>
      )
      expect(actual.contains(expected)).toEqual(true)
    })
  })
})

