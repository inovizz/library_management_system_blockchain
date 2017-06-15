import React from 'react'
import { connect } from 'react-redux'
import * as libraryActions from '../actions/libraryActions'
import Header from './Header'
import Modal from 'react-modal'
import LMSAuth from './LMSAuth'
import Loader from './Loader'
import Home from './Home'
import BookDetailsPage from './BookDetailsPage'
import NotifyMe from './notifications/NotifyMe'
import { Switch, Route } from 'react-router-dom'

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
    books: state.books,
    ownerDetails: state.session.user,
    filteredBooks: state.filteredBooks,
    loading: state.loading,
    session: state.session,
    error: state.error,
    isExistingMember: state.isExistingMember,
    accounts: state.accounts
  }
}

export class BooksPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authModalIsOpen: !this.props.isExistingMember.user
    }
  }
  componentDidMount () {
    // disabling the Loader screen screen
    const loader = document.getElementById('loader')
    if (loader) {
      loader.style.display = 'none'
    }
    if(!this.props.books.allBooks.length) {
        this.props.getAllBooks()
    }
    this.props.shuffleAllBooks(this.props.books.allBooks)
    if(!this.props.accounts) {
      this.props.getAllMembers()
    }
  }
  componentWillReceiveProps (nextProps) {
    if(!nextProps.isExistingMember.user) {
      this.setState({
        authModalIsOpen: true
      })
    }
    if(nextProps.session.authenticated && nextProps.session.user.account && !nextProps.accounts) {
      this.props.getBalance(nextProps.session.user)
    }
  }
  toggleModal (modal, book) {
    switch (modal) {
      case 'authModal' : {
        this.setState({ authModalIsOpen: !this.state.authModalIsOpen })
        break;
      }
    }
  }
  loginFailure (response) {
    console.log(response)
  }
  signIn (password) {
    const { session, user } = this.props.isExistingMember
    this.props.unlockAccount(session, user, password)
  }
  renderLoader (flag) {
    const title = this.props.loading.loginLoader
                  ? 'Validating User'
                  : (this.props.loading.createAccountLoader || this.props.loading.addMemberLoader)
                    ? 'Creating Account'
                    : this.props.loading.borrowBooksLoading
                    ? 'Borrowing book'
                    : this.props.loading.returnBooksLoading
                    ? 'Returning Book'
                     : this.props.loading.rateBookLoading
                      ? 'Submitting Rating'
                      : this.props.loading.allbooksloading
                        ? 'Loading Books'
                        : this.props.loading.addBooksLoading
                          ? 'Updating Book'
                          : ''
    if(this.props.loading.allbooksloading || this.props.loading.loginLoader || (this.props.loading.createAccountLoader || this.props.loading.addMemberLoader) || flag || this.props.loading.borrowBooksLoading || this.props.loading.returnBooksLoading || this.props.loading.rateBookLoading || this.props.loading.addBooksLoading) {
      return <Loader text={title} />
    }
  }
  render () {
    return (
      <div>
        <Header
          loginSuccess = {
            (response) => {
              this.props.getMemberDetailsByEmail(response)
            }
          }
          loginFailure = {
            (response) => this.loginFailure(response)
          }
          session={ this.props.session }
          accounts={ this.props.accounts }
          logout = {
            () => {
              this.props.logout()
              this.props.history.push('/')
          }} />

        {
          this.renderLoader()
        }
        <NotifyMe message={this.props.error}/>
        <Switch>
          <Route path='/book/:id' component={BookDetailsPage} />
          <Route exact path='/' component={Home} />
        </Switch>
        <Modal
            isOpen={this.state.authModalIsOpen && (this.props.isExistingMember.user ? true: false) }
            onRequestClose={() => this.toggleModal('authModal')}
            shouldCloseOnOverlayClick={false}
            role='dialog'
            style={modalStyle}
            contentLabel='Account'>
            <LMSAuth
              closeModal={() => this.toggleModal('authModal')}
              user={this.props.isExistingMember.user}
              login={(password) => this.signIn(password)}
              createAccount={(password) => {
                this.props.createAccount(this.props.isExistingMember.session, password)
              }}/>
          </Modal>
      </div>)
  }
}

export default connect(mapStateToProps, libraryActions)(BooksPage)
