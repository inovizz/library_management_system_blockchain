import React from 'react'

const Ratings = ({ ratings }) => (
  <div className='rating'>
    {
      [1, 2, 3, 4, 5].map(rate => {
        if(rate <= ratings) {
          return <span key={rate} id={rate} className='active'>★</span>
        } else {
          return <span key={rate} id={rate}>☆</span>
        }
      })
    }
  </div>
)

export default Ratings
