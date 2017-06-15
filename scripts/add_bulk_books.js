// USAGE: "truffle exec add_bulk_books.js".
// Add the bulk books using the addBook function.
// TODO Write unit test for the bulk upload script.

var Contract =  require("../app/config.js");
var data = require("./mock_data/books.json");
const LMS = artifacts.require("../contracts/LMS.sol");

module.exports = function(handleError) {
    //Calculating the nonce count to avoid the ambiguity of setting the same nonce to more than one transaction.
    var nonceCount = web3.eth.getTransactionCount(web3.eth.accounts[0])

    LMS.at(Contract.id).then( function(result) {
        for (var i = 0; i < data.books.length; i++) {
            //Iterating the mock data to call the addBook function
            result.addBook(data.books[i].title, data.books[i].author, data.books[i].publisher,
                data.books[i].img, data.books[i].description, data.books[i].genre,
                {"nonce": nonceCount+i }
            ).then(
                function(res) {
                    console.log(res)
                }
            ).catch(
                function(err) {
                    console.log(err)
                }
            )
        }
    })
}

var handleError = function(error) {
    console.log(error)
}
