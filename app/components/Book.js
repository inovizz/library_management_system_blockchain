import React from 'react'
import Modal from 'react-modal'
import RateBook from './RateBook'
import BookAction from './BookAction'
import BookInfo from './utils/BookInfo'

const style = {
  row: {
    display: 'flex',
    flexWrap: 'wrap'
  }
}

const modalStyle = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    width                 : '30%',
    transform             : 'translate(-50%, -50%)'
  }
}

export const getUserRating = (selectedBook,ownerDetails) => {
  if(typeof selectedBook !== "undefined" && typeof selectedBook.ratings !== "undefined" && typeof selectedBook.reviewers !== "undefined"){
      return selectedBook.ratings[selectedBook.reviewers.indexOf(ownerDetails.account)]
  }
  return 0
}
const Book = ({
    title,
    books,
    members,
    ownerDetails,
    selectedBook,
    btnTitle,
    loading,
    rateBook,
    openModal,
    closeModal,
    rateModalIsOpen,
    bookModalIsOpen,
    authenticated,
    getMemberDetailsByEmail
  }) => (
  <div className='book'>
    <div className='lead'>{title}</div>
    <div className='media-list list-group' style={style.row}>
      {books.map((book, i) => {
        return (
            <BookInfo
              key={i}
              type='info'
              book={book}
              members={members}
              authenticated={authenticated}
              openModal={openModal}
              getMemberDetailsByEmail={getMemberDetailsByEmail}
              ownerDetails={ownerDetails} />
        )
      })}
    </div>
    <Modal
      isOpen={rateModalIsOpen}
      onRequestClose={() => closeModal('rateBook')}
      role='dialog'
      style={modalStyle}
      shouldCloseOnOverlayClick={false}
      contentLabel='Rate a Book'>
      <RateBook closeModal = {
        () => closeModal('rateBook')
      }
      rateBook = {
        (rating, comment) => rateBook(rating, comment)
      }
      loading = {
        loading.rateBookLoading
      }
      presetRate={getUserRating(selectedBook,ownerDetails)}
      selectedBook = {selectedBook}
      />
    </Modal>
    <Modal
      isOpen={bookModalIsOpen}
      onRequestClose={() => closeModal('bookModal')}
      role='dialog'
      style={modalStyle}
      shouldCloseOnOverlayClick={false}
      contentLabel='Book Action'>
      <BookAction
        btnTitle={btnTitle}
        members={members}
        book={selectedBook}
        ownerDetails={ownerDetails}
        closeModal={() => closeModal('bookModal')}
      />
    </Modal>
  </div>
)

export default Book
