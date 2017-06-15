import React from 'react'
import { connect } from 'react-redux'
import * as libraryActions from '../actions/libraryActions'

export class BookAction extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit (e) {
    e.preventDefault();
    const actionType = this.checkActionType();
    if(actionType === 1) { this.props.borrowBook(this.props.book, this.props.ownerDetails) }
    else if(actionType === 2) { this.props.returnBook(this.props.book) }
    this.props.closeModal()
  }
  checkActionType () {
    if (this.props.book.state === '0') {
      return 1 // User is borrowing book
    } else if(this.props.book.owner === this.props.ownerDetails.account) {
      return 2 // Owner is returning book
    } else {
      return 3 // Borrower is returning book
    }
  }
  render () {
    const actionType = this.checkActionType();
    const info = actionType === 1
                 ? 'Please contact the book owner for pick up.'
                 : actionType === 2
                    ? 'Click "Return" to confirm that the book has been returned to you.'
                    : 'Please return book to the owner.'
    const buttonText = actionType === 1
                       ? 'Borrow'
                       : actionType === 2
                          ? 'Return'
                          : 'Close'
    const { book, members } = this.props
    const borrowed_date = book.state === '0' ? Date.now() : (+book.dateIssued)*1000
    const due_date = new Date(borrowed_date + 10*24*60*60*1000) // increment date by 10 days
    return (
      <form className='form-horizontal' onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>
            <p>
              {actionType === 1 ? "Borrow Book" : "Return Book"} - {book.title}
            </p>
            <span className='glyphicon glyphicon-remove close-btn' onClick={() => this.props.closeModal()}></span>
          </legend>
          <div className='row'>
            <p className='lead'>{info}</p>
            <table className='table table-striped'>
              {
                actionType === 2
                ? <tbody>
                    <tr>
                      <td>Book Title</td>
                      <td>{book.title}</td>
                    </tr>
                    <tr>
                      <td>Author</td>
                      <td>{book.author}</td>
                    </tr>
                    <tr>
                      <td>Publisher</td>
                      <td>{book.publisher}</td>
                    </tr>
                    {
                      members[book.borrower].name !== '' &&
                      <tr>
                        <td>Borrowed By</td>
                        <td>{members[book.borrower].name}</td>
                      </tr>
                    }
                    {
                      members[book.borrower].email !== '' &&
                      <tr>
                        <td>Email</td>
                        <td><a href={'mailto:'+members[book.borrower].email}>{members[book.borrower].email}</a></td>
                      </tr>
                    }
                    {
                      <tr>
                        <td>Due Date</td>
                        <td>{due_date.toDateString()}</td>
                      </tr>
                    }
                  </tbody>
                : <tbody>
                    {
                      members[book.owner].name !== '' &&
                      <tr>
                        <td>Name</td>
                        <td>{members[book.owner].name}</td>
                      </tr>
                    }
                    {
                      members[book.owner].email !== '' &&
                      <tr>
                        <td>Email</td>
                        <td><a href={'mailto:'+members[book.owner].email}>{members[book.owner].email}</a></td>
                      </tr>
                    }
                    {
                      <tr>
                        <td>Due Date</td>
                        <td>{due_date.toDateString()}</td>
                      </tr>
                    }
                  </tbody>
              }
            </table>
          </div>
          <div className='form-group'>
            <div className={'col-sm-6 text-right ' + (actionType === 3 ? 'book-close-btn' : '')}>
              <button type='submit' className='btn btn-default'>
              { buttonText }
              </button>
            </div>
            {
              (actionType === 1 || actionType === 2) &&
              <div className='col-sm-6 text-left'>
                <button className='btn btn-default closeBtn' onClick={() => this.props.closeModal()}>
                  Close
                </button>
              </div>
            }
          </div>
        </fieldset>
      </form>
    )
  }
}

export default connect(null, libraryActions)(BookAction)
