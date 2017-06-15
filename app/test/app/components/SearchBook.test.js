import React from 'react'
import { shallow } from 'enzyme'
import SearchBook from '../../../components/SearchBook'

describe('SearchBook', () => {
  let component, bookVal
  beforeEach(() => {
    const props = {
      searchBook: (book) => {
        bookVal = book
      }
    }
    component = shallow(<SearchBook {...props}/>)
  })
  it('has a search input', () => {
    expect(component.find('input').exists()).toEqual(true)
  })
  it('runs searchBook on key up', () => {
    component.find('input').simulate('keyup', {
      target:{
        value: 'book'
      }
    })
    expect(bookVal).toEqual('book')
  })
  it('has a search icon',() => {
    expect(component.find('.glyphicon-search').exists()).toEqual(true)
  })
})
