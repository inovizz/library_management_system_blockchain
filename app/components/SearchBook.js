import React from 'react'

const SearchBook = ({ searchBook }) => (
  <div className='input-group'>
    <span className='input-group-addon'>
      <span className='glyphicon glyphicon-search'></span>
    </span>
    <input
        type='text'
        className='form-control'
        placeholder='Enter book title, author, publisher'
        onKeyUp = {
          (event) => searchBook(event.target.value)
        }
        required/>
  </div>
)

export default SearchBook
