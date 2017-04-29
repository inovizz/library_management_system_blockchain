import React from 'react'
import { render } from 'react-dom'
import { mount, shallow } from 'enzyme'
import Book from '../../../components/Book'

describe('Book', () => {
  //  Test : Components and its child renders without crashing
  it('renders without crashing', () => {
    mount(<Book title='' books={[]} />)
  })
  describe('render', () => {
    //  Test : Component gets rendered individually
    it('should render the book', () => {
      const book = [{
        'id': '1',
        'title': 'Title',
        'author': 'Author',
        'publisher': 'Publisher',
        'owner': '0xba21a9b09d528b2e1726d786a1d1b861032dba87',
        'borrower': '0x0000000000000000000000000000000000000000',
        'state': '0',
        'dateAdded': '1493054441',
        'dateIssued': '0'
      }]
      const actual = shallow(<Book title='My Books' books={book} />)
      const expected = (
        <div>
          <p className='lead'>My Books</p>
          <ul className='media-list list-group'>
            <li key={book[0].id} className='list-group-item col-sm-6 col-md-4'>
                <div className='media-left'>
                    <img className='media-object' src='https://placehold.it/140X100'/>
                </div>
                <div className='media-body'>
                    <h4 className='media-heading'>{book[0].title}</h4>
                    <p><span>Author : </span> {book[0].author}</p>
                    <p><span>Publisher : </span> {book[0].publisher}</p>
                    <p></p>
                </div>
            </li>
          </ul>
        </div>
      )
      expect(actual.contains(expected)).toEqual(true)
    })
  })
})
