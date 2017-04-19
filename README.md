Note - Under Development!

# library_management_system_blockchain
A community library management system built using ethereum blockchain.

Setup -

Install testrpc and truffle
$ npm install -g ethereumjs-testrpc
$ npm install -g truffle
$ truffle install zeppelin
$ #clone the repo

Usage -

$ truffle compile # this would compile all available or newly added contracts
$ truffle deploy # this would deploy artifacts
$ truffle test # to run test cases

Debug -

$ truffle console
truffle(development)> compile
truffle(development)> lms.new('Owner name')
If getOwner is a constant function, you will get the output immediately on the console

truffle(development)> lms.at("contract address").getOwner()   
if getOwner is not a constant function, use events (say Owner is an event).

truffle(development)> lms.at('contract address').getOwner()
truffle(development)> lms.at('contract address').Owner(function (e, result) { if (!e) {console.log(result)}})

