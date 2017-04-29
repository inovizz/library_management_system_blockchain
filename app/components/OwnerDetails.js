import React from 'react'

const style = {
  marginRight: '15px'
}

const OwnerDetails = ({ data }) => {
  return (
    <p className='navbar-text navbar-right' style={style}>
      <span className='glyphicon glyphicon glyphicon-user'></span>&nbsp;&nbsp;
      <strong>{data.name}</strong>
    </p>
  )
}

export default OwnerDetails
