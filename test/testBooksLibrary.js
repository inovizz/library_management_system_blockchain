'use strict';

const DataStore = artifacts.require('../contracts/DataStore.sol');
const BooksLibrary = artifacts.require('../contracts/BooksLibrary.sol');

contract('BooksLibrary', function(accounts) {
    let store, booksLibrary;

    beforeEach(async function() {
        store = await DataStore.new();
        booksLibrary = await BooksLibrary.new();
    });

    describe('bookCount', function() {
        it('should fetch the number of books in the library', async function() {
            let count = await booksLibrary.bookCount(store.address);
            assert.equal(count.valueOf(), 0);
        });
    });

});
