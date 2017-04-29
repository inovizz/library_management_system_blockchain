// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import lmsArtifacts from '../../build/contracts/LMS.json'

import contractConfig from '../config'

const LMS = contract(lmsArtifacts)
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
let web3
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(web3.currentProvider)
} else {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

LMS.setProvider(web3.currentProvider)

export const getAccountsLoading = (flag) => {
  return {
    type: 'GET_ACCOUNTS_LOADING',
    payload: flag
  }
}

export const getAccountsError = (err) => {
  return {
    type: 'GET_ACCOUNTS_ERROR',
    payload: err
  }
}

export const getAccountsSuccess = (accs) => {
  return {
    type: 'GET_ACCOUNTS_SUCCESS',
    payload: accs
  }
}

export const getAccounts = () => {
  return (dispatch) => {
    dispatch(getAccountsLoading(true))
    web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        dispatch(getAccountsError(err))
      }
      dispatch(getAccountsSuccess(accs))
      dispatch(getAccountsLoading(false))
    })
  }
}

export const getOwnerDetailsLoading = (flag) => {
  return {
    type: 'GET_OWNERDETAILS_LOADING',
    payload: flag
  }
}

export const getOwnerDetailsError = (err) => {
  return {
    type: 'GET_OWNERDETAILS_ERROR',
    payload: err
  }
}

export const getOwnerDetailsSuccess = (details) => {
  return {
    type: 'GET_OWNERDETAILS_SUCCESS',
    payload: details
  }
}

export const getOwnerDetails = (account) => {
  return (dispatch) => {
    dispatch(getOwnerDetailsLoading(true))
    LMS.at(contractConfig.id).then((instance) => {
      return instance.getOwnerDetails.call()
    }).then((value) => {
      dispatch(getOwnerDetailsSuccess(value))
      dispatch(getOwnerDetailsLoading(false))
    }).catch((e) => {
      dispatch(getOwnerDetailsError(e))
      dispatch(getOwnerDetailsLoading(false))
    })
  }
}

export const getAllBooksLoading = (flag) => {
  return {
    type: 'GET_ALL_BOOKS_LOADING',
    payload: flag
  }
}

export const getAllBooksError = (err) => {
  return {
    type: 'GET_ALL_BOOKS_ERROR',
    payload: err
  }
}

export const getAllBooksSuccess = (books) => {
  return {
    type: 'GET_ALL_BOOKS_SUCCESS',
    payload: books
  }
}

export const getAllBooks = () => {
  return (dispatch) => {
    dispatch(getAllBooksLoading(true))
    LMS.at(contractConfig.id).then((instance) => {
      return instance.getAllBooks.call()
    }).then((books) => {
      dispatch(getAllBooksSuccess(books))
      dispatch(getAllBooksLoading(false))
    }).catch((e) => {
      dispatch(getAllBooksError(e))
      dispatch(getAllBooksLoading(false))
    })
  }
}

export const getMyBooksLoading = (flag) => {
  return {
    type: 'GET_MY_BOOKS_LOADING',
    payload: flag
  }
}

export const getMyBooksError = (err) => {
  return {
    type: 'GET_MY_BOOKS_ERROR',
    payload: err
  }
}

export const getMyBooksSuccess = (books) => {
  return {
    type: 'GET_MY_BOOKS_SUCCESS',
    payload: books
  }
}

export const getMyBooks = () => {
  return (dispatch) => {
    dispatch(getMyBooksLoading(true))
    LMS.at(contractConfig.id).then((instance) => {
      return instance.getMyBooks.call()
    }).then((books) => {
      dispatch(getMyBooksSuccess(books))
      dispatch(getMyBooksLoading(false))
    }).catch((e) => {
      dispatch(getMyBooksError(e))
      dispatch(getMyBooksLoading(false))
    })
  }
}
