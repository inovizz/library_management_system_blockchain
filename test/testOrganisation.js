'use strict';

const DataStore = artifacts.require('../contracts/DataStore.sol');
const Organisation = artifacts.require('../contracts/Organisation.sol');

contract('Organisation', function(accounts) {
    let bookStore, memberStore, org;

    beforeEach(async function() {
        bookStore = await DataStore.new();
        memberStore = await DataStore.new();
        org = await Organisation.new({value: web3.toWei(0.1)});
        // Transfer ownership of stores from default account to organisation. This allows modifying the data store.
        bookStore.transferOwnership(org.address);
        memberStore.transferOwnership(org.address);
        await org.setDataStore(bookStore.address, memberStore.address);
        await org.addMember('name', 'email', accounts[0]);
        // await org.setDataStore(0x0, 0x0);
        // TODO Investigate why org works with 0x0 data stores too.
    });

    it('should have no books by default', async function () {
        let count =  await org.bookCount()
        assert.equal(count, 0);
    });

    it('should have one member by default', async function() {
        let count =  await org.memberCount()
        assert.equal(count, 1);
    });

    describe('addMember', function() {
        it('should add the member', async function() {
            let count = await org.memberCount();
            assert.equal(count.valueOf(), 1);
            let member = await org.getMember(1);
            let attr = member.split(';');
            assert.equal(attr[0], '1');
            assert.equal('0x' + attr[1], accounts[0]);
            assert.equal(attr[2], '0');
            assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);
        });
        it('should not add the member again', async function() {
            let count = await org.memberCount();
            assert.equal(count.valueOf(), 1);

            let res = await org.addMember('name', 'email', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
        });
    });

    describe('removeMember', function() {
        it('should deactivate the member', async function() {
            await org.removeMember(accounts[0]);
            let count = await org.memberCount();
            assert.equal(count.valueOf(), 1);
            let member = await org.getMember(1);
            let attr = member.split(';');
            assert.equal(attr[0], '1');
            assert.equal('0x' + attr[1], accounts[0]);
            assert.equal(attr[2], '1');
            assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);
        });
    });

    describe('getAllMembers', function() {
        it('should provide details of all members', async function() {
            let info = [
                {name: 'John Doe', email: 'john.doe@gmail.com'},
                {name: 'Jane Doe', email: 'jane.doe@gmail.com'},
                {name: 'Johnny Appleseed', email: 'johnny@apple.com'},
            ];
            for (let i=0; i<3; i++) {
                await org.addMember(info[i].name, info[i].email, accounts[i+1]);
            }
            let [members, count] = await org.getAllMembers();
            assert.equal(count, 4);     // Including the default member
            members = members.split('|');
            for (let i=1; i<4; i++) {
                let attr = members[i].split(';');
                let name = await memberStore.getStringValue(attr[0], 'name');
                let email = await memberStore.getStringValue(attr[0], 'email');
                assert.equal(attr[0], i+1);     // ID starts from 1, not 0.
                assert.equal('0x' + attr[1], accounts[i]);
                assert.equal(attr[2], '0');
                assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
                assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);
                assert.equal(name, info[i-1].name);
                assert.equal(email, info[i-1].email);
            }
        });
    });

    describe('addBook', function() {
        it('should add a book with given details', async function() {
            await org.addBook(9781234512345);
            let count = await org.bookCount();
            assert.equal(count.valueOf(), 1);
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '0');
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], 0x0);
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[6], '0');
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
    });

    describe('getAllBooks', function() {
        it('should return all books, irrespective of who owns them', async function() {
            await org.addMember('name1', 'email1', accounts[1]);
            await org.addMember('name2', 'email2', accounts[2]);
            let ISBNs = [9780001112222, 9780001113333, 9780001114444];
            for (let i = 0; i < 3; i++) {
                await org.addBook(ISBNs[i], {from: accounts[i]});
            }
            let bookCount = await org.bookCount();
            assert.equal(bookCount.valueOf(), 3);
            let [books, count] = await org.getAllBooks();
            assert.equal(count.valueOf(), 3);
            books = books.split('|');
            for (let i = 0; i < count; i++) {
                let bookAttr = books[i].split(';');
                assert.equal(bookAttr[0], i+1);
                assert.equal(bookAttr[1], ISBNs[i]);
                assert.equal(bookAttr[2], '0');
                assert.equal('0x' + bookAttr[3], accounts[i]);
                assert.equal('0x' + bookAttr[4], 0x0);
                assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
                assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[6], '0');
                assert.equal(bookAttr[7], '0');
                assert.equal(bookAttr[8], '0');
            }
        });
    });

    describe('borrowBook', function() {
        it('should set borrower details', async function() {
            await org.addBook(9781234512345);
            await org.addMember('name1', 'email1', accounts[1]);
            await org.borrowBook(1, {from: accounts[1], value: web3.toWei(0.1) /2 });
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '1');                 // State changed to 1
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], accounts[1]);  // Borrower address
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.isAtMost(bookAttr[6], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[6], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
    });

    describe('returnBook', function() {
        it('should reset borrower details', async function() {
            await org.addBook(9781234512345);
            await org.addMember('name1', 'email1', accounts[1]);
            await org.borrowBook(1, {from: accounts[1]});
            await org.returnBook(1);
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '0');
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], 0x0);
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[6], '0');
            assert.equal(bookAttr[7], '0');
            assert.equal(bookAttr[8], '0');
        });
    });

     describe('rateBook', function() {
        it('should allow a member to rate and write descriptive reviews of a book', async function() {
            await org.addBook(9781234512345);
            await org.rateBook(1, 5, 0, 'Great book on Solidity testing!');
            let book = await org.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[0], '1');
            assert.equal(bookAttr[1], '9781234512345');
            assert.equal(bookAttr[2], '0');
            assert.equal('0x' + bookAttr[3], accounts[0]);
            assert.equal('0x' + bookAttr[4], 0x0);
            assert.isAtMost(bookAttr[5], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[5], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[6], '0');
            assert.equal(bookAttr[7], '5');
            assert.equal(bookAttr[8], '1');
        });
    });
});
