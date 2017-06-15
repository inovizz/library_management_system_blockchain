import React from 'react'
import { shallow } from 'enzyme'
import { mapStateToProps, BooksForm } from '../../../components/BooksForm'

describe('BooksForm', () => {
  let component, props
  beforeEach(function () {
    props = {
      loading: {
        addBooksLoading: true
      },
      closeModal: jest.fn(),
      ownerDetails: {},
      addBook: jest.fn(),
      updateBook: jest.fn()
    }
    component = shallow(<BooksForm {...props} />)

  })
  it('should add the book',() => {
    const e = { preventDefault: jest.fn() }
    component.find('form').simulate('submit', e)
    expect(e.preventDefault.mock.calls.length).toBe(1)
    expect(props.closeModal.mock.calls.length).toBe(1)
    expect(props.addBook.mock.calls.length).toBe(1)
  })
  describe('Update Book', () => {
    beforeEach(() => {
      props.book = {
        title: 'title',
        author: 'author',
        publisher: 'publisher',
        description: 'description',
        imageUrl: 'imageUrl',
        genre: 'genre'
      }
      component = shallow(<BooksForm {...props} />)
    })
    it('should update the book, if title is updated', () => {
      const e = { target: { id: 'title', value: 'title1' }, preventDefault: jest.fn() }
      component.find('#title').simulate('change', e)
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(1)
    })
    it('should update the book, if author is updated', () => {
      const e = { target: { id: 'author', value: 'author1' }, preventDefault: jest.fn() }
      component.find('#author').simulate('change', e)
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(1)
    })
    it('should update the book, if publisher is updated', () => {
      const e = { target: { id: 'publisher', value: 'publisher1' }, preventDefault: jest.fn() }
      component.find('#publisher').simulate('change', e)
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(1)
    })
    it('should update the book, if description is updated', () => {
      const e = { target: { id: 'description', value: 'description1' }, preventDefault: jest.fn() }
      component.find('#description').simulate('change', e)
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(1)
    })
    it('should update the book, if imageUrl is updated', () => {
      const e = { target: { id: 'imageUrl', value: 'imageUrl1' }, preventDefault: jest.fn() }
      component.find('#imageUrl').simulate('change', e)
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(1)
    })
    it('should update the book, if genre is updated', () => {
      const e = { target: { id: 'genre', value: 'genre1' }, preventDefault: jest.fn() }
      component.find('#genre').simulate('change', e)
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(1)
    })
    it('should not update the book, if values are same', () => {
      const e = { preventDefault: jest.fn() }
      component.find('form').simulate('submit', e)
      expect(e.preventDefault.mock.calls.length).toBe(1)
      expect(props.closeModal.mock.calls.length).toBe(1)
      expect(props.updateBook.mock.calls.length).toBe(0)
    })
  })
  it('should close form on click of "X" icon',() => {
    component.find('.close-btn').simulate('click')
    expect(props.closeModal.mock.calls.length).toBe(1)
  })
  it('should test if props are mapped correctly', () => {
    const state = {
      loading: { addBooksLoading: false },
      session: {
        user: {}
      }
    }
    const output = mapStateToProps(state)
    expect(output).toEqual({
      ownerDetails: {}
    })
  })
})
