import contractConfig from '../config'
import { web3, lms } from '../web3'
import actionType from './actionTypes'
import { sessionService } from 'redux-react-session'
import axios from 'axios'
import NotificationType from '../components/notifications/NotificationTypes'

export const action = (type, flag) => {
  return {
    type: type,
    payload: flag
  }
}

export const isSuccess = (response) => {
  return !(response.logs.length && response.logs[0].event === 'Status')
}

export const getAccounts = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ACCOUNTS_LOADING, true))
    web3.eth.getAccounts((e, accs) => {
      if (e != null) {
        console.log("Error Occured", e)
        dispatch(action(actionType.GET_ACCOUNTS_ERROR, NotificationType('error', 'Error', e.message)))
      } else {
        dispatch(action(actionType.GET_ACCOUNTS_SUCCESS, accs))
      }
      dispatch(action(actionType.GET_ACCOUNTS_LOADING, false))
    })
  }
}

export const getBalance = (ownerDetails) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_USER_BALANCE_LOADING, true))
    web3.eth.getBalance(ownerDetails.account, (e, balance) => {
      if (e != null) {
        console.log("Error Occured", e)
        dispatch(action(actionType.GET_USER_BALANCE_ERROR, NotificationType('error', 'Error', e.message)))
      } else {
        balance = web3.fromWei(balance, 'ether')
        dispatch(action(actionType.GET_USER_BALANCE_SUCCESS, balance))
      }
      dispatch(action(actionType.GET_USER_BALANCE_LOADING, false))
    })
  }
}

export const getOwnerDetails = (response) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_OWNERDETAILS_LOADING, true))
    lms.getOwnerDetails.call().then((user) => {
      login(response, user)
      dispatch(action(actionType.GET_OWNERDETAILS_SUCCESS, user))
      dispatch(action(actionType.GET_OWNERDETAILS_LOADING, false))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_OWNERDETAILS_ERROR, NotificationType('error', 'Error', e.message)))
      dispatch(action(actionType.GET_OWNERDETAILS_LOADING, false))
    })
  }
}

export const getAllBooks = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ALL_BOOKS_LOADING, true))
    lms.getAllBooks.call().then((books) => {
      dispatch(getRatings())
      dispatch(action(actionType.GET_ALL_BOOKS_SUCCESS, books))
      dispatch(action(actionType.GET_ALL_BOOKS_LOADING, false))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_ALL_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
      dispatch(action(actionType.GET_ALL_BOOKS_LOADING, false))
    })
  }
}

export const getMyBooks = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_MY_BOOKS_LOADING, true))
    lms.getMyBooks.call().then((books) => {
      dispatch(action(actionType.GET_MY_BOOKS_SUCCESS, books))
      dispatch(action(actionType.GET_MY_BOOKS_LOADING, false))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_MY_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
      dispatch(action(actionType.GET_MY_BOOKS_LOADING, false))
    })
  }
}

export const addBook = (book) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ADD_BOOKS_LOADING, true))
    lms.addBook(
      book.title,
      book.author,
      book.publisher,
      book.imageUrl,
      book.description,
      book.genre,
      {
        from: book.owner.account,
        gas: 600000
      }
    ).then((response) => {
      if(isSuccess(response)) {
        dispatch(action(actionType.GET_ADD_BOOKS_SUCCESS, book))
        dispatch(getAllBooks())
      } else {
        dispatch(action(
          actionType.GET_ADD_BOOKS_ERROR,
          NotificationType('error', 'Error', response.logs[0].args.statusCode.c[0])
        ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_ADD_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_ADD_BOOKS_LOADING, false))
      dispatch(getBalance(book.owner))
    })
  }
}

export const updateBook = (bookId, book) => {
  return (dispatch) => {
    dispatch(action(actionType.UPDATE_BOOK_LOADING, true))
    lms.updateBook(
      bookId,
      book.title,
      book.author,
      book.publisher,
      book.imageUrl,
      book.description,
      book.genre,
      {
        from: book.owner.account,
        gas: 600000
      }
    ).then((response) => {
      if(isSuccess(response)) {
        dispatch(getAllBooks())
      } else {
        dispatch(action(
          actionType.UPDATE_BOOK_ERROR,
          NotificationType('error', 'Error', response.logs[0].args.statusCode.c[0])
        ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.UPDATE_BOOK_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.UPDATE_BOOK_LOADING, false))
      dispatch(getBalance(book.owner))
    })
  }
}

export const returnBook = (book) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_RETURN_BOOKS_LOADING, true))
    lms.returnBook(book.id, { from : book.owner, gas: 200000 }).then((response) => {
      if(isSuccess(response)) {
        dispatch(action(actionType.GET_RETURN_BOOKS_SUCCESS, book))
      } else {
          dispatch(action(
            actionType.GET_RETURN_BOOKS_ERROR,
            NotificationType('error', 'Error', response.logs[0].args.statusCode.c[0])
          ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_RETURN_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_RETURN_BOOKS_LOADING, false))
      dispatch(getBalance({ account: book.owner }))
    })
  }
}

export const borrowBook = (book, ownerDetails) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_BORROW_BOOKS_LOADING, true))
    lms.borrowBook(book.id, { from: ownerDetails.account, value: web3.toWei(0.1), gas: 200000 }).then((response) => {
      if(isSuccess(response)) {
        dispatch(action(actionType.GET_BORROW_BOOKS_SUCCESS, { book, owner: ownerDetails.account }))
      } else {
          dispatch(action(
            actionType.GET_BORROW_BOOKS_ERROR,
            NotificationType('error', 'Error', response.logs[0].args.statusCode.c[0])
          ))
      }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_BORROW_BOOKS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_BORROW_BOOKS_LOADING, false))
      dispatch(getBalance(ownerDetails))
    })
  }
}

export const searchBook = (book) => {
  return action(actionType.SEARCH_BOOK, book)
}

export const rateBook = (rating, comment, book, ownerDetails) => {
  return (dispatch) => {
    dispatch(action(actionType.RATE_BOOK_LOADING, true))
    const reviewers = book.reviewers || []
    const index = reviewers.indexOf(ownerDetails.account)
    const oldRating = (index === -1) ? 0 : book.ratings[index]
    lms.rateBook(book.id, rating, comment, oldRating, {
        from: ownerDetails.account,
        gas: 300000
      }).then((response) => {
        if(isSuccess(response)) {
          dispatch(action(actionType.GET_RATE_BOOK_SUCCESS, {
            bookId: book.id,
            rating: rating,
            comments: comment,
            reviewer: ownerDetails.account,
            flag: true
          }))
        } else {
          dispatch(action(
            actionType.RATE_BOOK_ERROR,
            NotificationType('error', 'Error', response.logs[0].args.statusCode.c[0])
          ))
        }
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.RATE_BOOK_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.RATE_BOOK_LOADING, false))
      dispatch(getBalance(ownerDetails))
    })
  }
}

export const login = (response, userVal) => {
  return (dispatch) => {
    sessionService.saveSession(response)
    .then(() => {
      const user = {
        'name' : userVal[0],
        'account' : userVal[1],
        'email' : userVal[2]
      }
      sessionService.saveUser(user)
      dispatch(getBalance(user))
    }).catch(e => dispatch(action(actionType.LOGIN_ERROR, NotificationType('error', 'Error', e.message))))
  }
}

export const logout = () => {
  return (dispatch) => {
    sessionService.deleteSession()
    sessionService.deleteUser()
    if(window.gapi) {
        window.gapi.auth2.getAuthInstance().disconnect()
    }
    dispatch(action(actionType.LOGOUT,[]))
  }
}

export const getMemberDetailsByEmail = (response, callbackFn, argsArr ) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_LOADING, true))
    lms.getMemberDetailsByEmail(response.profileObj.email).then((user) => {
      dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_SUCCESS, { session: response, user, callbackFn, argsArr }))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_MEMBER_DETAILS_EMAIL_LOADING, false))
    })
  }
}

export const getMemberDetailsByAccount = (account) => {
  return (dispatch) => {
    dispatch(action(actionType.GET_MEMBER_DETAILS_LOADING, true))
    lms.getMemberDetailsByAccount(account).then((user) => {
      dispatch(action(actionType.GET_MEMBER_DETAILS_SUCCESS, user))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_MEMBER_DETAILS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_MEMBER_DETAILS_LOADING, false))
    })
  }
}

export const getAllMembers = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_ALL_MEMBERS_LOADING, true))
    lms.getAllMembers().then((users) => {
      dispatch(action(actionType.GET_ALL_MEMBERS_SUCCESS, users))
    }).catch((e) => {
      console.log("Error Occured", e)
      dispatch(action(actionType.GET_ALL_MEMBERS_ERROR, NotificationType('error', 'Error', e.message)))
    }).then(() => {
      dispatch(action(actionType.GET_ALL_MEMBERS_LOADING, false))
    })
  }
}

export const getRatings = () => {
  return (dispatch) => {
    dispatch(action(actionType.GET_RATE_BOOK_LOADING, true))
    var rateEvent = lms.Rate({}, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    rateEvent.watch(function(e, result) {
      rateEvent.stopWatching();
      if (e) {
        console.log("Error Occured", e)
        dispatch(action(actionType.GET_RATE_BOOK_ERROR, NotificationType('error', 'Error', e.message)))
      } else {
        dispatch(action(actionType.GET_RATE_BOOK_SUCCESS, result.args))
      }
      dispatch(action(actionType.GET_RATE_BOOK_LOADING, false))
    });
  }
}

export const createAccount = (session,password) => {
  return (dispatch) => {
    dispatch(action(actionType.CREATE_ACCOUNT_LOADING, true))
    const request = {
      "jsonrpc":"2.0",
      "method":"personal_newAccount",
      "params":[password],
      "id":74
    }
    return axios.post('/api/create_account',request)
            .then((response) => {
              const user = [
                session.profileObj.name,
                response.data.data.result,
                session.profileObj.email
              ];
              dispatch(unlockAccount(session, user, password, true))
            })
            .catch((e) => {
              console.log("Error Occured", e)
              dispatch(action(actionType.CREATE_ACCOUNT_ERROR, NotificationType('error', 'Error', e.message)))
            }).then(() => {
              dispatch(action(actionType.CREATE_ACCOUNT_LOADING, false))
            });
  };
}

export const addMember = (member) => {
  return (dispatch) => {
    dispatch(action(actionType.ADD_MEMBER_LOADING, true))
    lms.addMember(member[0], member[1], member[2], {
            from: web3.eth.accounts[0],
            gas: 600000
          }).then((response) => {
            if(isSuccess(response)) {
              web3.eth.sendTransaction({
                from: web3.eth.accounts[0],
                to: member[1],
                value: web3.toWei(1000)
              }, (e, res) => {
                if(e) {
                  return dispatch(action(actionType.ADD_MEMBER_ERROR, NotificationType('error', 'Error', e.message)))
                }
                dispatch(getAllMembers())
                dispatch(action(actionType.ADD_MEMBER_SUCCESS, true))
              })
            } else {
              dispatch(action(
                actionType.ADD_MEMBER_ERROR,
                NotificationType('error', 'Error', response.logs[0].args.statusCode.c[0])
              ))
            }
        }).catch((e) => {
          console.log("Error Occured", e)
          dispatch(action(actionType.ADD_MEMBER_ERROR, NotificationType('error', 'Error', e.message)))
        }).then(() => {
          dispatch(action(actionType.ADD_MEMBER_LOADING, false))
        })
  }
}

export const unlockAccount = (session, user, password, flag) => {
  return (dispatch) => {
    dispatch(action(actionType.UNLOCK_ACCOUNT_LOADING, true))
    web3.personal.unlockAccount(user[1], password, 0, (e, res) => {
      dispatch(action(actionType.UNLOCK_ACCOUNT_LOADING, false))
      if(e) {
        dispatch(action(actionType.UNLOCK_ACCOUNT_ERROR, NotificationType('error', 'Error', e.message)))
        return
      }
      if(flag) {
        dispatch(addMember(user))
      }
      dispatch(login(session, user))
    })
  }
}

export const shuffleAllBooks = (books) =>{
  return (dispatch) => {
    dispatch(action(actionType.SHUFFLE_ALL_BOOKS,books))
  }
}

export const borrowEvent = (bookId) => {
  return (dispatch) => {
    dispatch(action(actionType.BORROW_EVENT_LOADING, true))
    var borrowEvent = lms.Borrow({ bookId }, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    borrowEvent.watch(function(e, result) {
      borrowEvent.stopWatching();
      if (e) {
        console.log("Error Occured", e)
        dispatch(action(actionType.BORROW_EVENT_ERROR, NotificationType('error', 'Error', e.message)))
      } else {
        dispatch(action(actionType.BORROW_EVENT_SUCCESS, result.args))
      }
      dispatch(action(actionType.BORROW_EVENT_LOADING, false))
    });
  }
}

export const returnEvent = ( bookId ) => {
  return (dispatch) => {
    dispatch(action(actionType.RETURN_EVENT_LOADING, true))
    var returnEvent = lms.Return({ bookId }, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    returnEvent.watch(function(e, result) {
      returnEvent.stopWatching();
      if (e) {
        console.log("Error Occured", e)
        dispatch(action(actionType.RETURN_EVENT_ERROR, NotificationType('error', 'Error', e.message)))
      } else {
        dispatch(action(actionType.RETURN_EVENT_SUCCESS, result.args))
      }
      dispatch(action(actionType.RETURN_EVENT_LOADING, false))
    });
  }
}
