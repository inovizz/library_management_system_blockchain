import React from 'react'
import { shallow } from 'enzyme'
import RateBook from '../../../components/RateBook'

describe('RateBook', () => {
  let component, props;
  beforeEach(() => {
    props = {
      rateBook: jest.fn(),
      closeModal: jest.fn(),
      loading: false,
      selectedBook: { title: 'Book' },
      presetRate: 4
    }
    component = shallow(<RateBook {...props} />)
  })
  it('should render the book form', () => {
    expect(component.find('form').exists()).toEqual(true)
  })
  it('should have a ReactStars rating',() => {
    expect(component.find('ReactStars').exists()).toEqual(true)
  })
  it('should have a textarea for comment',() => {
    expect(component.find('textarea').exists()).toEqual(true)
  })
  it('should have a submit button',() => {
    expect(component.find('button').exists()).toEqual(true)
  })
  it('should submit the form',() => {
    const e = { preventDefault: jest.fn() }
    component.find('ReactStars').simulate('change', 3)
    component.find('form').simulate('submit', e)
    expect(e.preventDefault.mock.calls.length).toBe(1)
    expect(props.rateBook.mock.calls.length).toBe(1)
    expect(props.closeModal.mock.calls.length).toBe(1)
  })
  it('should not update ratings if preset rate is not changed',() => {
    const e = { preventDefault: jest.fn() }
    component.find('ReactStars').simulate('change', 4)
    component.find('form').simulate('submit', e)
    expect(e.preventDefault.mock.calls.length).toBe(1)
    expect(props.rateBook.mock.calls.length).toBe(0)
    expect(props.closeModal.mock.calls.length).toBe(1)
  })
  it('should close on click of "X" icon',() => {
    component.find('.close-btn').simulate('click')
    expect(props.closeModal.mock.calls.length).toBe(1)
  })
  it('should change value of ReactStars',() => {
    const e = '3'
    component.find('ReactStars').simulate('change', e)
    expect(component.find('ReactStars').props().value).toBe('3')
  })
  it('should change value of textarea',() => {
    const e = { target: { value: 'Wonderful' } }
    component.find('textarea').simulate('change', e)
    expect(component.state().comment).toBe('Wonderful');
  })
})
