import React from 'react'
import { connect } from 'react-redux'
import * as libraryActions from '../actions/libraryActions'
import Main from './Main'
import OwnerDetails from './OwnerDetails'

const mapStateToProps = (state, ownProps) => {
  return {
    ownerDetails : state.ownerDetails,
    loading: state.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOwnerDetails: () => {
      dispatch(libraryActions.getOwnerDetails())
    }
  }
}

export class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.getOwnerDetails()
  }

  isEmptyObject (obj) {
    return Object.keys(obj).length
  }

  render () {
    return (
      <div>
        <nav className='navbar navbar-default'>
        <div className='container-fluid'>
            <div className='navbar-header'>
                <a className='navbar-brand' href='#'>LMS</a>
            </div>
            {
              this.isEmptyObject(this.props.ownerDetails)
              ? <OwnerDetails data={this.props.ownerDetails}/>
              : ''
            }
        </div>
        </nav>
        <div className='container'>
          {
            this.isEmptyObject(this.props.ownerDetails)
            ? <Main owner={this.props.ownerDetails}/>
            : <div>Loading...</div>
          }
        </div>
      </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
