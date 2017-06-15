// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import lmsArtifacts from '../build/contracts/LMS.json'

// Import contract address
import contractConfig from './config'

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

let lms = LMS.at(contractConfig.id)

export { lms, web3 }
