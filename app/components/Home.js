import React from 'react'
import SearchBook from './SearchBook'
import Book from './Book'
import Banner from './Banner'
import { connect } from 'react-redux'
import * as libraryActions from '../actions/libraryActions'

export const mapStateToProps = (state, ownProps) => {
  return {
    books: state.books,
    ownerDetails: state.session.user,
    filteredBooks: state.filteredBooks,
    loading: state.loading,
    session: state.session,
    isExistingMember: state.isExistingMember,
    accounts: state.accounts
  }
}

export class Home extends React.Component {
  constructor (props) {
    super(props)
    this.searchVal = ''
    this.state = {
      rateModalIsOpen: false,
      bookModalIsOpen: false,
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
    }
  }
  render () {
    const books = this.props.books.value
                  ? this.props.books.filteredBooks.length
                    ? this.props.books.filteredBooks
                    : []
                  : (this.props.books.allBooks.length ? this.props.books.allBooks : [])
    const members = (this.props.accounts && this.props.accounts.members) ? this.props.accounts.members : ''
    return (
      <div>
        <Banner />
        <div className='container'>
          <div className='row'>
            <div className='col-md-7'>
              <ul className='nav navbar-nav'>
                <li>
                  <a href='#' className='active'>All Books</a>
                </li>
              </ul>
            </div>
            <div className='col-sm-4 col-sm-offset-1'>
              <SearchBook searchBook={this.props.searchBook} />
            </div>
          </div>
          {
            this.props.books.allBooks.length
            ? <Book loading = {
                this.props.loading
              }
              title = ''
              books = {
                books
              }
              members = {members}
              ownerDetails = { this.props.ownerDetails }
              selectedBook = { this.state.book }
              btnTitle = 'Borrow'
              isOwner = {false}
              rateBook = {
                (rating, comment) => this.props.rateBook(rating, comment, this.state.book, this.props.ownerDetails)
              }
              openModal = {
                (modalName, book) => this.toggleModal(modalName, book)
              }
              closeModal = {
                (modalName) => this.toggleModal(modalName)
              }
              rateModalIsOpen = { this.state.rateModalIsOpen }
              bookModalIsOpen = { this.state.bookModalIsOpen }
              authenticated = { this.props.session.authenticated }
              getMemberDetailsByEmail={
                (response, callbackFn, argsArray) => this.props.getMemberDetailsByEmail(response, callbackFn, argsArray)
              }
              width = '70%' />
            : this.props.loading.allbooksloading ? '' : <div className='col-md-12'>No Books Added</div>
          }
        </div>
      </div>

    )
  }
}

export default connect(mapStateToProps, libraryActions)(Home)
