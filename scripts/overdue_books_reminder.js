/**
This script will run with a cron jon &
will iterate through all books and find out
overdue book borrowers and send them email reminders

Note: The LMS contract is not being deployed here, 
Script is using contract address copied from truffle 
in app/config.js file
*/
// import dependencies
var fs = require("fs");
var Web3 = require('web3');
var web3 = new Web3();
// set http provider for web3, pointing to geth node location
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// import mailinjs npm package for sending email
// & instantiate constructor by passing API URL and API key
require('mailin-api-node-js');
var client = new Mailin("https://api.sendinblue.com/v2.0","apikey");

// import contract id from app/config.js
var contract_id =  require("../app/config.js");

// use following command to generate LMS.json
// solc LMS.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > LMS.json
var source = fs.readFileSync("../build/LMS.json");
var contracts = JSON.parse(source).contracts;

// generate the contract ABI definition
var abi = JSON.parse(contracts["../contracts/LMS.sol:LMS"].abi);
// following two line of code is not being used,
// as we are not deploying the contract here
var code = '0x'+contracts['../contracts/LMS.sol:LMS'].bin;
var gasEstimate = web3.eth.estimateGas({data: code});
var LMS = web3.eth.contract(abi);
var lms = LMS.at(contract_id.id);

// get all existing book from blockchain
var allBooks = lms.getAllBooks()[0].split("|");

// get timestamp of 10 days back
var d = new Date();
var timestamp = (d.setDate(d.getDate() - 10)) / 1000 | 0;

// function to convert name in title case for better email formatting
function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}

// loop through all books to check overdue book borrowers
for (var i = 0; i <= allBooks.length-1; i++) {
	var book = allBooks[i].split(";");
	// if book is not borrowed then move to next iteration
	if (parseInt(book[8]) === 0) {
		continue;
	}
	// if issued date timestamp is less than the timestamp of 
	// 10 days back then send borrowed an email notification
	if (parseInt(book[8]) < timestamp) {
		var borrower = '0x'+book[5].toString();
		var owner = '0x'+book[4].toString();
		var borrowerDetails = lms.getMemberDetailsByAccount(borrower);
		var borrowerEmail = borrowerDetails[2];
		var borrowerName = borrowerDetails[0];
		var ownerName = lms.getMemberDetailsByAccount(owner)[0];
		var issuedDate =  new Date(parseInt(book[8])*1000);
		// calculate duedate using issuedDate timestamp
		var dueDate = new Date(issuedDate.setDate(issuedDate.getDate()+10));
		var currentDate = new Date();
		// calculate time difference between duedate and currentdate in hours
		var timeDiff = Math.abs(currentDate.getTime() - dueDate.getTime());
		var timeDiffHours = timeDiff / (1000 * 3600);
		var daysDiff = Math.floor(timeDiffHours / 24);
		var hoursDiff = Math.floor(timeDiffHours % 24);
		// email payload
		var data = {"to": {[borrowerEmail] : borrowerName},
				"from" : ["bookshelf.admin@pramati.com", "Bookshelf admin"],
				"subject" : "Overdue book reminder",
				"html" : "<p>Hi "+titleCase(borrowerName)+",</p></br><p>\
						This is to inform you that a book borrowed by you \
						- <b>'"+book[1]+"'</b> is overdue by  <b>'"+daysDiff+" days and "+hoursDiff+" hours'</b> from the given due date.</br> \
						Kindly return it to the book owner - <b>'"+titleCase(ownerName)+"'</b>, as per your \
						earliest convienence. In the case of any issues, \
						kindly contact Bookshelf admin at \
						<a href='mailto:bookshelf@imaginea.com'>bookshelf@imaginea.com</a>.\
						</p></br><p>Note: This is an auto-generated email, \
						please do not respond back.</p></br><p>Thanks,</br>Team Bookshelf</p>"
			};
		client.send_email(data).on('complete', function(data) {
		console.log(data);
			});
	}
	}

// Keeping this commented code for future purpose, in case
// we have to deploy the contract in nodejs

// var lms = LMS.new("sanchit", "s@a.com", {
//    from:web3.eth.coinbase,
//    data:code,
//    gas: gasEstimate
//  }, function(err, myContract){
//     if(!err) {
//        if(!myContract.address) {
//            console.log(myContract.transactionHash) 
//        } else {
//            console.log(myContract.address) 
//        }
//     }
//   });
