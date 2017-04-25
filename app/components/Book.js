import React from 'react'

const Book = ({ title, books }) => (
  <div>
    <p className='lead'>{title}</p>
    <ul className='media-list list-group'>
        {
            books.map((book, i) => {
              return (
                    <li key={book.id} className='list-group-item col-sm-6 col-md-4'>
                        <div className='media-left'>
                            <img className='media-object' src='https://placehold.it/140X100'/>
                        </div>
                        <div className='media-body'>
                            <h4 className='media-heading'>{book.title}</h4>
                            <p><span>Author : </span> {book.author}</p>
                            <p><span>Publisher : </span> {book.publisher}</p>
                            <p></p>
                        </div>
                    </li>
              )
            })
        }
    </ul>
  </div>
)

export default Book
