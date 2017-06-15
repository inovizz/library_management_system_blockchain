import React from 'react'

class LMSAuth extends React.Component {
  constructor (props) {
    super(props)
    this.password = ''
    this.confirmPassword = ''
    this.existingUser = ''
    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      error: false
    }
  }
  componentDidMount () {
    this.password.focus()
  }
  closeModal () {
    this.props.closeModal()
  }
  handleSubmit (e) {
    e.preventDefault()
    if(!this.existingUser && this.password.value !== this.confirmPassword.value) {
      this.setState({
        error: true
      })
      return
    }
    if(this.props.user[0]) {
      this.props.login(this.password.value)
    } else {
      this.props.createAccount(this.password.value)
    }
    this.closeModal()
  }
  render () {
    this.existingUser = this.props.user[0] ? true : false // true : User Exists, false : Create new Account
    return (
      <form className='form-horizontal' onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>
            { this.existingUser ? "Sign In" : "Sign Up" }
            <span className='glyphicon glyphicon-remove close-btn' onClick={this.closeModal}></span>
          </legend>
          <div className='row text-center text-danger'>
            { this.state.error && <p>Passwords do not match</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='password' className='col-sm-4 control-label'>Password</label>
            <div className='col-sm-8'>
              <input type = 'password'
                className = 'form-control'
                id = 'password'
                placeholder = 'Password'
                ref = {(element) => { this.password = element }}
                required />
            </div>
          </div>
          {
            !this.existingUser &&
            <div className='form-group'>
              <label htmlFor='confirmPassword' className='col-sm-4 control-label'>Confirm Password</label>
              <div className='col-sm-8'>
                <input type = 'password'
                  className = 'form-control'
                  id = 'confirmPassword'
                  placeholder = 'Confirm Password'
                  ref = {(element) => { this.confirmPassword = element }}
                  required />
              </div>
            </div>
          }
          <div className='form-group'>
            <div className='text-center'>
              <button type='submit' className='btn btn-default'>Submit</button>
            </div>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default LMSAuth
