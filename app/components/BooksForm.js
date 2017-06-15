import React from 'react'
import { connect } from 'react-redux'
import * as libraryActions from '../actions/libraryActions'

export const mapStateToProps = (state) => {
  return {
    ownerDetails: state.session.user
  }
}

export class BooksForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.book ? this.props.book.title : '',
      author: this.props.book ? this.props.book.author : '',
      publisher: this.props.book ? this.props.book.publisher : '',
      description: this.props.book ? this.props.book.description : '',
      imageUrl: this.props.book ? this.props.book.imageUrl : '',
      genre: this.props.book ? this.props.book.genre : ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  isBookUpdated (book) {
    return (this.props.book.title !== book.title
            || this.props.book.author !== book.author
            || this.props.book.publisher !== book.publisher
            || this.props.book.description !== book.description
            || this.props.book.imageUrl !== book.imageUrl
            || this.props.book.genre !== book.genre)
  }
  handleSubmit (e) {
    e.preventDefault()
    const book = {
      title : this.state.title,
      author : this.state.author,
      publisher : this.state.publisher,
      description : this.state.description,
      imageUrl : this.state.imageUrl,
      genre : this.state.genre,
      owner: this.props.ownerDetails
    }
    if(this.props.book) {
      if(this.isBookUpdated(book)) {
        this.props.updateBook(this.props.book.id, book)
      }
    } else {
      this.props.addBook(book)
    }
    this.props.closeModal()
  }
  handleChange (e) {
    this.setState({
      [e.target.id] : e.target.value
    })
  }
  render () {
    return (
      <form className='form-horizontal' onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>
            {
              this.props.book
              ? <p>{'Edit - '+ this.props.book.title }</p>
              : <p>Add a book</p>
            }
            <span className='glyphicon glyphicon-remove close-btn' onClick={() => this.props.closeModal()}></span>
          </legend>
          <div className='form-group'>
            <label htmlFor='title' className='col-sm-3 control-label'>Title</label>
            <div className='col-sm-9'>
              < input type = 'text'
              className = 'form-control'
              id = 'title'
              placeholder = 'Title'
              defaultValue = {this.state.title}
              onChange= {this.handleChange}
              required / >
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='author' className='col-sm-3 control-label'>Author</label>
            <div className='col-sm-9'>
              < input type = 'text'
                className = 'form-control'
                id = 'author'
                placeholder = 'Author'
                defaultValue = {this.state.author}
                onChange= {this.handleChange}
                required / >
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='publisher' className='col-sm-3 control-label'>Publisher</label>
            <div className='col-sm-9'>
              < input type = 'text'
                className = 'form-control'
                id = 'publisher'
                placeholder = 'Publisher'
                defaultValue = {this.state.publisher}
                onChange= {this.handleChange}
                required / >
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='imageUrl' className='col-sm-3 control-label'>Image URL</label>
            <div className='col-sm-9'>
              < input type = 'url'
                className = 'form-control'
                id = 'imageUrl'
                placeholder = 'Image URL'
                defaultValue = {this.state.imageUrl}
                onChange= {this.handleChange}
                required / >
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='description' className='col-sm-3 control-label'>Description</label>
            <div className='col-sm-9'>
              <textarea
              className = 'form-control'
              id = 'description'
              placeholder = 'Description'
              defaultValue = {this.state.description}
              onChange= {this.handleChange}
              rows='9'
              required />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='genre' className='col-sm-3 control-label'>Genre</label>
            <div className='col-sm-9'>
              < input type = 'text'
              className = 'form-control'
              id = 'genre'
              placeholder = 'Genre'
              defaultValue = {this.state.genre}
              onChange= {this.handleChange}
              required / >
            </div>
          </div>
          <div className='form-group'>
            <div className='text-center'>
              <button type='submit' className='btn btn-default'>{this.props.book ? 'Edit' : 'Add'}</button>
            </div>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default connect(mapStateToProps, libraryActions)(BooksForm)
