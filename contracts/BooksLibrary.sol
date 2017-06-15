pragma solidity ^0.4.0;

import "./DataStore.sol";


library BooksLibrary {

    // Status of transaction. Used for error handling.
    event Status(uint indexed statusCode);

    // Book has following states: 0 (Available), 1 (Borrowed)

    function bookCount(address bookStoreAddress) constant returns (uint count) {
        return DataStore(bookStoreAddress).count();
    }

    function addBook(address bookStoreAddress, uint isbn13) public {
        // TODO Only members should be able to add books
        if (this.balance < 10**12) {
            Status(120);
            return;
        }
        if (!msg.sender.send(10**12)) {
            Status(121);
            return;
        }
        var bookStore = DataStore(bookStoreAddress);
        bookStore.addNew();
        // TODO Find if addNew can be called simultaneously. If yes, the below index will not point to correct entry.
        var index = bookStore.count();

        bookStore.setIntValue(index, sha3('isbn'), isbn13);
        bookStore.setIntValue(index, sha3('dateAdded'), now);
        bookStore.setAddressValue(index, sha3('owner'), msg.sender);
    }

    function getBook(address bookStoreAddress, uint id) constant returns (uint index, uint isbn, uint state, address owner, address borrower, uint dateAdded, uint dateIssued, uint totalRating, uint reviewersCount) {
        var bookStore = DataStore(bookStoreAddress);
        if (id < 1 || id > bookStore.count()) {
            return;
        }
        index = id;
        isbn = bookStore.getIntValue(id, sha3('isbn'));
        state = bookStore.getIntValue(id, sha3('state'));
        owner = bookStore.getAddressValue(id, sha3('owner'));
        borrower = bookStore.getAddressValue(id, sha3('borrower'));
        dateAdded = bookStore.getIntValue(id, sha3('dateAdded'));
        dateIssued = bookStore.getIntValue(id, sha3('dateIssued'));
        totalRating = bookStore.getIntValue(id, sha3('totalRating'));
        reviewersCount = bookStore.getIntValue(id, sha3('reviewersCount'));
    }

    function borrowBook(address bookStoreAddress, uint id) {
        var bookStore = DataStore(bookStoreAddress);
        // Can't borrow book if passed value is not sufficient
        if (msg.value < 10**12) {
            Status(123);
            return;
        }
        // Can't borrow a non-existent book
        if (id > bookStore.count() || bookStore.getIntValue(id, sha3('state')) != 0) {
            Status(124);
            return;
        }
        // 50% value is shared with the owner
        var owner_share = msg.value/2;
        if (!bookStore.getAddressValue(id, sha3('owner')).send(owner_share)) {
            Status(125);
            return;
        }

        bookStore.setAddressValue(id, sha3('borrower'), msg.sender);
        bookStore.setIntValue(id, sha3('dateIssued'), now);
        bookStore.setIntValue(id, sha3('state'), 1);
//        Borrow(id, msg.sender, catalog[id].dateIssued);
    }

    function returnBook(address bookStoreAddress, uint id) {
//        address borrower;
        var bookStore = DataStore(bookStoreAddress);
        if (id > bookStore.count()
                || bookStore.getIntValue(id, sha3('state')) == 0
                || bookStore.getAddressValue(id, sha3('owner')) != msg.sender)
        {
            Status(126);
            return;
        }
//        borrower = catalog[id].borrower;
        bookStore.setAddressValue(id, sha3('borrower'), 0x0);
        bookStore.setIntValue(id, sha3('dateIssued'), 0);
        bookStore.setIntValue(id, sha3('state'), 0);
//        Return(id, borrower, now);
    }

    function rateBook(address bookStoreAddress, uint id, uint rating, uint oldRating, string comments) {
        var bookStore = DataStore(bookStoreAddress);
        if (id > bookStore.count() || rating < 1 || rating > 5) {
            Status(127);
            return;
        }
        if (oldRating == 0) {
            bookStore.setIntValue(id, sha3('reviewersCount'), bookStore.getIntValue(id, sha3('reviewersCount')) + 1);
            bookStore.setIntValue(id, sha3('totalRating'), bookStore.getIntValue(id, sha3('totalRating')) + rating);
        } else {
            bookStore.setIntValue(
                id, sha3('totalRating'),
                bookStore.getIntValue(id, sha3('totalRating')) + rating - oldRating
            );
        }

        // All reviews are logged. Applications are responsible for eliminating duplicate ratings
        // and computing average rating.
//        Rate(id, msg.sender, rating, comments, now);
    }
}
