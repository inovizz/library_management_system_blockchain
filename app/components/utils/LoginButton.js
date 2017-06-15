import React from 'react'
import GoogleLogin from 'react-google-login'

const LoginButton = ({
  authenticated,
  loginSuccess,
  loginFailure,
  success,
  className,
  disabled,
  buttonText,
  logo
}) => {
  return (
    authenticated
    ? <button
        className={className}
        onClick={() => success()}
        disabled={disabled}>{buttonText}</button>
    : <GoogleLogin
        clientId='672617539191-jqtmbeeu1gc1nvpm2obr2n3m3gtkn8sk.apps.googleusercontent.com'
        buttonText={buttonText}
        className={className}
        onSuccess={(response) => loginSuccess(response)}
        onFailure={(response) => loginFailure(response)}
        disabled={disabled}>
          { logo && <span><span className={logo}></span>&nbsp;&nbsp;</span> }
          <strong>{buttonText}</strong>
        </GoogleLogin>
  )
}

export default LoginButton
