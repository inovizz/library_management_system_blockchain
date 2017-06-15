import React from 'react'
import ReactStars from 'react-stars'

const style = {
  textLable: {
    textAlign: 'left'
  },
  starRate: {
    paddingTop: '5px'
  }
}
export class RateBook extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rating: props.presetRate,
      comment: ''
    }
    this.changeComment = this.changeComment.bind(this)
    this.rateBook = this.rateBook.bind(this)
  }
  changeComment (e) {
    this.setState({
      comment: e.target.value
    })
  }
  rateBook (e) {
    e.preventDefault()
    const rating = this.state.rating
    const comment = this.state.comment
    if (rating !== this.props.presetRate) {
      this.props.rateBook(rating, comment)
    }
    this.props.closeModal()
  }
  ratingChanged(newRating){
    this.setState({
      rating: newRating
    })
  }
  render () {
    return (
      <form className='form-horizontal' onSubmit={this.rateBook}>
        <fieldset>
          <legend>
            <p>Rate - {this.props.selectedBook.title}</p>
            <span className='glyphicon glyphicon-remove close-btn' onClick={() => this.props.closeModal()}></span>
          </legend>
          <div className='form-group'>
            <label htmlFor='rate' className='col-sm-3 control-label' style={style.textLable}>Ratings</label>
            <div className='col-sm-9' style={style.starRate}>
              <ReactStars
                count={5}
                onChange={(newRating)=>this.ratingChanged(newRating)}
                size={24}
                half={false}
                value={this.state.rating}
                color2={'#e7711b'} />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='comment' className='col-sm-3 control-label' style={style.textLable}>Comment</label>
            <div className='col-sm-9'>
              <textarea
                className = 'form-control'
                id = 'comment'
                placeholder = 'Comment'
                onChange={this.changeComment}
                rows = '9'/>
            </div>
          </div>
          <div className='form-group'>
            <div className='text-center'>
              <button type='submit' className='btn btn-default' disabled={this.props.loading}>Rate</button>
            </div>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default RateBook
