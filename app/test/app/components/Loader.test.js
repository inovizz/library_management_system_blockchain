import React from 'react'
import { shallow } from 'enzyme'
import Loader from '../../../components/Loader'

describe('Loader', () => {
  let component, props;
  beforeEach(() => {
    props = {
      text: 'Loading'
    }
    component = shallow(<Loader {...props} />)
  })
  it('should have "Loading" title', () => {
    expect(component.text()).toEqual("Loading")
  })

})
