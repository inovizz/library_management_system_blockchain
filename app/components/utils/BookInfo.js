import React from 'react'
import { Link } from 'react-router-dom'
import Image from './Image'
import Ratings from './Ratings'
import LoginButton from './LoginButton'

export const isDisabled = (book, authenticated, ownerDetails) => {
  if(authenticated) {
    return book.owner !== ownerDetails.account && book.borrower !== ownerDetails.account && book.state === '1'
  }
  return book.state === '1'
}

export const getButtonText = (book) => {
  if(book.state === '1' ) {
    return 'Return'
  } else {
    return 'Borrow'
  }
}

export const getStatus = (state) => {
  switch (state) {
    case '0':
      return 'Available'
    case '1':
      return 'Borrowed'
    case '2':
      return 'Overdue'
    case '3':
      return 'Lost'
    case '4':
      return 'Removed'
    default:
      return 'Not Available'
  }
}

export const getTime = (date) => {
  return (new Date(+(date)*1000 + 10*24*60*60*1000)).toDateString()
}

const BookInfo = ({ type, book, members, authenticated, openModal, getMemberDetailsByEmail, ownerDetails }) => (
  <div className='list-group-item'>
    <div className='media-left'>
      <Link to={`/book/${book.id}`}>
        <Image type={getButtonText(book)} src={book.imageUrl}/>
      </Link>
    </div>
    <div className='media-body'>
      <div className='taContainer'>
        <div className='media-heading hint--bottom' aria-label='bottom'>{book.title}</div>
        <div className='author'>by {book.author}</div>
      </div>
      <div className='ratingContainer'>
        <Ratings ratings={book.avgRating} />
        <span>&nbsp;{ book.reviewersCount }&nbsp;{ (book.reviewersCount > 1) ? 'votes' : 'vote' }</span>
      </div>
      <div className='bookDescription'>
        {book.description}
      </div>
      {
        type === 'details' &&
        <table className='table table-responsive table-bordered'>
          <tbody>
            <tr>
              <td><strong>Genre</strong></td>
              <td>{book.genre}</td>
              <td><strong>Status</strong></td>
              <td>{getStatus(book.state)}</td>
            </tr>
            <tr>
              <td><strong>Owner</strong></td>
              <td>{members[book.owner].name}</td>
              <td><strong>Added on</strong></td>
              <td>{getTime(book.dateAdded)}</td>
            </tr>
            {
              book.state === '1' &&
              <tr>
                <td><strong>Borrower</strong></td>
                <td>{members[book.borrower].name}</td>
                <td><strong>Issued on</strong></td>
                <td>{getTime(book.dateIssued)}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
    <div className='media-bottom'>
      <p className='user-info'>
      {
        members[book.owner] !== undefined &&
        members[book.owner].name !== '' &&
        <span>
          Book shared by &nbsp;
          <a href={'mailto:'+members[book.owner].email}>
            <strong>{members[book.owner].name}</strong>
          </a>
          &nbsp;&nbsp;
        </span>
      }
      {
        members[book.borrower] !== undefined &&
        members[book.borrower].name !== '' &&
        <span>
          Currently with &nbsp;
          <a href={'mailto:'+members[book.borrower].email}>
            <strong>{members[book.borrower].name}</strong>
          </a>
        </span>
      }
      </p>
      <p className='btns'>
        {
          authenticated && book.owner === ownerDetails.account && type === 'details' &&
          <button className='btn btn-default edit-btn' onClick={() => openModal('editBook', book)}>
            Edit
          </button>
        }
        <LoginButton
          authenticated={authenticated}
          loginSuccess={(response) => {
            getMemberDetailsByEmail(response, openModal, ['bookModal', book])
          }}
          loginFailure={(err) => console.log(err)}
          success = {() => openModal('bookModal', book)}
          className='btn btn-default borrow-btn'
          disabled={isDisabled(book, authenticated, ownerDetails)}
          buttonText={getButtonText(book)}
          logo='' />
      <LoginButton
        authenticated={authenticated}
        loginSuccess={(response) => {
          getMemberDetailsByEmail(response, openModal, ['rateBook', book])
        }}
        loginFailure={(err) => console.log(err)}
        success = {() => openModal('rateBook', book)}
        className='btn btn-default'
        disabled={false}
        buttonText='Rate'
        logo='' />
      </p>
    </div>
  </div>
)

export default BookInfo
