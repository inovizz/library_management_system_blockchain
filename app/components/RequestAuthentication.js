import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

export default function(ComposedComponent) {
  class RequestAuthentication extends React.Component {
    render () {
      return (
        this.props.authenticated
        ? <ComposedComponent {...this.props} />
        : <Redirect exact to='/' />
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      authenticated: state.session.authenticated
    }
  }

  return connect(mapStateToProps)(RequestAuthentication)

}
