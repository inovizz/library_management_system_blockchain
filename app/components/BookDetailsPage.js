import React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import * as libraryActions from '../actions/libraryActions'
import BookInfo from './utils/BookInfo'
import RateBook from './RateBook'
import BookAction from './BookAction'
import CommentList from './utils/CommentList'
import BooksForm from './BooksForm'
import BookHistory from './BookHistory'

const modalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    width                 : '30%',
    transform             : 'translate(-50%, -50%)'
  }
}

export const mapStateToProps = (state, ownProps) => {
  return {
    accounts: state.accounts,
    books: state.books,
    session: state.session,
    isExistingMember: state.isExistingMember,
    loading: state.loading,
    book_history: state.book_history
  }
}

export class BookDetailsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rateModalIsOpen: false,
      bookModalIsOpen: false,
      editBookModalIsOpen: false,
      book: {}
    }
  }
  componentWillReceiveProps (nextProps) {
    if(nextProps.session.authenticated && nextProps.session.user.account && nextProps.isExistingMember.callbackFn) {
      nextProps.isExistingMember.callbackFn.apply(this, nextProps.isExistingMember.argsArr)
    }
  }
  toggleModal (modal, book) {
    switch (modal) {
      case 'rateBook' : {
        this.setState({ rateModalIsOpen: !this.state.rateModalIsOpen, book })
        break;
      }
      case 'bookModal' : {
        this.setState({ bookModalIsOpen: !this.state.bookModalIsOpen, book })
        break;
      }
      case 'editBook' : {
        this.setState({ editBookModalIsOpen: !this.state.editBookModalIsOpen, book })
        break;
      }
    }
  }
  getUserRating (selectedBook,ownerDetails) {
    if(typeof selectedBook !== "undefined" && typeof selectedBook.ratings !== "undefined" && typeof selectedBook.reviewers !== "undefined"){
        return selectedBook.ratings[selectedBook.reviewers.indexOf(ownerDetails.account)]
    }
    return 0
  }
  render () {
    const book = this.props.books.allBooks.filter((book) => book.id === this.props.match.params.id)
    const members = (this.props.accounts && this.props.accounts.members) ? this.props.accounts.members : ''
    return  (
      <div className='container'>
        <div className='book-details-row'>
          {
            book.length !== 0 &&
            <div className='book'>
              <BookInfo
                type='details'
                book={book[0]}
                members={members}
                authenticated={this.props.session.authenticated}
                openModal={(modalName, book) => this.toggleModal(modalName, book)}
                getMemberDetailsByEmail={
                  (response, callbackFn, argsArray) => this.props.getMemberDetailsByEmail(response, callbackFn, argsArray)
                }
                ownerDetails={this.props.session.user} />
            </div>
          }
          {
            book.length !==0 && book[0].comments !== undefined && book[0].comments.length !==0 &&
            <CommentList
              members={members} ratings={book[0].ratings} reviewers={book[0].reviewers} comments={book[0].comments} />
          }
        </div>
        {
          book.length !== 0 &&
          <BookHistory
          book={book[0]}
          members={members}
          book_history={this.props.book_history} />
        }
        <Modal
          isOpen={this.state.rateModalIsOpen}
          onRequestClose={() => this.toggleModal('rateBook')}
          role='dialog'
          style={modalStyle}
          shouldCloseOnOverlayClick={false}
          contentLabel='Rate a Book'>
          <RateBook closeModal = {
            () => this.toggleModal('rateBook')
          }
          rateBook = {
            (rating, comment) => this.props.rateBook(rating, comment, this.state.book, this.props.session.user)
          }
          loading = {
            this.props.loading.rateBookLoading
          }
          presetRate={ this.getUserRating(this.state.book, this.props.session.user) }
          selectedBook = { this.state.book }
          />
        </Modal>
        <Modal
          isOpen={this.state.bookModalIsOpen}
          onRequestClose={() => this.toggleModal('bookModal')}
          role='dialog'
          style={modalStyle}
          shouldCloseOnOverlayClick={false}
          contentLabel='Book Action'>
          <BookAction
            btnTitle='Borrow'
            isOwner={false}
            members={members}
            book={this.state.book}
            ownerDetails={this.props.session.user}
            closeModal={() => this.toggleModal('bookModal')}
          />
        </Modal>
        <Modal
          isOpen={this.state.editBookModalIsOpen}
          onRequestClose={() => this.toggleModal('editBook')}
          shouldCloseOnOverlayClick={false}
          role='dialog'
          style={modalStyle}
          contentLabel='Edit book'>
          <BooksForm closeModal={() => this.toggleModal('editBook')} book={this.state.book} />
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, libraryActions)(BookDetailsPage)
