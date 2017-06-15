import React from 'react'
import { shallow } from 'enzyme'
import CommentList from '../../../../components/utils/CommentList'
import Ratings from '../../../../components/utils/Ratings'

describe('CommentList', () => {
  let component, props;

  beforeEach(() => {
    props = {
      members: {
        '0x1': {
          name: 'User'
        }
      },
      comments: ['comment'],
      reviewers: ['0x1'],
      ratings: [4]
    }
    component = shallow(<CommentList {...props} />)
  })
  it('should has a class "comments"',() => {
    expect(component.find('.comments').exists()).toBe(true)
  })
  it('should has a title "Reviews"',() => {
    expect(component.find('.lead').text()).toBe('Reviews')
  })
  it('should has a class "comment"',() => {
    expect(component.find('.comment').exists()).toBe(true)
  })
  it('should have a Ratings component',() => {
    expect(component.find(Ratings).exists()).toBe(true)
  })
  it('should have a name & comment',() => {
    expect(component.find('.comment p').text()).toBe('Usercomment')
  })
})
