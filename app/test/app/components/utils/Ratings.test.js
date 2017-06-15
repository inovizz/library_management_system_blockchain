import React from 'react'
import { shallow } from 'enzyme'
import Ratings from '../../../../components/utils/Ratings'

describe('Ratings',() => {
  let component, props;
  beforeEach(() => {
    props = {
      ratings: 4
    }
    component = shallow(<Ratings {...props} />)
  })
  it('should display 4 active stars',() => {
    expect(component.find('.active').length).toBe(4)
  })
})
