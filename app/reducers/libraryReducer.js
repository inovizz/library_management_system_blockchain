import { shuffleArray } from './helpers'

export const libraryReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ACCOUNTS_SUCCESS':
      return action.payload
    case 'GET_USER_BALANCE_SUCCESS':
      return {
        ...state,
        balance: action.payload.toNumber()
      }
    case 'GET_MEMBER_DETAILS_SUCCESS':
      return {
        ...state,
        member: {
          name: action.payload[0],
          email: action.payload[2]
        }
      }
    case 'GET_ALL_MEMBERS_SUCCESS': {
      let users = action.payload[0].split('|').reduce((userMap, user) => {
        user = user.split(';')
        userMap['0x'+user[1]] = {
          name: user[0].trim(),
          email: user[2]
        }
        return userMap
      }, {})
      return {
        ...state,
        members: users
      }
    }
    default:
      return state
  }
}

export const loadingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ACCOUNTS_LOADING':
      return {
        ...state,
        accountsLoading : action.payload
      }
    case 'GET_OWNERDETAILS_LOADING':
      return {
        ...state,
        ownerDetailsLoading : action.payload
      }
    case 'GET_ALL_BOOKS_LOADING':
      return {
        ...state,
        allbooksloading : action.payload
      }
    case 'GET_MY_BOOKS_LOADING':
      return {
        ...state,
        myBooksLoading : action.payload
      }
    case 'GET_ADD_BOOKS_LOADING':
    case 'UPDATE_BOOK_LOADING':
      return {
        ...state,
        addBooksLoading : action.payload
      }
    case 'GET_RETURN_BOOKS_LOADING':
      return {
        ...state,
        returnBooksLoading : action.payload
      }
    case 'GET_BORROW_BOOKS_LOADING':
      return {
        ...state,
        borrowBooksLoading : action.payload
      }
    case 'RATE_BOOK_LOADING':
      return {
        ...state,
        rateBookLoading : action.payload
      }
    case 'GET_MEMBER_DETAILS_EMAIL_LOADING':
    case 'UNLOCK_ACCOUNT_LOADING':
      return {
        ...state,
        loginLoader : action.payload
      }
    case 'CREATE_ACCOUNT_LOADING':
      return {
        ...state,
        createAccountLoader : action.payload
      }
    case 'ADD_MEMBER_LOADING':
      return {
        ...state,
        addMemberLoader : action.payload
      }
    case 'GET_MEMBER_DETAILS_LOADING':
      return {
        ...state,
        getMemberDetailsLoader : action.payload
      }
    case 'GET_ALL_MEMBERS_LOADING':
      return {
        ...state,
        allMembersLoading : action.payload
      }
    case 'BORROW_EVENT_LOADING':
      return {
        ...state,
        borrowEventLoading : action.payload
      }
    case 'RETURN_EVENT_LOADING':
      return {
        ...state,
        returnEventLoading : action.payload
      }
    default:
      return state
  }
}

export const errorReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ACCOUNTS_ERROR':
    case 'GET_OWNERDETAILS_ERROR':
    case 'GET_ALL_BOOKS_ERROR':
    case 'GET_MY_BOOKS_ERROR':
    case 'GET_ADD_BOOKS_ERROR':
    case 'RATE_BOOK_ERROR':
    case 'GET_RETURN_BOOKS_ERROR':
    case 'GET_BORROW_BOOKS_ERROR':
    case 'GET_MEMBER_DETAILS_EMAIL_ERROR':
    case 'GET_RATE_BOOK_ERROR':
    case 'CREATE_ACCOUNT_ERROR':
    case 'ADD_MEMBER_ERROR':
    case 'GET_MEMBER_DETAILS_ERROR':
    case 'GET_ALL_MEMBERS_ERROR':
    case 'UNLOCK_ACCOUNT_ERROR':
    case 'UPDATE_BOOK_ERROR':
    case 'BORROW_EVENT_ERROR':
    case 'RETURN_EVENT_ERROR':
      return {
        ...state,
        message : action.payload
      }
    default:
      return state
  }
}

export const ownerDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_OWNERDETAILS_SUCCESS': {
      let ownerDetails = {
        'name' : action.payload[0],
        'account' : action.payload[1],
        'status' : action.payload[2],
        'dateAdded' : action.payload[3]
      }
      return ownerDetails
    }
    default:
      return state
  }
}

export const allBooksReducers = (state = [], action) => {
  switch (action.type) {
    case 'GET_ALL_BOOKS_SUCCESS': {
      let books = action.payload[0]
      let myBooks = []
      if(books !==""){
        myBooks = books.split('|').map((book) => {
          book = book.split(';')
          return {
            'id' : book[0],
            'title' : book[1],
            'author' : book[2],
            'publisher' : book[3],
            'owner' : '0x' + book[4],
            'borrower' : '0x' + book[5],
            'state' : book[6],
            'dateAdded' : book[7],
            'dateIssued' : book[8],
            'imageUrl' : book[9],
            'description' : book[10],
            'genre' : book[11],
          'avgRating': +book[12],
          'totalRating': +book[13],
          'reviewersCount': +book[14]
          }
        })
      }
      myBooks = shuffleArray(myBooks)
      return {
        ...state,
        allBooks : myBooks
      }
    }
    case 'SEARCH_BOOK': {
      const filteredBooks = state.allBooks.filter((book) => {
        return (
          book.title.toLowerCase().includes(action.payload.toLowerCase())
          || book.author.toLowerCase().includes(action.payload.toLowerCase())
          || book.publisher.toLowerCase().includes(action.payload.toLowerCase()))
      })
      return {
        ...state,
        filteredBooks : filteredBooks,
        value: action.payload
      }
    }
    case 'GET_RATE_BOOK_SUCCESS': {
      const booksRating = action.payload
      booksRating.bookId = booksRating.bookId.valueOf()
      booksRating.rating = parseInt(booksRating.rating.valueOf())
      let books = [...state.allBooks]
      let allBooks = books.map(book => {
        book.reviewers = book.reviewers || []
        book.ratings = book.ratings || []
        book.comments = book.comments || []
        if(book.id === booksRating.bookId) {
          const index = book.reviewers.indexOf(booksRating.reviewer)
          let oldRating = 0
          if(index !== -1) {
            oldRating = book.ratings[index]
            book.ratings[index] = booksRating.rating
            book.reviewers[index] = booksRating.reviewer
            book.comments[index] = booksRating.comments
          } else {
            book.ratings.push(booksRating.rating)
            book.reviewers.push(booksRating.reviewer)
            book.comments.push(booksRating.comments)
          }
          if(booksRating.flag) {
            if(oldRating === 0) {
              book.reviewersCount += 1
            }
            book.totalRating += booksRating.rating - oldRating
            book.avgRating = book.totalRating / book.reviewersCount;
          }
        }
        return book;
      })
      return {
        ...state,
        allBooks
      }
    }
    case 'GET_ADD_BOOKS_SUCCESS': {
      return state
    }
    case 'GET_BORROW_BOOKS_SUCCESS': {
      const id = state.allBooks.findIndex(x => x.id==action.payload.book.id)
      action.payload.book.borrower = action.payload.owner
      action.payload.book.dateIssued = Date.now()
      action.payload.book.state = '1'
      const books = [
        ...state.allBooks.slice(0,id),
        action.payload.book,
        ...state.allBooks.slice(id+1)
      ]
      return {
        ...state,
        allBooks : books
      }
    }
    case 'GET_RETURN_BOOKS_SUCCESS': {
      const id = state.allBooks.findIndex(x => x.id==action.payload.id)
      action.payload.borrower = '0x0'
      action.payload.dateIssued = '0'
      action.payload.state = '0'
      const books = [
        ...state.allBooks.slice(0,id),
        action.payload,
        ...state.allBooks.slice(id+1)
      ]
      return {
        ...state,
        allBooks : books
      }
    }
    case 'SHUFFLE_ALL_BOOKS': {
      let shuffleBookList = action.payload.length ? shuffleArray(action.payload) : action.payload
      return {
        ...state,
        allBooks: shuffleBookList
      }
    }
    default:
      return state
  }
}

export const myBooksReducers = (state = [], action) => {
  switch (action.type) {
    case 'GET_MY_BOOKS_SUCCESS': {
      let books = action.payload[0]
      let myBooks = books.split('|').map((book) => {
        book = book.split(';')
        return {
          'id' : book[0],
          'title' : book[1],
          'author' : book[2],
          'publisher' : book[3],
          'owner' : '0x' + book[4],
          'borrower' : '0x' + book[5],
          'state' : book[6],
          'dateAdded' : book[7],
          'dateIssued' : book[8],
          'imageUrl' : book[9],
          'description' : book[10],
          'genre' : book[11]
        }
      })
      return myBooks
    }
    default:
      return state
  }
}

export const existingMemberReducer = (state=[], action) => {
  switch (action.type) {
    case 'GET_MEMBER_DETAILS_EMAIL_SUCCESS':
      return action.payload
    case 'LOGOUT':
      return action.payload
    case 'UNLOCK_ACCOUNT_ERROR':
      return []
    case 'GET_BORROW_BOOKS_LOADING':
    case 'RATE_BOOK_LOADING':
      return {
        ...state,
        callbackFn: null,
        argsArr: null
      }
    default:
      return state
  }
}

export const bookHistoryReducer = (state=[], action) => {
  switch (action.type) {
    case 'BORROW_EVENT_SUCCESS' : {
      const borrowEvent = action.payload
      const bookId = borrowEvent.bookId.valueOf()
      const timestamp = parseInt(borrowEvent.timestamp.valueOf())
      let borrow_history = { ...state.borrow_history }
      borrow_history[bookId] = borrow_history[bookId] || []
      borrow_history[bookId].push({ timestamp, borrower: borrowEvent.borrower })
      return {
        ...state,
        borrow_history
      }
    }
    case 'RETURN_EVENT_SUCCESS' : {
      const returnEvent = action.payload
      const bookId = returnEvent.bookId.valueOf()
      const timestamp = parseInt(returnEvent.timestamp.valueOf())
      let return_history = { ...state.return_history }
      return_history[bookId] = return_history[bookId] || []
      return_history[bookId].push({ timestamp, borrower: returnEvent.borrower })
      return {
        ...state,
        return_history
      }
    }
    default:
      return state;
  }
}
