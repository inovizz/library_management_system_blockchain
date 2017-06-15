import React from 'react'

export const getDate = (timestamp) => {
  return (new Date(timestamp*1000)).toDateString()
}

const BookRecord = ({ title, tableHeading, history, members }) => (
  <div className='book-record'>
    <p className='lead'>{title}</p>
    <table className='table table-striped'>
      <thead>
        <tr>
          <th>{tableHeading.columnOne}</th>
          <th>{tableHeading.columnTwo}</th>
        </tr>
      </thead>
      <tbody>
      {
        history.map((record, i) => (
          <tr key={i}>
            <td>{getDate(record.timestamp)}</td>
            <td>{members[record.borrower].name}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  </div>
)

export default BookRecord
