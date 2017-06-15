import React from 'react'
import Ratings from './Ratings'

const CommentList = ({ members, comments, reviewers, ratings }) => (
  <div className='comments'>
    <p className='lead'>Reviews</p>
    {
      comments.map((comment, index) => (
        <div className='comment' key={index}>
        <Ratings ratings={ratings[index]} />
        <p>
        <strong>{members[reviewers[index]].name}</strong>
        {comment}
        </p>
        </div>
      ))
    }
  </div>
)

export default CommentList
