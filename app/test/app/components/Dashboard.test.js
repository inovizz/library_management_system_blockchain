import React from 'react'
import { render } from 'react-dom'
import { mount, shallow } from 'enzyme'
import { Dashboard } from '../../../components/Dashboard'

describe('Dashboard', () => {
  //  Test : Components and its child renders without crashing
  it('renders without crashing', () => {
    mount(<Dashboard myBooks={[]} ownerDetails={{}} getMyBooks={() => {}}/>)
  })
  describe('render', () => {
    //  Test : Component gets rendered individually
    it('should render the Dashboard', () => {
      const actual = shallow(<Dashboard myBooks={[]} ownerDetails={{}} getMyBooks={() => {}}/>)
      const expected = <div>Loading...</div>
      expect(actual.contains(expected)).toEqual(true)
    })
  })
})