import React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import * as libraryActions from '../actions/libraryActions'
import Book from './Book'
import BooksForm from './BooksForm'
import Loader from './Loader'
import NotifyMe from './notifications/NotifyMe'

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

const leadStyle = {
  paddingBottom : 0
}

export const mapStateToProps = (state, ownProps) => {
  return {
    allBooks: state.books.allBooks,
    ownerDetails: state.session.user,
    loading: state.loading,
    session: state.session,
    error: state.error,
    accounts: state.accounts
  }
}

export class Dashboard extends React.Component {
  constructor () {
    super()
    this.state = {
      modalIsOpen: false,
      rateModalIsOpen: false,
      bookModalIsOpen: false,
      book: {},
      isOwner: false
    }
  }
  toggleModal (option, book, isOwner) {
    switch (option) {
      case 'addBook':
        this.setState({ modalIsOpen: !this.state.modalIsOpen })
        break
      case 'rateBook':
        this.setState({ rateModalIsOpen: !this.state.rateModalIsOpen, book })
        break
      case 'bookModal':
        this.setState({ bookModalIsOpen: !this.state.bookModalIsOpen, book, isOwner })
    }
  }
  componentDidMount () {
    if(!this.props.allBooks.length) {
        this.props.getAllBooks()
    }
    if(!this.props.accounts) {
      this.props.getAllMembers()
    }
  }
  renderLoading () {
    const title = this.props.loading.allbooksloading
                  ? 'Loading Books'
                  : this.props.loading.addBooksLoading
                    ? 'Adding book...'
                    : this.props.loading.borrowBooksLoading
                    ? 'Borrowing book'
                    : this.props.loading.returnBooksLoading
                    ? 'Returning Book'
                    : this.props.loading.rateBookLoading
                      ? 'Submitting Rating'
                      : 'Fetching details from library';
   if (this.props.loading.allbooksloading || this.props.loading.addBooksLoading || this.props.loading.returnBooksLoading ||  this.props.loading.rateBookLoading || this.props.loading.borrowBooksLoading) {
     return (<Loader text={title}/>)
   }
  }
  render () {
    const ownerBooks = this.props.allBooks.filter((book) => book.owner === this.props.ownerDetails.account)
    const borrowedBooks = this.props.allBooks.filter((book) => book.borrower === this.props.ownerDetails.account)
    const members = (this.props.accounts && this.props.accounts.members) ? this.props.accounts.members : ''
    return (
      <div>
        <NotifyMe message={this.props.error}/>
        <div className='add-btn'>
          <button className='btn btn-default' onClick={() => this.toggleModal('addBook')}>Add Book</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={() => this.toggleModal('addBook')}
            shouldCloseOnOverlayClick={false}
            role='dialog'
            style={modalStyle}
            contentLabel='Add a Book'>
            <BooksForm closeModal={() => this.toggleModal('addBook')}/>
          </Modal>
        </div>
        {
          this.renderLoading()
        }
        <div>
            {
              ownerBooks.length
              ? <Book loading = {
                  this.props.loading
                }
                title = 'My Books'
                books = {
                  ownerBooks
                }
                members = {members}
                ownerDetails = { this.props.ownerDetails }
                selectedBook = { this.state.book }
                btnTitle = 'Return'
                isOwner = {this.state.isOwner}
                rateBook = {
                  (rating, comment) => this.props.rateBook(rating, comment, this.state.book, this.props.ownerDetails)
                }
                openModal = {
                  (modalName, book) => this.toggleModal(modalName, book, true)
                }
                closeModal = {
                  (modalName) => this.toggleModal(modalName)
                }
                rateModalIsOpen = { this.state.rateModalIsOpen }
                bookModalIsOpen = { this.state.bookModalIsOpen }
                authenticated = { this.props.session.authenticated} />
              : <div className="book"><div className="lead" style={leadStyle}>My Books</div><div> No Books Added </div></div>
            }
            {
              borrowedBooks.length
              ? <Book loading = {
                  this.props.loading
                }
                title = 'Borrowed Books'
                books = {
                  borrowedBooks
                }
                members = {members}
                ownerDetails = { this.props.ownerDetails }
                selectedBook = { this.state.book }
                isOwner = {this.state.isOwner}
                btnTitle = ''
                rateBook = {
                  (rating, comment) => this.props.rateBook(rating, comment, this.state.book, this.props.ownerDetails)
                }
                openModal = {
                  (modalName, book) => this.toggleModal(modalName, book, false)
                }
                closeModal = {
                  (modalName) => this.toggleModal(modalName)
                }
                rateModalIsOpen = { this.state.rateModalIsOpen }
                bookModalIsOpen = { this.state.bookModalIsOpen }
                authenticated = { this.props.session.authenticated} />
              : ''
            }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, libraryActions)(Dashboard)
