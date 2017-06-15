import React from 'react'

const OwnerDetails = ({ data, logout, accounts }) => {
  return (
    <div className='dropdown nav navbar-left' style={{ verticalAlign: 'bottom' }}>
      <button
        className='btn btn-default'
        id='dLabel'
        type='button'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'>
        <span className='glyphicon glyphicon glyphicon-user'></span>&nbsp;&nbsp;
        <strong>{data.name}</strong> &nbsp; &nbsp;
        <span className='caret'></span>
      </button>
      <ul className='dropdown-menu' aria-labelledby='dLabel'>
      <li>
        <span className='glyphicon glyphicon glyphicon-envelope'></span>
        &nbsp;&nbsp;
        <strong>{data.email}</strong>
      </li>
      {
        accounts && (accounts.balance !== undefined) &&
        <li>
          <span className='glyphicon glyphicon glyphicon-piggy-bank'></span>
          &nbsp;&nbsp;
          <strong>{accounts.balance} Eth</strong>
        </li>
      }
        <li onClick={() => logout()}>
          <span className='glyphicon glyphicon glyphicon-off'></span>
          &nbsp;&nbsp;
          <strong>Logout</strong>
        </li>
      </ul>
    </div>
  )
}

export default OwnerDetails
