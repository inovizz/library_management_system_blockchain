import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import App from './App'
import BooksPage from './BooksPage'
import RequestAuthentication from './RequestAuthentication'
import { connect } from 'react-redux'

const Main = ({ checked }) => (
  checked &&
  <Switch>
    <Route path='/books' component={RequestAuthentication(App)} />
    <Route path='/' component={BooksPage} />
  </Switch>
)

const mapStateToProps = (state) => {
  return {
    checked: state.session.checked
  }
}

export default withRouter(connect(mapStateToProps)(Main))
